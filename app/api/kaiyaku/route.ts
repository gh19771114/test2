// 2版/app/api/kaiyaku/route.ts
import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { constants } from 'crypto'
import { PDFDocument, rgb } from 'pdf-lib'
import * as fontkit from 'fontkit'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { type KaiyakuFormData } from '@/lib/kaiyakuPdfTemplate'

export const runtime = 'nodejs'

async function verifyTurnstile(params: { token: string; ip?: string }) {
  const secret = (process.env.TURNSTILE_SECRET_KEY || '').trim()
  if (!secret) return true // not enabled
  if (!params.token) return false

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', params.token)
  if (params.ip) body.set('remoteip', params.ip)

  try {
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
    })
    const json: any = await resp.json().catch(() => null)
    return !!json?.success
  } catch {
    // fail closed when enabled
    return false
  }
}

// 只允许 POST
export async function POST(req: Request) {
  try {
    const smtpHost = (process.env.SMTP_HOST || '').trim()
    const smtpUser = (process.env.SMTP_USER || '').trim()
    // Gmail / Google Workspace 的 App Password 常以 "xxxx xxxx xxxx xxxx" 展示
    // 这里自动去空格/换行，避免因复制粘贴导致 535 BadCredentials
    const smtpPass = (process.env.SMTP_PASS || '').trim().replace(/\s+/g, '')
    const mailTo = (process.env.MAIL_TO || '').trim()

    // 验证环境变量
    if (!smtpHost || !smtpUser || !smtpPass || !mailTo) {
      return NextResponse.json(
        { error: '邮件配置不完整，请检查环境变量：SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const turnstileToken = String(body?.turnstileToken || '').trim()
    const turnstileSecretEnabled = !!(process.env.TURNSTILE_SECRET_KEY || '').trim()

    // Turnstile enabled -> require token and verify
    if (turnstileSecretEnabled && !turnstileToken) {
      return NextResponse.json(
        {
          error:
            '未检测到机器人验证信息。请返回预览页完成验证后再提交；若预览页未出现验证框，请确认已配置 NEXT_PUBLIC_TURNSTILE_SITE_KEY 并重新部署（Redeploy），同时检查 Turnstile Hostnames 是否包含当前访问域名。',
        },
        { status: 400 }
      )
    }

    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim()
    const ok = await verifyTurnstile({ token: turnstileToken, ip })
    if (!ok) {
      return NextResponse.json({ error: '机器人验证失败，请重试。' }, { status: 400 })
    }

    // 把前端传来的字段补上 submittedAt
    const { turnstileToken: _ts, ...pureBody } = body || {}
    const data: KaiyakuFormData = {
      ...(pureBody as KaiyakuFormData),
      submittedAt: new Date(),
    }

    // 必填兜底：邮箱 / 署名
    if (!String((data as any).email || '').trim()) {
      return NextResponse.json({ error: 'メールアドレスが未記入です。' }, { status: 400 })
    }
    if (!String((data as any).signatureDataUrl || '').trim()) {
      return NextResponse.json({ error: '署名が未記入です。' }, { status: 400 })
    }

    // 生成 PDF（二进制 Buffer）
    // NOTE: 不使用 Playwright（Vercel 运行时默认没有浏览器可执行文件）
    const pdfBuffer = await generateKaiyakuPdf(data)

    // 3. 用 Nodemailer 把 PDF 作为附件发到公司邮箱
    // 正确解析 SMTP_SECURE（环境变量是字符串）
    const isSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465'
    const smtpPort = Number(process.env.SMTP_PORT || 587)

    const transporterConfig: any = {
      host: smtpHost,
      port: smtpPort,
      secure: isSecure, // 根据环境变量设置
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      // 添加连接超时和调试选项
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 15000,
      debug: process.env.NODE_ENV === 'development',
      // TLS 配置（处理 SSL/TLS 错误）
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1',
        secureOptions: constants.SSL_OP_LEGACY_SERVER_CONNECT | constants.SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION,
        ciphers: 'DEFAULT:@SECLEVEL=1',
      },
    }

    // 如果使用 587 端口，需要明确设置 secure: false 并使用 STARTTLS
    if (smtpPort === 587) {
      transporterConfig.secure = false
      transporterConfig.requireTLS = true
    }

    const transporter = nodemailer.createTransport(transporterConfig)

    const mailSubject =
      data.propertyName && data.roomNumber
        ? `解約通知書：${data.propertyName} ${data.roomNumber}号室`
        : '解約通知書（オンライン申請）'

    const info = await transporter.sendMail({
      from: `"解約通知フォーム" <${smtpUser}>`,
      to: mailTo,
      subject: mailSubject,
      text: buildPlainTextSummary(data),
      attachments: [
        {
          filename: `解約通知書_${data.contractHolder || 'ご契約者様'}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    console.log('解約通知書メール送信済み:', info.messageId)

    return NextResponse.json({
      ok: true,
      message: '解約通知書PDFを生成し、管理会社宛てに送信しました。',
    })
  } catch (err: any) {
    console.error('kaiyaku api error:', err)
    return NextResponse.json(
      { error: err.message || 'サーバーエラーが発生しました。' },
      { status: 500 }
    )
  }
}

async function generateKaiyakuPdf(data: KaiyakuFormData): Promise<Buffer> {
  // A4
  const pageW = 595.28
  const pageH = 841.89

  const pdfDoc = await PDFDocument.create()
  // @ts-expect-error fontkit types mismatch in pdf-lib, runtime is compatible
  pdfDoc.registerFontkit(fontkit)

  const fontPath = join(process.cwd(), 'public', 'fonts', 'NotoSansSC-Regular.ttf')
  const fontBytes = await readFile(fontPath)
  const font = await pdfDoc.embedFont(fontBytes)

  const page = pdfDoc.addPage([pageW, pageH])

  const marginX = 46
  const marginTop = 54
  const usableW = pageW - marginX * 2

  const titleSize = 18
  const labelSize = 11
  const valueSize = 11
  const lineGap = 6

  let y = pageH - marginTop

  const drawLine = (text: string, size: number, color = rgb(0.08, 0.12, 0.18)) => {
    page.drawText(text, { x: marginX, y, size, font, color })
    y -= size + lineGap
  }

  const drawWrapped = (text: string, size: number, indent = 0, color = rgb(0.08, 0.12, 0.18)) => {
    const lines = wrapTextCJK(text, usableW - indent, font, size)
    for (const line of lines) {
      page.drawText(line, { x: marginX + indent, y, size, font, color })
      y -= size + 4
    }
    y -= 2
  }

  // Title
  drawLine('解約通知書（オンライン申請）', titleSize, rgb(0.12, 0.16, 0.22))
  const submittedAtText = data.submittedAt
    ? `送信日時：${formatDateTimeForPdf(data.submittedAt)}`
    : ''
  if (submittedAtText) drawLine(submittedAtText, 9, rgb(0.45, 0.45, 0.45))
  y -= 8

  const kv = (label: string, value: string) => `${label}：${value || '（未記入）'}`

  drawLine('一、物件情報', labelSize, rgb(0.2, 0.25, 0.32))
  drawWrapped(kv('物件名', data.propertyName), valueSize)
  drawWrapped(kv('部屋番号', data.roomNumber), valueSize)
  drawWrapped(kv('物件所在地', data.propertyAddress), valueSize)
  drawWrapped(kv('契約者名', data.contractHolder), valueSize)
  y -= 6

  drawLine('二、日程', labelSize, rgb(0.2, 0.25, 0.32))
  drawWrapped(kv('解約日', data.cancelDate), valueSize)
  drawWrapped(kv('退去予定日', data.moveOutDate), valueSize)
  drawWrapped(kv('立会希望日時', data.inspectionDateTime ? formatInspectionDateTimeForEmail(data.inspectionDateTime) : ''), valueSize)
  y -= 6

  drawLine('三、施設使用状況', labelSize, rgb(0.2, 0.25, 0.32))
  drawWrapped(kv('使用駐輪場', data.bicycleParking), valueSize)
  drawWrapped(kv('メールボックスの開け方', buildMailboxLine(data)), valueSize)
  drawWrapped(kv('使用駐車場', data.carParking), valueSize)
  drawWrapped(kv('オートロック', buildAutoLockLine(data)), valueSize)
  drawWrapped(kv('使用バイク置場', data.bikeSpace), valueSize)
  drawWrapped(kv('宅配ボックス', buildDeliveryBoxLine(data)), valueSize)
  y -= 6

  drawLine('四、返金口座', labelSize, rgb(0.2, 0.25, 0.32))
  drawWrapped(kv('銀行', data.bankName), valueSize)
  drawWrapped(kv('支店', data.bankBranch), valueSize)
  drawWrapped(kv('口座種別', data.accountType || ''), valueSize)
  drawWrapped(kv('口座番号', data.accountNumber), valueSize)
  drawWrapped(kv('名義人', data.accountHolder), valueSize)
  y -= 6

  drawLine('五、解約理由・転居先', labelSize, rgb(0.2, 0.25, 0.32))
  const reason =
    data.reason === 'その他'
      ? `その他（${data.reasonOtherText || ''}）`
      : data.reason || ''
  drawWrapped(kv('解約理由', reason), valueSize)
  drawWrapped(kv('転居先住所', data.newAddress || '未定'), valueSize)
  drawWrapped(kv('建物名・号室', data.newBuildingAndRoom || ''), valueSize)
  drawWrapped(kv('電話', `${data.phoneCountryCode || '+81'} ${data.phoneNumber || ''}`.trim()), valueSize)
  drawWrapped(kv('E-mail', data.email || ''), valueSize)
  y -= 10

  drawWrapped(`氏名（署名欄）：${data.signerName || data.contractHolder || '（未記入）'}`, valueSize)

  // 署名画像（手書き）
  // NOTE: dataURL (image/png) を想定
  if (data.signatureDataUrl) {
    try {
      const m = String(data.signatureDataUrl).match(/^data:(image\/\w+);base64,(.+)$/)
      const b64 = m?.[2]
      if (b64) {
        const bytes = Buffer.from(b64, 'base64')
        const sigImage =
          (m?.[1] || '').toLowerCase().includes('jpeg') || (m?.[1] || '').toLowerCase().includes('jpg')
            ? await pdfDoc.embedJpg(bytes)
            : await pdfDoc.embedPng(bytes)

        const sigW = 180
        const sigH = 60
        const sigX = pageW - marginX - sigW
        const sigY = Math.max(48, y - sigH - 8)

        page.drawText('署名：', {
          x: sigX,
          y: sigY + sigH + 4,
          size: 10,
          font,
          color: rgb(0.08, 0.12, 0.18),
        })
        page.drawRectangle({
          x: sigX,
          y: sigY,
          width: sigW,
          height: sigH,
          borderWidth: 1,
          borderColor: rgb(0, 0, 0),
          color: rgb(1, 1, 1),
        })
        page.drawImage(sigImage, {
          x: sigX + 4,
          y: sigY + 4,
          width: sigW - 8,
          height: sigH - 8,
        })
      }
    } catch (e) {
      console.warn('failed to embed signature image:', e)
    }
  }

  const bytes = await pdfDoc.save()
  return Buffer.from(bytes)
}

function wrapTextCJK(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const normalized = (text || '').replace(/\r\n/g, '\n')
  const paras = normalized.split('\n')
  const out: string[] = []

  for (const p of paras) {
    const s = p.trimEnd()
    if (!s) {
      out.push('')
      continue
    }

    let line = ''
    for (const ch of Array.from(s)) {
      const test = line + ch
      const w = font.widthOfTextAtSize(test, fontSize)
      if (w > maxWidth && line) {
        out.push(line)
        line = ch
      } else {
        line = test
      }
    }
    if (line) out.push(line)
  }

  return out
}

function formatDateTimeForPdf(d: Date): string {
  // Asia/Tokyo
  const fmt = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return fmt.format(d)
}

function buildMailboxLine(data: KaiyakuFormData) {
  const part1 = `(${data.mailbox1Direction}) ${data.mailbox1Turns || '＿'}回${data.mailbox1Number || '＿'}番`
  const part2 = `(${data.mailbox2Direction}) ${data.mailbox2Turns || '＿'}回${data.mailbox2Number || '＿'}番`
  return `${part1} ・ ${part2}`
}

function buildAutoLockLine(data: KaiyakuFormData) {
  if (data.autoLock === '無') return '□有　□鍵式　□ダイヤル（　　　　　）　■無'
  const keyType =
    data.autoLockKeyType === '鍵式'
      ? '■鍵式　□ダイヤル（　　　　　）'
      : data.autoLockKeyType === 'ダイヤル'
      ? `□鍵式　■ダイヤル（${data.autoLockDial || '　　　　　'}）`
      : '□鍵式　□ダイヤル（　　　　　）'
  return `■有　${keyType}　□無`
}

function buildDeliveryBoxLine(data: KaiyakuFormData) {
  if (data.deliveryBox === '無') return '□有　□鍵式　□カード式　番号：（　　　　　）　■無'
  const type =
    data.deliveryBoxType === '鍵式'
      ? '■鍵式　□カード式'
      : data.deliveryBoxType === 'カード式'
      ? '□鍵式　■カード式'
      : '□鍵式　□カード式'
  const num = data.deliveryBoxNumber || '　　　　　'
  return `■有　${type}　番号：（${num}）　□無`
}

// 格式化立会希望日時用于邮件
function formatInspectionDateTimeForEmail(dateTime: string): string {
  const [datePart, timePart] = dateTime.split('T')
  if (!datePart) return dateTime
  
  const [y, m, d] = datePart.split('-')
  if (!y || !m || !d) return dateTime
  
  const parts: string[] = [`${y}年${m}月${d}日`]
  if (timePart) {
    const [hour, minute] = timePart.split(':')
    if (hour) parts.push(`${hour}時`)
    if (minute) parts.push(`${minute}分`)
  }
  return parts.join('')
}

// 邮件正文里放一个简单的文字版摘要（方便手机上快速看）
function buildPlainTextSummary(data: KaiyakuFormData): string {
  return `
【オンライン解約通知 送信内容】

物件名：${data.propertyName}
部屋番号：${data.roomNumber}
物件所在地：${data.propertyAddress}
契約者名：${data.contractHolder}

解約日：${data.cancelDate}
退去予定日：${data.moveOutDate}
立会希望日時：${data.inspectionDateTime ? formatInspectionDateTimeForEmail(data.inspectionDateTime) : '（未記入）'}

使用駐輪場：${data.bicycleParking}
使用駐車場：${data.carParking}
使用バイク置場：${data.bikeSpace}
宅配ボックス：${data.deliveryBox}

返金口座：
  銀行：${data.bankName}
  支店：${data.bankBranch}
  口座種別：${data.accountType}
  口座番号：${data.accountNumber}
  名義人：${data.accountHolder}

解約理由：${data.reason || '（未選択）'}${data.reason === 'その他' && data.reasonOtherText ? `（${data.reasonOtherText}）` : ''}

転居先住所：${data.newAddress || '未定'}
建物名・号室：${data.newBuildingAndRoom || ''}
電話：${data.phoneCountryCode || '+81'} ${data.phoneNumber || '（未記入）'}
E-mail：${data.email || '（未記入）'}

氏名（署名欄）：${data.signerName || data.contractHolder}

※ 詳細は添付のPDF「解約通知書」をご確認ください。
  `.trim()
}
