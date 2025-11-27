// 2版/app/api/kaiyaku/route.ts
import { NextResponse } from 'next/server'
import { chromium } from 'playwright'
import nodemailer from 'nodemailer'
import { constants } from 'crypto'
import {
  renderKaiyakuPdfHtml,
  type KaiyakuFormData,
} from '@/lib/kaiyakuPdfTemplate'

// 只允许 POST
export async function POST(req: Request) {
  try {
    // 验证环境变量
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.MAIL_TO) {
      return NextResponse.json(
        { error: '邮件配置不完整，请检查环境变量：SMTP_HOST, SMTP_USER, SMTP_PASS, MAIL_TO' },
        { status: 500 }
      )
    }

    const body = await req.json()

    // 把前端传来的字段补上 submittedAt
    const data: KaiyakuFormData = {
      ...body,
      submittedAt: new Date(),
    }

    // 1. 用模板生成 HTML
    const html = renderKaiyakuPdfHtml(data)

    // 2. 用 Playwright 把 HTML 变成 PDF（二进制 Buffer）
    const pdfBuffer = await generatePdfFromHtml(html)

    // 3. 用 Nodemailer 把 PDF 作为附件发到公司邮箱
    // 正确解析 SMTP_SECURE（环境变量是字符串）
    const isSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465'
    const smtpPort = Number(process.env.SMTP_PORT || 587)

    const transporterConfig: any = {
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: isSecure, // 根据环境变量设置
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
      from: `"解約通知フォーム" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
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

// 用 Playwright 把 HTML 渲染成 PDF
async function generatePdfFromHtml(html: string): Promise<Buffer> {
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle' })
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    })
    return pdf as Buffer
  } finally {
    await browser.close()
  }
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
立会希望日時：${data.inspectionDateTime ? formatInspectionDateTimeForEmail(data.inspectionDateTime) : '未填写'}

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

解約理由：${data.reason || '未选择'}${data.reason === 'その他' && data.reasonOtherText ? `（${data.reasonOtherText}）` : ''}

転居先住所：${data.newAddress || '未定'}
建物名・号室：${data.newBuildingAndRoom || ''}
电话：${data.phoneCountryCode || '+81'} ${data.phoneNumber || '未填写'}

氏名（署名欄）：${data.signerName || data.contractHolder}

※ 詳細は添付のPDF「解約通知書」をご確認ください。
  `.trim()
}
