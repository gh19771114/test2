// lib/kaiyakuPdfTemplate.ts

export type KaiyakuFormData = {
    // 物件信息
    propertyName: string        // 物件名
    roomNumber: string          // 部屋番号
    propertyAddress: string     // 物件所在地
    contractHolder: string      // 契約者名
  
    // 日付
    cancelDate: string          // 解約日（yyyy-mm-dd）
    moveOutDate: string         // 退去予定日（yyyy-mm-dd）
    inspectionDateTime: string  // 立会希望日時（datetime-local格式：YYYY-MM-DDTHH:mm）
  
    // 使用駐輪場 有・無
    bicycleParking: '有' | '無'
  
    // メールボックスの開け方 ( 左 / 右 )＿回＿番 ・ ( 左 / 右 )＿回＿番
    mailbox1Direction: '左' | '右'
    mailbox1Turns: string
    mailbox1Number: string
    mailbox2Direction: '左' | '右'
    mailbox2Turns: string
    mailbox2Number: string
  
    // 使用駐車場 有・無
    carParking: '有' | '無'
  
    // オートロック 有 （ 鍵式 ・ ダイヤル：＿ ） ・ 無
    autoLock: '有' | '無'
    autoLockKeyType: '' | '鍵式' | 'ダイヤル'
    autoLockDial: string
  
    // 使用バイク置場 有 ・ 無
    bikeSpace: '有' | '無'
  
    // 宅配ボックス 有 （ 鍵式 ・ カード式 ・ 番号： ） ・ 無
    deliveryBox: '有' | '無'
    deliveryBoxType: '' | '鍵式' | 'カード式'
    deliveryBoxNumber: string
  
    // 返金口座
    bankName: string            // 銀行
    bankBranch: string          // 支店
    accountType: '普通' | '当座' | '' // 口座種別
    accountNumber: string       // 口座番号
    accountHolder: string       // 名義人
  
    // 解約理由（单选）
    reason: '' | '進学' | '就職' | '転勤' | '自宅購入' | '帰国' | '家賃金額' | '契約期間満了' | 'その他'  // 解約理由
    reasonOtherText: string     // その他内容（当reason为その他时）
  
    // 転居先
    newAddress: string          // 転居先住所
    newBuildingAndRoom: string  // 建物名・号室
  
    // 电话
    phoneCountryCode: string     // 国际电话区号
    phoneNumber: string         // 電話番号
  
    // 签名
    signerName: string          // 氏名
  
    // 提交时间（由后端在 API 里补上）
    submittedAt: Date
}

// 这个函数就是 HTML → PDF 的"HTML 模板"
export function renderKaiyakuPdfHtml(data: KaiyakuFormData) {
    const issued = formatDateJp(data.submittedAt) // 発行日
    const notice = issued                         // 解約通知日 = 提交日
  
    // 根据选中的理由生成显示文本
    let reasonLine = ''
    if (data.reason === 'その他') {
      reasonLine = `■その他（${e(data.reasonOtherText || '')}）`
    } else if (data.reason) {
      reasonLine = `■${data.reason}`
    } else {
      reasonLine = '（未选择）'
    }
  
    const mailBoxLine = `( ${data.mailbox1Direction} ) ${e(data.mailbox1Turns || '')}回${e(
      data.mailbox1Number || ''
    )}番 ・ ( ${data.mailbox2Direction} ) ${e(data.mailbox2Turns || '')}回${e(
      data.mailbox2Number || ''
    )}番`
  
    const autoLockLine =
      data.autoLock === '無'
        ? '□有　□鍵式　□ダイヤル（　　　　　）　■無'
        : [
            '■有',
            data.autoLockKeyType === '鍵式' ? '■鍵式' : '□鍵式',
            data.autoLockKeyType === 'ダイヤル'
              ? `■ダイヤル（${e(data.autoLockDial || '')}）`
              : '□ダイヤル（　　　　　）',
            '□無',
          ].join('　')
  
    const deliveryBoxLine =
      data.deliveryBox === '無'
        ? '□有　□鍵式　□カード式　番号：（　　　　　）　■無'
        : [
            '■有',
            data.deliveryBoxType === '鍵式' ? '■鍵式' : '□鍵式',
            data.deliveryBoxType === 'カード式' ? '■カード式' : '□カード式',
            `番号：（${e(data.deliveryBoxNumber || '')}）`,
            '□無',
          ].join('　')
  
    const cancelDateText = formatDateForPreview(data.cancelDate)
    const moveOutDateText = formatDateForPreview(data.moveOutDate)
  
    return `
  <!doctype html>
  <html lang="ja">
    <head>
      <meta charset="utf-8" />
      <title>解約通知書</title>
      <style>
        body {
          font-family: 'Yu Gothic', 'Hiragino Kaku Gothic ProN', 'Meiryo',
            -apple-system, BlinkMacSystemFont, sans-serif;
          font-size: 10px;
          margin: 15px 24px;
          line-height: 1.4;
        }
        table { border-collapse: collapse; width: 100%; }
        th, td {
          border: 1px solid #000;
          padding: 3px 5px;
          vertical-align: top;
          font-size: 9px;
        }
        th {
          background: #f5f5f5;
          width: 80px;
          font-weight: normal;
        }
        .title {
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 8px 0 12px;
        }
        .top-meta {
          font-size: 10px;
          text-align: right;
        }
        .small { font-size: 10px; }
        .header-info {
          font-size: 10px;
          margin-bottom: 16px;
        }
        .instructions {
          font-size: 9px;
          line-height: 1.4;
          margin: 8px 0;
          padding: 8px;
          background: #fff9e6;
          border: 1px solid #ddd;
        }
        .instructions h4 {
          font-size: 9px;
          font-weight: bold;
          margin: 4px 0 2px 0;
        }
        .instructions p {
          margin: 2px 0;
        }
        .notes {
          font-size: 9px;
          line-height: 1.3;
          margin: 8px 0;
          padding: 6px;
          background: #fffacd;
          border: 1px solid #ff6b6b;
        }
        .notes h3 {
          font-size: 10px;
          font-weight: bold;
          color: #d32f2f;
          margin: 0 0 4px 0;
        }
        .notes ol {
          margin: 4px 0;
          padding-left: 16px;
        }
        .notes li {
          margin: 2px 0;
        }
      </style>
    </head>
    <body>
  
      <!-- 顶部：株式会社ボーンマーク御中 -->
      <div style="margin-bottom: 6px;">
        <div style="font-size: 10px; margin-bottom: 0; font-weight: bold;">株式会社ボーンマーク御中</div>
      </div>

      <!-- 発行日 -->
      <div style="text-align: right; font-size: 9px; margin-top: 0; margin-bottom: 6px;">
        発行日：${issued}
      </div>

      <!-- 公司信息（問合せ先） -->
      <div style="font-size: 9px; line-height: 1.3; margin-bottom: 8px;">
        <div style="font-weight: bold; margin-bottom: 2px;">（問合せ先）</div>
        <div>株式会社ボーンマーク</div>
        <div>〒103-0013</div>
        <div>東京都中央区日本橋人形町1-2-12</div>
        <div>Bourn Mark Ningyocho BLD.2F</div>
        <div>TEL：03-6661-1848</div>
        <div>FAX：03-6661-7994</div>
      </div>
  
      <div class="title">解約通知書</div>
  
      <!-- 填写说明 -->
      <div class="instructions">
        <p style="color: #d32f2f; font-weight: bold; margin-bottom: 4px; font-size: 9px;">▼記入欄以下、枠内を全てご記入ください</p>
        
        <h4>（1）</h4>
        <p>下記、太枠内・ご署名欄へ記入押印のうえ、以下の方法にて弊社へご提出ください。尚、契約書に記載の解約申し入れ期限を経過して到着した場合は、お家賃・更新料等が発生する可能性がございます。解約通知書のご提出方法：①FAX 03-6661-7994 ②郵送 ③メール： kanri@bournmark.jp ※提出後、弊社よりご案内のお電話がない場合、到着確認のご連絡（TEL 03-6661-1848）をお願いいたします。</p>
        
        <h4>（2）</h4>
        <p>各項目は以下の日付をご記入ください。解約通知日：解約通知書の到着日（FAX/メールの場合は弊社受信日・郵送の場合は消印日）解約日：完全に退去となる日（賃料が発生する最終日）退去日：部屋の荷物を搬出する日、引越し日立会日：部屋に荷物がない状態で部屋状態を最終チェックする日、すべての鍵を回収する日（最長：解約日）</p>
        
        <h4>（3）</h4>
        <p>最終月のお家賃について：日割賃料のご返金が発生する場合は、一旦満額にてお支払いいただき、解約精算時の対応となります。※保証会社にご加入のお客様におかれましては、解約の翌月分の引き落としがかかる場合がございます。恐れ入りますが、予めご承知おきくださいますようお願いいたします。</p>
      </div>
  
      <!-- 物件信息 -->
      <table>
        <tr>
          <th>物件名</th>
          <td>${e(data.propertyName)}</td>
          <th>部屋番号</th>
          <td>${e(data.roomNumber)}</td>
        </tr>
        <tr>
          <th>物件所在地</th>
          <td colspan="3">${e(data.propertyAddress)}</td>
        </tr>
        <tr>
          <th>契約者名</th>
          <td colspan="3">${e(data.contractHolder)}</td>
        </tr>
      </table>
  
      <!-- 日程 -->
      <table>
        <tr>
          <th>解約通知日</th>
          <td>${notice}</td>
          <th>解約日</th>
          <td>${cancelDateText}</td>
        </tr>
        <tr>
          <th>退去予定日</th>
          <td>${moveOutDateText}</td>
          <th>立会希望日時</th>
          <td>${formatInspectionDateTime(data.inspectionDateTime)}</td>
        </tr>
      </table>

      <!-- 施設利用状況 -->
      <table>
        <tr>
          <th>使用駐輪場</th>
          <td>${yn(data.bicycleParking)}</td>
        </tr>
        <tr>
          <th>メールボックス<br/><span class="small">の開け方</span></th>
          <td>${mailBoxLine}</td>
        </tr>
        <tr>
          <th>使用駐車場</th>
          <td>${yn(data.carParking)}</td>
        </tr>
        <tr>
          <th>オートロック</th>
          <td>${autoLockLine}</td>
        </tr>
        <tr>
          <th>使用バイク置場</th>
          <td>${yn(data.bikeSpace)}</td>
        </tr>
        <tr>
          <th>宅配ボックス</th>
          <td>${deliveryBoxLine}</td>
        </tr>
      </table>

      <!-- 返金口座 -->
      <table>
        <tr>
          <th rowspan="5">返金口座</th>
          <th>銀行</th>
          <td>${e(data.bankName)}</td>
        </tr>
        <tr>
          <th>支店</th>
          <td>${e(data.bankBranch)}</td>
        </tr>
        <tr>
          <th>口座種別</th>
          <td>${e(data.accountType)}</td>
        </tr>
        <tr>
          <th>口座番号</th>
          <td>${e(data.accountNumber)}</td>
        </tr>
        <tr>
          <th>名義人</th>
          <td>${e(data.accountHolder)}</td>
        </tr>
      </table>

      <!-- 解約理由 -->
      <table>
        <tr>
          <th>解約理由</th>
          <td>
            ${reasonLine}
          </td>
        </tr>
      </table>

      <!-- 転居先 -->
      <table>
        <tr>
          <th>転居先住所</th>
          <td>
            ${e(data.newAddress || '未定')}<br/>
            <span class="small" style="color: #d32f2f;">
              ※未定の場合は解約立会時に必ずお伝えください。
            </span>
          </td>
        </tr>
        <tr>
          <th>建物名・号室</th>
          <td>${e(data.newBuildingAndRoom || '')}</td>
        </tr>
      </table>

      <!-- 退去時の注意事項 -->
      <div class="notes">
        <h3>退去時の注意事項 ※必ずご対応ください。</h3>
        <ol>
          <li>電気、ガス、水道解約：退去日に設備を検査するため、退居日当日の解約に設定して頂けますようお願い申し上げます。</li>
          <li>ゴミ処分：お引っ越しの際、室内、ベランダ、通路等に不用品（ゴミ）等を残さないようにして下さい。粗大ゴミは区役所へ処分方法をご確認ください。万一残置物がある場合は処分費を請求いたします。</li>
          <li>保険、ライフライン等：継続ご利用の際、保険約款に記載されている保険会社へ転居（住所移動）先を連絡して下さい。解約する場合、ご自身で電話での解約を行ってください。</li>
          <li>退去も立会もお客様の都合で解約日までに完了できない場合、更新料が発生する場合がありますので、ご注意ください。</li>
          <li>立会日については、後日立会担当業者からお電話が入りますので、日程調整をお願いいたします。立会日の日程変更は業者へのご連絡をお願いいたします。立会日当日、時間厳守でお願い致します。</li>
          <li>退去時の費用負担につきまして、借主の故意・過失、善管注意義務違反、通常の使用方法に反する使用など借主の責任によって生じた損耗や傷などを復旧することです。その復旧費用は、借主が費用負担となります。</li>
        </ol>
      </div>
  
      <!-- 署名说明和签名 -->
      <div style="font-size: 9px; margin-top: 8px; text-align: left;">
        <p style="margin-bottom: 6px;">※署名・捺印・返金口座は全てご契約者様名義にてお願い致します。</p>
        <div style="text-align: right; margin-top: 8px;">
          <span style="margin-right: 8px;">TEL：</span>
          <span style="display:inline-block; min-width:10rem; border-bottom:1px solid #000; text-align:left; margin-right: 24px;">${e(data.phoneCountryCode || '+81')} ${e(data.phoneNumber)}</span>
          氏名：
          <span style="display:inline-block; min-width:10rem; border-bottom:1px solid #000; text-align:center;">
            ${e(data.contractHolder)}
          </span>
          <span style="margin-left: 8px;">㊞</span>
        </div>
      </div>
  
    </body>
  </html>
    `
}

/* ---------------- 工具函数们 ---------------- */

function e(text?: string) {
    if (!text) return ''
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
  
function yn(v: '有' | '無') {
  return v === '有' ? '■有　□無' : '□有　■無'
}

function checkbox(checked: boolean, label: string) {
  return `${checked ? '■' : '□'}${label}`
}

function formatDateJp(d: Date) {
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  return `${year}年${pad(month)}月${pad(day)}日`
}

function formatDateForPreview(value: string) {
  if (!value) return ''
  const [y, m, d] = value.split('-')
  if (!y || !m || !d) return value
  return `${y}年${m}月${d}日`
}

function formatInspectionDateTime(dateTime?: string) {
  if (!dateTime) return ''
  // datetime-local格式：YYYY-MM-DDTHH:mm
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
  