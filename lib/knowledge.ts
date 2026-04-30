// ============================================
// 日期提取规则（重要！）
// ============================================
// 当从网页提取新闻日期时，遵循以下规则：
// 1. 如果网页只显示"月/日"格式（如"12/1"），没有年份：
//    - 默认使用当前年份（new Date().getFullYear()）
//    - 不要假设是去年或未来年份
// 2. 检查版权信息中的年份（如"© 2025"）作为参考
// 3. 检查新闻内容中的时间线索（如"明年1月"、"今年"等）
// 4. 如果日期是未来日期（超过今天），检查是否是时区问题或错误
// 5. 日期格式统一使用：'YYYY-MM-DD'（如'2025-12-01'）
//
// 示例：
// - 网页显示"12/1(月) 5:00配信" + 版权"© 2025" → 日期应为'2025-12-01'
// - 网页显示"1/15" + 当前年份2025 → 日期应为'2025-01-15'
// ============================================

// 生成 slug 的工具函数
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\u4e00-\u9fa5a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 日期验证函数：确保日期格式正确且合理
export function validateNewsDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const currentYear = now.getFullYear()
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    console.warn(`无效的日期格式: ${dateString}`)
    // 如果日期无效，返回当前日期
    return now.toISOString().split('T')[0]
  }
  
  // 检查日期是否在未来（超过今天+1天，可能是错误）
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (date > tomorrow) {
    console.warn(`日期在未来，可能错误: ${dateString}`)
  }
  
  // 检查年份是否合理（不应早于2020年，不应超过当前年份+1年）
  const year = date.getFullYear()
  if (year < 2020 || year > currentYear + 1) {
    console.warn(`年份不合理: ${year}，当前年份: ${currentYear}`)
  }
  
  return dateString
}

// 从网页日期字符串提取标准日期格式
// 输入示例："12/1(月) 5:00配信" 或 "12/1"
// 输出："YYYY-MM-DD"
export function extractDateFromWebString(dateStr: string, copyrightYear?: number): string {
  const currentYear = copyrightYear || new Date().getFullYear()
  
  // 提取月/日（格式：12/1 或 1/15）
  const match = dateStr.match(/(\d{1,2})\/(\d{1,2})/)
  if (!match) {
    console.warn(`无法从字符串提取日期: ${dateStr}`)
    return new Date().toISOString().split('T')[0]
  }
  
  const month = parseInt(match[1], 10)
  const day = parseInt(match[2], 10)
  
  // 构建完整日期
  const date = new Date(currentYear, month - 1, day)
  
  // 验证日期是否有效
  if (date.getMonth() !== month - 1 || date.getDate() !== day) {
    console.warn(`无效的日期: ${month}/${day}/${currentYear}`)
    return new Date().toISOString().split('T')[0]
  }
  
  return date.toISOString().split('T')[0]
}

// 最新资讯数据类型
export type NewsItem = {
  date: string
  slug: string
  isPinned?: boolean
  isNotice?: boolean
  category?: string
  /** 首页置顶时的排序，数值越小越靠前 */
  pinnedOrder?: number
  image?: string
  headerImage?: string
  contentImage?: string
  /** 房地产新闻条目：有此项时详情页从 japanRealEstateNews 按 id 取正文 */
  realEstateId?: string
}

// 最新资讯数据
// 注意：title 和 content 现在通过翻译文件提供，使用翻译键：news.items.{slug}.title 和 news.items.{slug}.content
export const latestNews: NewsItem[] = [
  {
    date: '2026-04-30',
    slug: '2026-golden-week-holiday-notice',
    isPinned: true,
    isNotice: true,
    category: '通知',
    pinnedOrder: 0,
  },
  {
    date: '2026-03-30',
    slug: '2026-03-30-communication-equipment-failure-notice',
    isPinned: false,
    isNotice: true,
    category: '通知',
  },
  {
    date: '2021-06-01',
    slug: '2021-06-01-company-name-change-notice',
    isPinned: true,
    isNotice: true,
    category: '通知',
    pinnedOrder: 1,
  },
  {
    date: '2026-01-07',
    slug: 'president-attends-saikai-awards-2025',
    isPinned: false,
    isNotice: false,
    category: '公司活动',
    image: '/imgs/saikai-awards-header.jpg',
    headerImage: '/imgs/saikai-awards-header.jpg',
    contentImage: '/imgs/saikai-awards-content.jpg',
  },
  {
    date: '2025-12-16',
    slug: 'president-lecture-meikai-university',
    isPinned: false,
    isNotice: false,
    category: '公司活动',
    image: '/imgs/20151216-1.jpg',
  },
  {
    date: '2025-12-20',
    slug: '2025-year-end-holiday-notice',
    isPinned: false,
    isNotice: true,
    category: '通知',
  },
  {
    date: '2025-11-25',
    slug: 'nikkei-tokyo-23-wards-overseas-mansion-35-2025',
  },
  {
    date: '2026-01-08',
    slug: 'asahi-tokyo-mansion-taiwan-overtakes-2026',
  },
  {
    date: '2025-11-05',
    slug: 'japan-government-strengthens-foreign-buyer-regulation',
  },
  {
    date: '2025-12-01',
    slug: 'foreigner-real-estate-ownership-database-2027',
  },
  {
    date: '2025-01-15',
    slug: 'tokyo-23-wards-new-apartment-price-record',
  },
  {
    date: '2025-01-08',
    slug: 'japan-real-estate-investment-record-foreign-capital',
  },
  {
    date: '2024-12-20',
    slug: 'japan-land-price-increase-34-year-high',
  },
  {
    date: '2024-12-10',
    slug: 'japan-mortgage-rate-historic-low-0-45',
  },
  {
    date: '2024-11-25',
    slug: 'osaka-new-apartment-supply-expo-effect',
  },
  {
    date: '2024-11-12',
    slug: 'fukuoka-high-rental-yield-tech-industry',
  },
  {
    date: '2025-11-27',
    slug: 'tokyo-23-wards-foreign-buyer-ratio-taiwan-dominant',
  },
  {
    date: '2025-10-15',
    slug: 'japanese-support-foreign-buyer-regulation-developer-restrictions',
  },
  {
    date: '2025-10-20',
    slug: 'foreign-speculation-tokyo-price-surge-government-investigation',
  },
  {
    date: '2025-07-15',
    slug: 'foreign-capital-accelerates-japan-real-estate-government-concern',
  },
  {
    date: '2025-10-18',
    slug: 'japan-real-estate-attracts-investors-commercial-accommodation',
  },
  {
    date: '2025-09-15',
    slug: 'japan-real-estate-investment-growth-domestic-foreign',
  },
  {
    date: '2025-08-10',
    slug: 'tokyo-prime-location-price-surge-foreign-ownership-limits',
  },
  {
    date: '2025-05-30',
    slug: 'foreign-buyers-japan-too-easy-controversy',
  },
  {
    date: '2025-07-20',
    slug: 'chinese-wealthy-japan-real-estate-market-reaction',
  },
]

// 日本房产投资百科数据
export const encyclopediaEntries = [
  {
    title: '日本买房流程：签约、交割与注册须知',
    tag: '基础攻略',
    slug: 'japan-home-buying-process',
    content: `在日本购买房产需要遵循严格的流程，了解每个环节的要点至关重要。

[FLOW:0]

签约阶段需要准备的重要文件包括重要事项说明书、买卖合同以及土地登记簿副本。在签约时，需要仔细阅读重要事项说明书，确认物业的权属关系，并了解周边环境和设施。

交割前需要做好资金准备，包括首付款和税费等。同时需要完成贷款审批和保险购买。交割当日需要进行最终验房，支付尾款，并接收钥匙和相关文件。

交割完成后，需要向法务局提交所有权转移登记，缴纳登记许可税，并完成固定资产税申报。从签约到交割通常需要1至2个月时间，登记手续在交割后1至2周内完成。

[TABLE:0]`,
    charts: [
      {
        type: 'flow',
        title: '日本买房完整流程',
        data: {
          steps: [
            {
              title: '物业搜索与选房',
              description: '通过中介或网络平台寻找合适物业，实地看房，确认位置、周边环境、交通便利性等',
            },
            {
              title: '价格谈判与签约',
              description: '与卖方协商价格，签署买卖合同，支付定金（通常为房价的5-10%），仔细阅读重要事项说明书',
            },
            {
              title: '贷款申请（如需要）',
              description: '向银行提交贷款申请，准备收入证明、身份证明等材料，等待审批（通常1-2个月）',
            },
            {
              title: '资金准备与验房',
              description: '准备首付款、税费、中介费等资金，进行最终验房，确认物业状况',
            },
            {
              title: '交割与登记',
              description: '支付尾款，接收钥匙和相关文件，向法务局提交所有权转移登记（交割后1-2周完成）',
            },
          ],
        },
      },
      {
        type: 'table',
        title: '时间节点参考',
        data: {
          headers: ['阶段', '所需时间', '主要事项'],
          rows: [
            ['物业搜索', '1-3个月', '看房、比较、谈判'],
            ['签约到交割', '1-2个月', '贷款审批、资金准备、验房'],
            ['登记手续', '1-2周', '所有权转移登记、税费缴纳'],
            ['总计', '2-5个月', '从选房到完成登记'],
          ],
        },
      },
    ],
    i18n: {
      en: {
        content: `Buying property in Japan follows a structured process. Understanding the key points in each step is essential.

[FLOW:0]

At the contract stage, key documents typically include the Important Matters Explanation (重要事項説明書), the sale-and-purchase agreement, and a copy of the property registry. Read the Important Matters Explanation carefully to confirm ownership, restrictions, and the surrounding environment.

Before closing, prepare the funds (down payment, taxes, and fees), complete mortgage approval (if applicable), and arrange insurance. On the closing day, conduct a final inspection, pay the remaining balance, and receive keys and related documents.

After closing, file the ownership transfer registration at the Legal Affairs Bureau, pay the registration license tax, and complete fixed asset tax-related procedures. From contract to closing usually takes 1–2 months, and registration is typically completed within 1–2 weeks after closing.

[TABLE:0]`,
        charts: [
          {
            type: 'flow',
            title: 'End-to-end home buying process in Japan',
            data: {
              steps: [
                {
                  title: 'Search & shortlist properties',
                  description: 'Find suitable properties via agents or platforms, visit in person, and confirm location, neighborhood, and transport convenience',
                },
                {
                  title: 'Negotiate price & sign contract',
                  description: 'Negotiate with the seller, sign the contract, pay a deposit (typically 5–10%), and review the Important Matters Explanation carefully',
                },
                {
                  title: 'Mortgage application (if needed)',
                  description: 'Submit documents to the bank (income/ID, etc.) and wait for approval (usually 1–2 months)',
                },
                {
                  title: 'Prepare funds & final inspection',
                  description: 'Prepare down payment, taxes, and agent fees, and perform a final property inspection',
                },
                {
                  title: 'Closing & registration',
                  description: 'Pay the remaining balance, receive keys/documents, and file ownership transfer registration (typically completed 1–2 weeks after closing)',
                },
              ],
            },
          },
          {
            type: 'table',
            title: 'Typical timeline',
            data: {
              headers: ['Stage', 'Time', 'Key items'],
              rows: [
                ['Property search', '1–3 months', 'Viewings, comparisons, negotiations'],
                ['Contract → closing', '1–2 months', 'Mortgage approval, funding, final inspection'],
                ['Registration', '1–2 weeks', 'Ownership transfer registration, taxes/fees payment'],
                ['Total', '2–5 months', 'From selection to completed registration'],
              ],
            },
          },
        ],
      },
      ja: {
        content: `日本で不動産を購入する際は、一定の手順に沿って進める必要があります。各段階の要点を把握しておくことが重要です。

[FLOW:0]

契約段階では、重要事項説明書、売買契約書、登記事項証明書（登記簿謄本の写し）などの確認が中心となります。重要事項説明書は、権利関係や制限、周辺環境・設備等を把握するために必ず内容を精査しましょう。

決済（引渡し）前には、手付金・残代金に加え、税金や諸費用の資金準備、（必要に応じて）ローン審査、保険手配を進めます。決済当日は最終確認（内覧）後に残代金を支払い、鍵と関連書類を受領します。

決済後は、法務局で所有権移転登記を申請し、登録免許税を納付します。固定資産税の手続きも含め、契約から決済まで通常1〜2か月、登記は決済後1〜2週間で完了することが一般的です。

[TABLE:0]`,
        charts: [
          {
            type: 'flow',
            title: '日本での購入フロー（全体像）',
            data: {
              steps: [
                {
                  title: '物件探し・選定',
                  description: '仲介会社やサイトで物件を探し、現地内覧で立地・周辺環境・交通利便性などを確認',
                },
                {
                  title: '価格交渉・契約',
                  description: '売主と条件調整のうえ契約締結、手付金（目安：5〜10%）を支払い、重要事項説明書を確認',
                },
                {
                  title: 'ローン申請（必要な場合）',
                  description: '収入証明や身分証明などを提出し審査（目安：1〜2か月）',
                },
                {
                  title: '資金準備・最終確認',
                  description: '頭金・税金・仲介手数料等を準備し、最終確認（内覧）で状態を確認',
                },
                {
                  title: '決済・登記',
                  description: '残代金支払い、鍵・書類受領、所有権移転登記（決済後1〜2週間で完了が一般的）',
                },
              ],
            },
          },
          {
            type: 'table',
            title: '目安となる期間',
            data: {
              headers: ['段階', '期間', '主な内容'],
              rows: [
                ['物件探し', '1〜3か月', '内覧、比較、交渉'],
                ['契約〜決済', '1〜2か月', 'ローン審査、資金準備、最終確認'],
                ['登記手続き', '1〜2週間', '所有権移転登記、税金等の納付'],
                ['合計', '2〜5か月', '選定から登記完了まで'],
              ],
            },
          },
        ],
      },
      'zh-HK': {
        content: `在日本購買房產需要遵循嚴格流程，了解每個環節的要點至關重要。

[FLOW:0]

簽約階段需要準備的重要文件包括重要事項說明書、買賣合同以及土地登記簿副本。簽約時需仔細閱讀重要事項說明書，確認物業的權屬關係，並了解周邊環境和設施。

交割前需做好資金準備，包括首付款和稅費等，同時完成貸款審批與保險購買。交割當日進行最終驗房，支付尾款，並接收鑰匙及相關文件。

交割完成後，需要向法務局提交所有權轉移登記，繳納登記許可稅，並完成固定資產稅申報。從簽約到交割通常需要1至2個月，登記手續在交割後1至2週內完成。

[TABLE:0]`,
        charts: [
          {
            type: 'flow',
            title: '日本買房完整流程',
            data: {
              steps: [
                {
                  title: '物業搜尋與選房',
                  description: '透過中介或網絡平台尋找合適物業，實地看房，確認位置、周邊環境、交通便利性等',
                },
                {
                  title: '價格談判與簽約',
                  description: '與賣方協商價格，簽署買賣合同，支付定金（通常為房價的5-10%），仔細閱讀重要事項說明書',
                },
                {
                  title: '貸款申請（如需要）',
                  description: '向銀行提交貸款申請，準備收入證明、身份證明等材料，等待審批（通常1-2個月）',
                },
                {
                  title: '資金準備與驗房',
                  description: '準備首付款、稅費、中介費等資金，進行最終驗房，確認物業狀況',
                },
                {
                  title: '交割與登記',
                  description: '支付尾款，接收鑰匙和相關文件，向法務局提交所有權轉移登記（交割後1-2週完成）',
                },
              ],
            },
          },
          {
            type: 'table',
            title: '時間節點參考',
            data: {
              headers: ['階段', '所需時間', '主要事項'],
              rows: [
                ['物業搜尋', '1-3個月', '看房、比較、談判'],
                ['簽約到交割', '1-2個月', '貸款審批、資金準備、驗房'],
                ['登記手續', '1-2週', '所有權轉移登記、稅費繳納'],
                ['總計', '2-5個月', '從選房到完成登記'],
              ],
            },
          },
        ],
      },
      'zh-TW': {
        content: `在日本購買房產需要遵循嚴格流程，了解每個環節的要點至關重要。

[FLOW:0]

簽約階段需要準備的重要文件包括重要事項說明書、買賣合約以及土地登記簿副本。簽約時需仔細閱讀重要事項說明書，確認物業的權屬關係，並了解周邊環境和設施。

交割前需做好資金準備，包括首付款和稅費等，同時完成貸款審批與保險購買。交割當日進行最終驗房，支付尾款，並接收鑰匙及相關文件。

交割完成後，需要向法務局提交所有權轉移登記，繳納登記許可稅，並完成固定資產稅申報。從簽約到交割通常需要1至2個月，登記手續在交割後1至2週內完成。

[TABLE:0]`,
        charts: [
          {
            type: 'flow',
            title: '日本買房完整流程',
            data: {
              steps: [
                {
                  title: '物業搜尋與選房',
                  description: '透過中介或網路平台尋找合適物業，實地看房，確認位置、周邊環境、交通便利性等',
                },
                {
                  title: '價格談判與簽約',
                  description: '與賣方協商價格，簽署買賣合約，支付定金（通常為房價的5-10%），仔細閱讀重要事項說明書',
                },
                {
                  title: '貸款申請（如需要）',
                  description: '向銀行提交貸款申請，準備收入證明、身份證明等材料，等待審批（通常1-2個月）',
                },
                {
                  title: '資金準備與驗房',
                  description: '準備首付款、稅費、中介費等資金，進行最終驗房，確認物業狀況',
                },
                {
                  title: '交割與登記',
                  description: '支付尾款，接收鑰匙和相關文件，向法務局提交所有權轉移登記（交割後1-2週完成）',
                },
              ],
            },
          },
          {
            type: 'table',
            title: '時間節點參考',
            data: {
              headers: ['階段', '所需時間', '主要事項'],
              rows: [
                ['物業搜尋', '1-3個月', '看房、比較、談判'],
                ['簽約到交割', '1-2個月', '貸款審批、資金準備、驗房'],
                ['登記手續', '1-2週', '所有權轉移登記、稅費繳納'],
                ['總計', '2-5個月', '從選房到完成登記'],
              ],
            },
          },
        ],
      },
    },
  },
  {
    title: '固定资产税与城市规划税如何计算',
    tag: '税务',
    slug: 'fixed-asset-tax-calculation',
    content: `固定资产税和城市规划税是日本房产持有期间需要缴纳的重要税费。

固定资产税以固定资产评估额为基准计算，标准税率为1.4%。评估额通常低于市场价，这是计算时需要注意的要点。新建住宅有减税措施，小规模住宅有特例，符合条件可申请减免。

[TABLE:0]

城市规划税同样以固定资产评估额为基准计算，税率上限为0.3%，由市町村政府征收。

[TABLE:1]

每年4至5月会收到纳税通知书，分4期缴纳，分别在6月、9月、12月和次年2月。可通过银行转账或便利店缴纳。

节税建议包括了解各种减免政策，合理利用折旧，以及咨询税务专业人士。`,
    charts: [
      {
        type: 'table',
        title: '固定资产税计算示例',
        data: {
          headers: ['项目', '说明', '示例'],
          rows: [
            ['市场价', '房产实际交易价格', '5,000万日元'],
            ['评估额', '通常为市场价的70%', '3,500万日元'],
            ['标准税率', '固定税率', '1.4%'],
            ['年税额', '评估额 × 税率', '49万日元'],
            ['新建住宅减税', '前3年减半征收', '前3年：24.5万日元/年'],
          ],
          caption: '以市场价5,000万日元的房产为例',
        },
      },
      {
        type: 'table',
        title: '纳税时间表',
        data: {
          headers: ['期数', '缴纳月份', '缴纳比例', '备注'],
          rows: [
            ['第1期', '6月', '25%', '纳税通知书4-5月送达'],
            ['第2期', '9月', '25%', '可通过银行转账'],
            ['第3期', '12月', '25%', '可通过便利店缴纳'],
            ['第4期', '次年2月', '25%', '逾期需缴纳滞纳金'],
          ],
        },
      },
    ],
    i18n: {
      en: {
        content: `Fixed Asset Tax and City Planning Tax are important taxes you pay while holding real estate in Japan.

Fixed Asset Tax is calculated based on the assessed value (固定資産税評価額), with a standard rate of 1.4%. The assessed value is usually lower than market price, which is an important point in calculation. New homes and small residential properties may qualify for reductions/exemptions.

[TABLE:0]

City Planning Tax is also calculated based on the assessed value. The tax rate cap is 0.3% and it is levied by municipalities.

[TABLE:1]

Tax notices are typically sent between April and May each year. Payments are commonly split into 4 installments due in June, September, December, and February of the following year. Payment can be made via bank transfer or at convenience stores.

Tax optimization tips include understanding available deductions/reductions, making appropriate use of depreciation, and consulting tax professionals.`,
        charts: [
          {
            type: 'table',
            title: 'Fixed Asset Tax calculation example',
            data: {
              headers: ['Item', 'Explanation', 'Example'],
              rows: [
                ['Market price', 'Actual transaction price', 'JPY 50,000,000'],
                ['Assessed value', 'Typically ~70% of market price', 'JPY 35,000,000'],
                ['Standard tax rate', 'Fixed rate', '1.4%'],
                ['Annual tax', 'Assessed value × rate', 'JPY 490,000'],
                ['New home reduction', '50% reduction for first 3 years', 'First 3 years: JPY 245,000/year'],
              ],
              caption: 'Example based on a property with market price of JPY 50,000,000',
            },
          },
          {
            type: 'table',
            title: 'Payment schedule',
            data: {
              headers: ['Installment', 'Due month', 'Share', 'Notes'],
              rows: [
                ['1st', 'June', '25%', 'Tax notice delivered Apr–May'],
                ['2nd', 'September', '25%', 'Bank transfer available'],
                ['3rd', 'December', '25%', 'Convenience store payment available'],
                ['4th', 'February (next year)', '25%', 'Late payment incurs penalties'],
              ],
            },
          },
        ],
      },
      ja: {
        content: `固定資産税と都市計画税は、日本の不動産を保有する際に重要となる税金です。

固定資産税は固定資産税評価額を基準に計算され、標準税率は1.4%です。評価額は一般的に市場価格より低く設定される点がポイントです。新築住宅の減税や小規模住宅用地の特例など、条件により軽減措置を受けられる場合があります。

[TABLE:0]

都市計画税も固定資産税評価額を基準に計算され、税率上限は0.3%です（市区町村が課税）。

[TABLE:1]

毎年4〜5月頃に納税通知書が届き、通常は年4回（6月・9月・12月・翌年2月）に分けて納付します。銀行振込やコンビニ払いが利用できます。

節税のポイントは、各種軽減制度の把握、減価償却の活用、税務の専門家への相談などです。`,
        charts: [
          {
            type: 'table',
            title: '固定資産税の計算例',
            data: {
              headers: ['項目', '説明', '例'],
              rows: [
                ['市場価格', '実際の取引価格', '5,000万円'],
                ['評価額', '市場価格の約70%が目安', '3,500万円'],
                ['標準税率', '固定税率', '1.4%'],
                ['年税額', '評価額 × 税率', '49万円'],
                ['新築住宅減税', '3年間は1/2軽減', '最初の3年：24.5万円/年'],
              ],
              caption: '市場価格5,000万円の物件を例にしたイメージ',
            },
          },
          {
            type: 'table',
            title: '納税スケジュール',
            data: {
              headers: ['期', '納付月', '割合', '備考'],
              rows: [
                ['第1期', '6月', '25%', '納税通知書は4〜5月頃'],
                ['第2期', '9月', '25%', '銀行振込可'],
                ['第3期', '12月', '25%', 'コンビニ払い可'],
                ['第4期', '翌年2月', '25%', '延滞すると延滞金が発生'],
              ],
            },
          },
        ],
      },
      'zh-HK': {
        content: `固定資產稅與城市規劃稅是日本房產持有期間需要繳納的重要稅費。

固定資產稅以固定資產評估額為基準計算，標準稅率為1.4%。評估額通常低於市場價，這是計算時需要注意的要點。新建住宅有減稅措施，小規模住宅有特例，符合條件可申請減免。

[TABLE:0]

城市規劃稅同樣以固定資產評估額為基準計算，稅率上限為0.3%，由市町村政府徵收。

[TABLE:1]

每年4至5月會收到納稅通知書，分4期繳納，分別在6月、9月、12月和次年2月。可透過銀行轉帳或便利店繳納。

節稅建議包括了解各種減免政策，合理利用折舊，以及諮詢稅務專業人士。`,
        charts: [
          {
            type: 'table',
            title: '固定資產稅計算示例',
            data: {
              headers: ['項目', '說明', '示例'],
              rows: [
                ['市場價', '房產實際交易價格', '5,000萬日元'],
                ['評估額', '通常為市場價的70%', '3,500萬日元'],
                ['標準稅率', '固定稅率', '1.4%'],
                ['年稅額', '評估額 × 稅率', '49萬日元'],
                ['新建住宅減稅', '前3年減半徵收', '前3年：24.5萬日元/年'],
              ],
              caption: '以市場價5,000萬日元的房產為例',
            },
          },
          {
            type: 'table',
            title: '納稅時間表',
            data: {
              headers: ['期數', '繳納月份', '繳納比例', '備註'],
              rows: [
                ['第1期', '6月', '25%', '納稅通知書4-5月送達'],
                ['第2期', '9月', '25%', '可透過銀行轉帳'],
                ['第3期', '12月', '25%', '可透過便利店繳納'],
                ['第4期', '次年2月', '25%', '逾期需繳納滯納金'],
              ],
            },
          },
        ],
      },
      'zh-TW': {
        content: `固定資產稅與城市規劃稅是日本房產持有期間需要繳納的重要稅費。

固定資產稅以固定資產評估額為基準計算，標準稅率為1.4%。評估額通常低於市場價，這是計算時需要注意的要點。新建住宅有減稅措施，小規模住宅有特例，符合條件可申請減免。

[TABLE:0]

城市規劃稅同樣以固定資產評估額為基準計算，稅率上限為0.3%，由市町村政府徵收。

[TABLE:1]

每年4至5月會收到納稅通知書，分4期繳納，分別在6月、9月、12月和次年2月。可透過銀行轉帳或便利商店繳納。

節稅建議包括了解各種減免政策，合理利用折舊，以及諮詢稅務專業人士。`,
        charts: [
          {
            type: 'table',
            title: '固定資產稅計算示例',
            data: {
              headers: ['項目', '說明', '示例'],
              rows: [
                ['市場價', '房產實際交易價格', '5,000萬日元'],
                ['評估額', '通常為市場價的70%', '3,500萬日元'],
                ['標準稅率', '固定稅率', '1.4%'],
                ['年稅額', '評估額 × 稅率', '49萬日元'],
                ['新建住宅減稅', '前3年減半徵收', '前3年：24.5萬日元/年'],
              ],
              caption: '以市場價5,000萬日元的房產為例',
            },
          },
          {
            type: 'table',
            title: '納稅時間表',
            data: {
              headers: ['期數', '繳納月份', '繳納比例', '備註'],
              rows: [
                ['第1期', '6月', '25%', '納稅通知書4-5月送達'],
                ['第2期', '9月', '25%', '可透過銀行轉帳'],
                ['第3期', '12月', '25%', '可透過便利商店繳納'],
                ['第4期', '次年2月', '25%', '逾期需繳納滯納金'],
              ],
            },
          },
        ],
      },
    },
  },
  {
    title: '租赁合同中的重要条款与常见风险',
    tag: '租赁管理',
    slug: 'rental-contract-important-clauses',
    content: `日本租赁合同条款复杂，了解关键条款和风险点对房东和租客都至关重要。

[TABLE:0]

租期通常为2年。续约条件需要明确续约程序和费用。解约通知需要提前通知，具体期限需在合同中明确。

日常维护属于租客责任范围，大型修缮属于房东责任范围。设备故障的责任划分需要在合同中明确。

[COMPARISON:0]

风险防范措施包括选择可靠的租客并进行背景调查，购买租赁保险，以及委托专业管理公司。`,
    charts: [
      {
        type: 'table',
        title: '租赁费用构成',
        data: {
          headers: ['费用项目', '金额标准', '说明'],
          rows: [
            ['月租金', '根据市场价确定', '每月固定支付'],
            ['押金', '1-2个月租金', '退租时扣除修缮费后返还'],
            ['礼金', '1-2个月租金（部分地区）', '一次性支付，不退'],
            ['中介费', '0.5-1个月租金', '签约时一次性支付'],
            ['火灾保险', '每年约1-2万日元', '通常由租客承担'],
          ],
        },
      },
      {
        type: 'comparison',
        title: '风险对比',
        data: {
          items: [
            {
              title: '房东风险',
              points: [
                '租客拖欠租金',
                '房屋损坏赔偿',
                '退租时原状恢复费用',
                '空置期损失',
              ],
            },
            {
              title: '租客风险',
              points: [
                '押金扣除争议',
                '租金上涨',
                '提前解约违约金',
                '设备故障维修责任',
              ],
            },
          ],
        },
      },
    ],
    i18n: {
      en: {
        content: `Japanese rental contracts can be clause-heavy. Understanding key clauses and common risks is essential for both landlords and tenants.

[TABLE:0]

Lease terms are typically 2 years. Renewal conditions should clearly state the renewal procedure and any fees. Notice periods for termination should also be explicitly defined in the contract.

Routine maintenance is generally the tenant’s responsibility, while major repairs are the landlord’s responsibility. The allocation of responsibility for equipment failures should be clearly written in the contract.

[COMPARISON:0]

Risk prevention includes selecting reliable tenants and conducting background checks, purchasing rental insurance, and working with a professional property management company.`,
        charts: [
          {
            type: 'table',
            title: 'Rental Cost Components',
            data: {
              headers: ['Item', 'Typical amount', 'Notes'],
              rows: [
                ['Monthly rent', 'Based on market rent', 'Paid monthly'],
                ['Security deposit', '1–2 months’ rent', 'Refunded after deducting restoration costs'],
                ['Key money', '1–2 months’ rent (varies by area)', 'One-time fee, non-refundable'],
                ['Agent fee', '0.5–1 month’s rent', 'One-time fee at signing'],
                ['Fire insurance', 'Approx. JPY 10,000–20,000/year', 'Usually paid by the tenant'],
              ],
            },
          },
          {
            type: 'comparison',
            title: 'Risk Comparison',
            data: {
              items: [
                {
                  title: 'Landlord risks',
                  points: [
                    'Rent delinquency',
                    'Property damage and compensation',
                    'Restoration costs at move-out',
                    'Vacancy loss',
                  ],
                },
                {
                  title: 'Tenant risks',
                  points: [
                    'Deposit deduction disputes',
                    'Rent increases',
                    'Early termination penalties',
                    'Maintenance responsibility for equipment failures',
                  ],
                },
              ],
            },
          },
        ],
      },
      ja: {
        content: `日本の賃貸契約は条項が多く、重要条項とリスクポイントの理解は、貸主・借主の双方にとって不可欠です。

[TABLE:0]

契約期間は一般的に2年です。更新条件は、更新手続きと費用を明確に定める必要があります。解約の通知期限も契約書に明記しておくことが重要です。

日常的な維持管理は借主負担、大規模修繕は貸主負担となるのが一般的です。設備故障時の責任範囲は契約書で明確にしておきましょう。

[COMPARISON:0]

リスク対策としては、信頼できる入居者の選定と与信確認、賃貸保険の加入、そして専門の管理会社への委託が有効です。`,
        charts: [
          {
            type: 'table',
            title: '賃貸費用の構成',
            data: {
              headers: ['費用項目', '目安', '説明'],
              rows: [
                ['月額賃料', '相場により決定', '毎月の固定支払い'],
                ['敷金', '賃料1〜2か月分', '退去時に原状回復費等を差し引いて返還'],
                ['礼金', '賃料1〜2か月分（地域差あり）', '一時金で返還されない'],
                ['仲介手数料', '賃料0.5〜1か月分', '契約時に一括支払い'],
                ['火災保険', '年額 約1〜2万円', '通常は借主負担'],
              ],
            },
          },
          {
            type: 'comparison',
            title: 'リスク比較',
            data: {
              items: [
                {
                  title: '貸主側のリスク',
                  points: [
                    '賃料の滞納',
                    '室内損傷の補償',
                    '退去時の原状回復費',
                    '空室期間による損失',
                  ],
                },
                {
                  title: '借主側のリスク',
                  points: [
                    '敷金精算のトラブル',
                    '賃料の値上げ',
                    '途中解約の違約金',
                    '設備故障時の修理負担範囲',
                  ],
                },
              ],
            },
          },
        ],
      },
      'zh-HK': {
        content: `日本租賃合同條款複雜，了解關鍵條款和風險點對房東和租客都至關重要。

[TABLE:0]

租期通常為2年。續約條件需要明確續約程序和費用。解約通知需要提前通知，具體期限需在合同中明確。

日常維護屬於租客責任範圍，大型修繕屬於房東責任範圍。設備故障的責任劃分需要在合同中明確。

[COMPARISON:0]

風險防範措施包括選擇可靠的租客並進行背景調查，購買租賃保險，以及委託專業管理公司。`,
        charts: [
          {
            type: 'table',
            title: '租賃費用構成',
            data: {
              headers: ['費用項目', '金額標準', '說明'],
              rows: [
                ['月租金', '根據市場價確定', '每月固定支付'],
                ['押金', '1-2個月租金', '退租時扣除修繕費後返還'],
                ['禮金', '1-2個月租金（部分地區）', '一次性支付，不退'],
                ['中介費', '0.5-1個月租金', '簽約時一次性支付'],
                ['火災保險', '每年約1-2萬日元', '通常由租客承擔'],
              ],
            },
          },
          {
            type: 'comparison',
            title: '風險對比',
            data: {
              items: [
                {
                  title: '房東風險',
                  points: ['租客拖欠租金', '房屋損壞賠償', '退租時原狀恢復費用', '空置期損失'],
                },
                {
                  title: '租客風險',
                  points: ['押金扣除爭議', '租金上漲', '提前解約違約金', '設備故障維修責任'],
                },
              ],
            },
          },
        ],
      },
      'zh-TW': {
        content: `日本租賃合約條款複雜，了解關鍵條款和風險點對房東和租客都至關重要。

[TABLE:0]

租期通常為2年。續約條件需要明確續約程序和費用。解約通知需要提前通知，具體期限需在合約中明確。

日常維護屬於租客責任範圍，大型修繕屬於房東責任範圍。設備故障的責任劃分需要在合約中明確。

[COMPARISON:0]

風險防範措施包括選擇可靠的租客並進行背景調查，購買租賃保險，以及委託專業管理公司。`,
        charts: [
          {
            type: 'table',
            title: '租賃費用構成',
            data: {
              headers: ['費用項目', '金額標準', '說明'],
              rows: [
                ['月租金', '根據市場價確定', '每月固定支付'],
                ['押金', '1-2個月租金', '退租時扣除修繕費後返還'],
                ['禮金', '1-2個月租金（部分地區）', '一次性支付，不退'],
                ['仲介費', '0.5-1個月租金', '簽約時一次性支付'],
                ['火災保險', '每年約1-2萬日元', '通常由租客承擔'],
              ],
            },
          },
          {
            type: 'comparison',
            title: '風險對比',
            data: {
              items: [
                {
                  title: '房東風險',
                  points: ['租客拖欠租金', '房屋損壞賠償', '退租時原狀恢復費用', '空置期損失'],
                },
                {
                  title: '租客風險',
                  points: ['押金扣除爭議', '租金上漲', '提前解約違約金', '設備故障維修責任'],
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    title: '公寓管理费与修缮基金的组成',
    tag: '资产维护',
    slug: 'apartment-management-fee-composition',
    content: `了解公寓管理费和修缮基金的组成，有助于合理评估持有成本。

管理费的用途包括公共区域清洁维护、电梯和门禁等设备维护、管理公司费用以及公共设施使用费。通常按套内面积比例分摊，每月固定金额，但根据实际支出可能调整。

[TABLE:0]

修缮基金的用途包括建筑物大规模修缮、设备更新换代、抗震加固工程以及外壁涂装等。修缮基金的特点是长期积累资金，专款专用，根据修缮计划确定金额。

费用水平方面，管理费通常每月5,000至20,000日元每户，修缮基金通常每月3,000至15,000日元每户，具体根据建筑物规模和设施而定。

[TABLE:1]

注意事项包括了解修缮基金余额，关注修缮计划，以及评估长期持有成本。`,
    charts: [
      {
        type: 'table',
        title: '管理费用途明细',
        data: {
          headers: ['用途', '说明', '占比'],
          rows: [
            ['公共区域清洁', '走廊、楼梯、大厅等', '约30%'],
            ['设备维护', '电梯、门禁、监控等', '约25%'],
            ['管理公司费用', '专业管理服务', '约20%'],
            ['公共设施', '照明、水电等', '约15%'],
            ['其他费用', '保险、杂费等', '约10%'],
          ],
        },
      },
      {
        type: 'table',
        title: '费用水平参考（每户/月）',
        data: {
          headers: ['建筑物类型', '管理费', '修缮基金', '合计'],
          rows: [
            ['小型公寓（10-20户）', '5,000-10,000日元', '3,000-8,000日元', '8,000-18,000日元'],
            ['中型公寓（20-50户）', '8,000-15,000日元', '5,000-12,000日元', '13,000-27,000日元'],
            ['大型公寓（50户以上）', '12,000-20,000日元', '8,000-15,000日元', '20,000-35,000日元'],
          ],
          caption: '具体金额根据建筑物规模、设施、地理位置等因素而定',
        },
      },
    ],
    i18n: {
      en: {
        content: `Understanding the breakdown of condominium management fees and repair reserve funds helps you evaluate holding costs more accurately.

Management fees are typically used for common-area cleaning, maintenance of facilities (elevators, access control, etc.), management company services, and utilities for shared areas. They are usually allocated by unit area and paid monthly, and may be adjusted based on actual expenses.

[TABLE:0]

Repair reserve funds are used for large-scale building repairs, equipment replacement, seismic upgrades, exterior wall repainting, and more. The key feature is long-term accumulation and dedicated use, with amounts determined by the building’s repair plan.

Typical levels: management fees are often JPY 5,000–20,000 per unit/month, and repair reserves are often JPY 3,000–15,000 per unit/month, depending on building size and facilities.

[TABLE:1]

Practical tips: check the reserve fund balance, review the repair plan, and evaluate long-term holding costs.`,
        charts: [
          {
            type: 'table',
            title: 'Management fee allocation (example)',
            data: {
              headers: ['Use', 'Description', 'Share'],
              rows: [
                ['Common-area cleaning', 'Hallways, stairs, lobby, etc.', 'Approx. 30%'],
                ['Facility maintenance', 'Elevators, access control, security cameras, etc.', 'Approx. 25%'],
                ['Management company', 'Professional management services', 'Approx. 20%'],
                ['Shared utilities', 'Lighting, water/electricity for common areas', 'Approx. 15%'],
                ['Other', 'Insurance, miscellaneous', 'Approx. 10%'],
              ],
            },
          },
          {
            type: 'table',
            title: 'Typical monthly costs (per unit)',
            data: {
              headers: ['Building type', 'Management fee', 'Repair reserve', 'Total'],
              rows: [
                ['Small condo (10–20 units)', 'JPY 5,000–10,000', 'JPY 3,000–8,000', 'JPY 8,000–18,000'],
                ['Mid-size condo (20–50 units)', 'JPY 8,000–15,000', 'JPY 5,000–12,000', 'JPY 13,000–27,000'],
                ['Large condo (50+ units)', 'JPY 12,000–20,000', 'JPY 8,000–15,000', 'JPY 20,000–35,000'],
              ],
              caption: 'Actual amounts vary by building size, facilities, and location',
            },
          },
        ],
      },
      ja: {
        content: `マンションの管理費と修繕積立金の内訳を理解すると、保有コストをより適切に見積もることができます。

管理費の主な用途は、共用部の清掃、設備（エレベーター・オートロック等）の維持管理、管理会社の業務費、共用部の光熱費などです。多くの場合、専有面積に応じて按分され、月額で支払います（実費により見直されることがあります）。

[TABLE:0]

修繕積立金は、大規模修繕、設備更新、耐震補強、外壁塗装などに充当されます。長期的に積み立てて目的外使用しない点が特徴で、金額は修繕計画に基づき設定されます。

費用水準の目安として、管理費は月5,000〜20,000円／戸、修繕積立金は月3,000〜15,000円／戸程度が一般的です（規模や設備により変動）。

[TABLE:1]

注意点として、積立金残高の確認、修繕計画の内容把握、長期保有時の総コスト評価が挙げられます。`,
        charts: [
          {
            type: 'table',
            title: '管理費の主な用途（例）',
            data: {
              headers: ['用途', '内容', '割合'],
              rows: [
                ['共用部清掃', '廊下・階段・エントランス等', '約30%'],
                ['設備維持', 'エレベーター・オートロック・監視等', '約25%'],
                ['管理会社費', '管理業務サービス', '約20%'],
                ['共用設備', '照明・水道光熱等', '約15%'],
                ['その他', '保険・雑費等', '約10%'],
              ],
            },
          },
          {
            type: 'table',
            title: '費用水準の目安（1戸あたり／月）',
            data: {
              headers: ['建物規模', '管理費', '修繕積立金', '合計'],
              rows: [
                ['小規模（10〜20戸）', '5,000〜10,000円', '3,000〜8,000円', '8,000〜18,000円'],
                ['中規模（20〜50戸）', '8,000〜15,000円', '5,000〜12,000円', '13,000〜27,000円'],
                ['大規模（50戸以上）', '12,000〜20,000円', '8,000〜15,000円', '20,000〜35,000円'],
              ],
              caption: '実額は規模・設備・立地等により変動します',
            },
          },
        ],
      },
      'zh-HK': {
        content: `了解公寓管理費和修繕基金的組成，有助於合理評估持有成本。

管理費的用途包括公共區域清潔維護、電梯和門禁等設備維護、管理公司費用以及公共設施使用費。通常按套內面積比例分攤，每月固定金額，但會因實際支出而調整。

[TABLE:0]

修繕基金的用途包括建築物大規模修繕、設備更新換代、抗震加固工程以及外牆塗裝等。修繕基金的特點是長期積累資金、專款專用，金額依修繕計劃而定。

費用水平方面，管理費通常每月5,000至20,000日元／戶，修繕基金通常每月3,000至15,000日元／戶，具體視建築物規模和設施而定。

[TABLE:1]

注意事項包括了解修繕基金餘額、關注修繕計劃，以及評估長期持有成本。`,
        charts: [
          {
            type: 'table',
            title: '管理費用途明細',
            data: {
              headers: ['用途', '說明', '佔比'],
              rows: [
                ['公共區域清潔', '走廊、樓梯、大廳等', '約30%'],
                ['設備維護', '電梯、門禁、監控等', '約25%'],
                ['管理公司費用', '專業管理服務', '約20%'],
                ['公共設施', '照明、水電等', '約15%'],
                ['其他費用', '保險、雜費等', '約10%'],
              ],
            },
          },
          {
            type: 'table',
            title: '費用水平參考（每戶／月）',
            data: {
              headers: ['建築物類型', '管理費', '修繕基金', '合計'],
              rows: [
                ['小型公寓（10-20戶）', '5,000-10,000日元', '3,000-8,000日元', '8,000-18,000日元'],
                ['中型公寓（20-50戶）', '8,000-15,000日元', '5,000-12,000日元', '13,000-27,000日元'],
                ['大型公寓（50戶以上）', '12,000-20,000日元', '8,000-15,000日元', '20,000-35,000日元'],
              ],
              caption: '具體金額視建築物規模、設施、地理位置等因素而定',
            },
          },
        ],
      },
      'zh-TW': {
        content: `了解公寓管理費和修繕基金的組成，有助於合理評估持有成本。

管理費的用途包括公共區域清潔維護、電梯和門禁等設備維護、管理公司費用以及公共設施使用費。通常按套內面積比例分攤，每月固定金額，但會因實際支出而調整。

[TABLE:0]

修繕基金的用途包括建築物大規模修繕、設備更新換代、抗震加固工程以及外牆塗裝等。修繕基金的特點是長期積累資金、專款專用，金額依修繕計劃而定。

費用水準方面，管理費通常每月5,000至20,000日元／戶，修繕基金通常每月3,000至15,000日元／戶，具體視建築物規模和設施而定。

[TABLE:1]

注意事項包括了解修繕基金餘額、關注修繕計劃，以及評估長期持有成本。`,
        charts: [
          {
            type: 'table',
            title: '管理費用途明細',
            data: {
              headers: ['用途', '說明', '佔比'],
              rows: [
                ['公共區域清潔', '走廊、樓梯、大廳等', '約30%'],
                ['設備維護', '電梯、門禁、監控等', '約25%'],
                ['管理公司費用', '專業管理服務', '約20%'],
                ['公共設施', '照明、水電等', '約15%'],
                ['其他費用', '保險、雜費等', '約10%'],
              ],
            },
          },
          {
            type: 'table',
            title: '費用水準參考（每戶／月）',
            data: {
              headers: ['建築物類型', '管理費', '修繕基金', '合計'],
              rows: [
                ['小型公寓（10-20戶）', '5,000-10,000日元', '3,000-8,000日元', '8,000-18,000日元'],
                ['中型公寓（20-50戶）', '8,000-15,000日元', '5,000-12,000日元', '13,000-27,000日元'],
                ['大型公寓（50戶以上）', '12,000-20,000日元', '8,000-15,000日元', '20,000-35,000日元'],
              ],
              caption: '具體金額視建築物規模、設施、地理位置等因素而定',
            },
          },
        ],
      },
    },
  },
  {
    title: '非居住者如何在日本申请房贷（2025最新指南）',
    tag: '融资',
    slug: 'non-resident-mortgage-application-2025',
    content: `非居住者在日本申请房贷虽然条件相对严格，但2025年随着市场环境变化，申请途径更加多样化。

基本要求包括稳定的收入证明，年收入通常需300万日元以上，良好的信用记录，足够的首付款（通常30%至50%，部分银行可降至20%），以及日本银行账户。

[TABLE:0]

2025年新变化方面，部分银行放宽了对非居住者的审查标准，增加了针对海外投资者的专门产品，并支持多币种贷款，包括美元和人民币等。

主要银行包括三菱UFJ银行，针对高净值客户有专门产品；三井住友银行，支持海外收入证明；瑞穗银行，非居住者贷款审批率提升；以及绮罗星银行、东日本银行等地方银行。

部分外资银行提供更灵活的贷款条件，支持海外资产作为担保，利率可能相对较高但审批更快。

[TABLE:1]

申请流程包括咨询阶段，了解各银行产品并对比利率和条件；资料准备，包括收入证明、身份证明、资金来源证明等；初步审查，银行评估申请资格和贷款额度；正式申请，提交完整资料包括物业评估报告；审查与审批，通常需要1至3个月；以及签约与放款，完成贷款手续，资金到位。

[FLOW:0]

利率可能高于居住者，但2025年差距有所缩小。审批时间可能较长，建议提前准备。需要准备充分的资料，包括翻译件。建议咨询专业贷款顾问，选择最适合的产品。同时需要关注汇率变动对还款的影响。

数据来源：xijia.jp`,
    charts: [
      {
        type: 'table',
        title: '基本申请要求',
        data: {
          headers: ['要求项目', '标准', '备注'],
          rows: [
            ['年收入', '300万日元以上', '需提供稳定收入证明'],
            ['信用记录', '良好', '无不良信用记录'],
            ['首付款', '30-50%（部分银行20%）', '根据银行和条件而定'],
            ['日本银行账户', '必需', '用于还款'],
            ['身份证明', '有效护照等', '需翻译件'],
          ],
        },
      },
      {
        type: 'table',
        title: '2025年利率水平参考',
        data: {
          headers: ['贷款类型', '利率范围', '说明'],
          rows: [
            ['浮动利率', '0.5% - 1.2%', '根据银行和条件而定'],
            ['10年固定', '1.0% - 1.5%', '部分银行推出0.45%超低利率'],
            ['20年固定', '1.2% - 1.8%', '需满足特定条件'],
            ['35年固定', '1.5% - 2.0%', '长期稳定还款'],
          ],
        },
      },
      {
        type: 'flow',
        title: '申请流程',
        data: {
          steps: [
            {
              title: '咨询阶段',
              description: '了解各银行产品，对比利率和条件，选择最适合的银行',
            },
            {
              title: '资料准备',
              description: '准备收入证明、身份证明、资金来源证明等，需要翻译件',
            },
            {
              title: '初步审查',
              description: '银行评估申请资格和贷款额度，通常1-2周',
            },
            {
              title: '正式申请',
              description: '提交完整资料，包括物业评估报告',
            },
            {
              title: '审查与审批',
              description: '银行详细审查，通常需要1-3个月',
            },
            {
              title: '签约与放款',
              description: '完成贷款手续，资金到位',
            },
          ],
        },
      },
    ],
    i18n: {
      en: {
        content: `While mortgage requirements for non-residents in Japan are generally stricter, the market environment in 2025 has made application channels more diverse.

Basic requirements often include stable income documentation (typically JPY 3,000,000+ annual income), good credit history, sufficient down payment (commonly 30–50%, with some banks allowing 20%), and a Japanese bank account.

[TABLE:0]

What’s new in 2025: some banks have eased screening criteria for non-residents, launched dedicated products for overseas investors, and expanded multi-currency loan options (e.g., USD and RMB).

Major banks/products: MUFG may offer dedicated programs for high-net-worth clients; SMBC may accept overseas income documents; Mizuho has improved approval rates for non-residents; and some regional banks (e.g., Kiraboshi Bank, Higashi-Nippon Bank) may provide flexible options.

Some foreign-owned banks can be more flexible, accepting overseas assets as collateral; rates may be higher but approval can be faster.

[TABLE:1]

Typical process: consultation (compare products, rates, conditions) → document preparation (income/ID/source of funds, translations) → preliminary screening → formal application (including appraisal) → review & approval (often 1–3 months) → contract & disbursement.

[FLOW:0]

Notes: rates for non-residents can be higher, but the gap has narrowed in 2025. Processing may take longer—prepare documents early and consider professional advice. Also factor in FX risk if your income is in a different currency.

Source: xijia.jp`,
        charts: [
          {
            type: 'table',
            title: 'Basic eligibility requirements',
            data: {
              headers: ['Item', 'Typical standard', 'Notes'],
              rows: [
                ['Annual income', 'JPY 3,000,000+', 'Stable income documentation required'],
                ['Credit history', 'Good', 'No major negative records'],
                ['Down payment', '30–50% (some banks 20%)', 'Depends on bank and conditions'],
                ['Japanese bank account', 'Required', 'Used for repayments'],
                ['ID documents', 'Valid passport, etc.', 'Translations may be required'],
              ],
            },
          },
          {
            type: 'table',
            title: 'Reference interest rates in 2025',
            data: {
              headers: ['Loan type', 'Rate range', 'Notes'],
              rows: [
                ['Variable', '0.5% – 1.2%', 'Depends on bank and conditions'],
                ['10-year fixed', '1.0% – 1.5%', 'Some products offer very low rates (e.g., 0.45%)'],
                ['20-year fixed', '1.2% – 1.8%', 'May require specific conditions'],
                ['35-year fixed', '1.5% – 2.0%', 'Long-term stable repayment'],
              ],
            },
          },
          {
            type: 'flow',
            title: 'Application flow',
            data: {
              steps: [
                { title: 'Consultation', description: 'Compare products, interest rates, and conditions; select the most suitable bank' },
                { title: 'Document preparation', description: 'Prepare income proof, ID documents, source-of-funds proof; translations may be required' },
                { title: 'Preliminary screening', description: 'Bank reviews eligibility and loan amount (typically 1–2 weeks)' },
                { title: 'Formal application', description: 'Submit full documents, including property appraisal report' },
                { title: 'Review & approval', description: 'Detailed review by the bank (often 1–3 months)' },
                { title: 'Contract & disbursement', description: 'Complete paperwork and receive funds' },
              ],
            },
          },
        ],
      },
      ja: {
        content: `非居住者が日本で住宅ローンを利用する場合、一般的に審査条件は厳しめですが、2025年は市場環境の変化により選択肢が広がっています。

基本要件としては、安定した収入証明（年収目安300万円以上）、良好な信用状況、十分な頭金（目安30〜50%、一部金融機関では20%まで）、そして日本の銀行口座などが求められます。

[TABLE:0]

2025年の主な変化：非居住者向けの審査基準を緩和する動き、海外投資家向け専用商品、多通貨ローン（USD・RMB等）への対応が見られます。

主な金融機関の傾向として、三菱UFJ銀行は富裕層向け商品、三井住友銀行は海外収入証明への対応、みずほ銀行は非居住者の承認率改善、また一部地方銀行（きらぼし銀行、東日本銀行等）で柔軟な取り扱いが期待できます。

外資系銀行では海外資産を担保として認めるなど柔軟な場合があり、金利は高めでも審査が早いケースがあります。

[TABLE:1]

申請の流れは、相談（商品比較）→ 書類準備（収入・身分証・資金源、翻訳等）→ 事前審査 → 本申込（物件評価含む）→ 審査・承認（目安1〜3か月）→ 契約・実行 となります。

[FLOW:0]

注意点：非居住者は金利が高くなる場合がありますが、2025年は差が縮小する傾向もあります。審査期間は長くなることがあるため早めの準備が重要です。返済通貨と収入通貨が異なる場合は為替変動も考慮しましょう。

出典：xijia.jp`,
        charts: [
          {
            type: 'table',
            title: '基本申請要件',
            data: {
              headers: ['要件', '目安', '備考'],
              rows: [
                ['年収', '300万円以上', '安定収入の証明が必要'],
                ['信用情報', '良好', '重大な信用事故がないこと'],
                ['頭金', '30〜50%（一部20%）', '金融機関・条件により異なる'],
                ['日本の銀行口座', '必須', '返済口座として利用'],
                ['本人確認書類', '有効なパスポート等', '翻訳が必要な場合あり'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025年の金利水準（目安）',
            data: {
              headers: ['タイプ', '金利レンジ', '説明'],
              rows: [
                ['変動金利', '0.5%〜1.2%', '銀行・条件により異なる'],
                ['10年固定', '1.0%〜1.5%', '0.45%など超低金利商品も一部あり'],
                ['20年固定', '1.2%〜1.8%', '条件を満たす必要がある場合あり'],
                ['35年固定', '1.5%〜2.0%', '長期で安定返済'],
              ],
            },
          },
          {
            type: 'flow',
            title: '申請フロー',
            data: {
              steps: [
                { title: '相談', description: '各銀行の商品・金利・条件を比較し、最適な銀行を選ぶ' },
                { title: '書類準備', description: '収入証明、本人確認、資金源証明などを準備（翻訳が必要な場合あり）' },
                { title: '事前審査', description: '融資可否と融資額の目安を確認（通常1〜2週間）' },
                { title: '本申込', description: '物件評価書などを含む必要書類を提出' },
                { title: '審査・承認', description: '銀行の詳細審査（通常1〜3か月）' },
                { title: '契約・実行', description: '契約手続きを完了し、融資実行' },
              ],
            },
          },
        ],
      },
      'zh-HK': {
        content: `非居住者在日本申請房貸雖然條件相對嚴格，但2025年隨著市場環境變化，申請途徑更加多樣化。

基本要求包括穩定的收入證明，年收入通常需300萬日元以上，良好的信用記錄，足夠的首付款（通常30%至50%，部分銀行可降至20%），以及日本銀行帳戶。

[TABLE:0]

2025年新變化方面，部分銀行放寬了對非居住者的審查標準，增加了針對海外投資者的專門產品，並支持多幣種貸款，包括美元和人民幣等。

主要銀行包括三菱UFJ銀行（針對高淨值客戶有專門產品）、三井住友銀行（支持海外收入證明）、瑞穗銀行（非居住者貸款審批率提升），以及綺羅星銀行、東日本銀行等地方銀行。

部分外資銀行提供更靈活的貸款條件，支持海外資產作為擔保，利率可能相對較高但審批更快。

[TABLE:1]

申請流程包括諮詢階段（對比產品、利率和條件）、資料準備（收入證明、身份證明、資金來源證明等）、初步審查、正式申請（含物業評估報告）、審查與審批（通常1至3個月）以及簽約與放款。

[FLOW:0]

利率可能高於居住者，但2025年差距有所縮小。審批時間可能較長，建議提前準備資料（含翻譯件），並諮詢專業顧問。同時需要關注匯率變動對還款的影響。

數據來源：xijia.jp`,
        charts: [
          {
            type: 'table',
            title: '基本申請要求',
            data: {
              headers: ['要求項目', '標準', '備註'],
              rows: [
                ['年收入', '300萬日元以上', '需提供穩定收入證明'],
                ['信用記錄', '良好', '無不良信用記錄'],
                ['首付款', '30-50%（部分銀行20%）', '視銀行與條件而定'],
                ['日本銀行帳戶', '必需', '用於還款'],
                ['身份證明', '有效護照等', '需翻譯件'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025年利率水平參考',
            data: {
              headers: ['貸款類型', '利率範圍', '說明'],
              rows: [
                ['浮動利率', '0.5% - 1.2%', '視銀行與條件而定'],
                ['10年固定', '1.0% - 1.5%', '部分銀行推出0.45%超低利率'],
                ['20年固定', '1.2% - 1.8%', '需滿足特定條件'],
                ['35年固定', '1.5% - 2.0%', '長期穩定還款'],
              ],
            },
          },
          {
            type: 'flow',
            title: '申請流程',
            data: {
              steps: [
                { title: '諮詢階段', description: '了解各銀行產品，對比利率和條件，選擇最適合的銀行' },
                { title: '資料準備', description: '準備收入證明、身份證明、資金來源證明等，需要翻譯件' },
                { title: '初步審查', description: '銀行評估申請資格和貸款額度，通常1-2週' },
                { title: '正式申請', description: '提交完整資料，包括物業評估報告' },
                { title: '審查與審批', description: '銀行詳細審查，通常需要1-3個月' },
                { title: '簽約與放款', description: '完成貸款手續，資金到位' },
              ],
            },
          },
        ],
      },
      'zh-TW': {
        content: `非居住者在日本申請房貸雖然條件相對嚴格，但2025年隨著市場環境變化，申請途徑更加多樣化。

基本要求包括穩定的收入證明，年收入通常需300萬日元以上，良好的信用記錄，足夠的首付款（通常30%至50%，部分銀行可降至20%），以及日本銀行帳戶。

[TABLE:0]

2025年新變化方面，部分銀行放寬了對非居住者的審查標準，增加了針對海外投資者的專門產品，並支持多幣種貸款，包括美元和人民幣等。

主要銀行包括三菱UFJ銀行（針對高淨值客戶有專門產品）、三井住友銀行（支援海外收入證明）、瑞穗銀行（非居住者貸款審批率提升），以及綺羅星銀行、東日本銀行等地方銀行。

部分外資銀行提供更靈活的貸款條件，支援海外資產作為擔保，利率可能相對較高但審批更快。

[TABLE:1]

申請流程包括諮詢階段（對比產品、利率和條件）、資料準備（收入證明、身分證明、資金來源證明等）、初步審查、正式申請（含物業評估報告）、審查與審批（通常1至3個月）以及簽約與放款。

[FLOW:0]

利率可能高於居住者，但2025年差距有所縮小。審批時間可能較長，建議提前準備資料（含翻譯件），並諮詢專業顧問。同時需要關注匯率變動對還款的影響。

數據來源：xijia.jp`,
        charts: [
          {
            type: 'table',
            title: '基本申請要求',
            data: {
              headers: ['要求項目', '標準', '備註'],
              rows: [
                ['年收入', '300萬日元以上', '需提供穩定收入證明'],
                ['信用記錄', '良好', '無不良信用記錄'],
                ['首付款', '30-50%（部分銀行20%）', '視銀行與條件而定'],
                ['日本銀行帳戶', '必需', '用於還款'],
                ['身分證明', '有效護照等', '需翻譯件'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025年利率水準參考',
            data: {
              headers: ['貸款類型', '利率範圍', '說明'],
              rows: [
                ['浮動利率', '0.5% - 1.2%', '視銀行與條件而定'],
                ['10年固定', '1.0% - 1.5%', '部分銀行推出0.45%超低利率'],
                ['20年固定', '1.2% - 1.8%', '需滿足特定條件'],
                ['35年固定', '1.5% - 2.0%', '長期穩定還款'],
              ],
            },
          },
          {
            type: 'flow',
            title: '申請流程',
            data: {
              steps: [
                { title: '諮詢階段', description: '了解各銀行產品，對比利率和條件，選擇最適合的銀行' },
                { title: '資料準備', description: '準備收入證明、身分證明、資金來源證明等，需要翻譯件' },
                { title: '初步審查', description: '銀行評估申請資格和貸款額度，通常1-2週' },
                { title: '正式申請', description: '提交完整資料，包括物業評估報告' },
                { title: '審查與審批', description: '銀行詳細審查，通常需要1-3個月' },
                { title: '簽約與放款', description: '完成貸款手續，資金到位' },
              ],
            },
          },
        ],
      },
    },
  },
  {
    title: '2025年日本房产投资税务优化策略',
    tag: '税务',
    slug: 'japan-property-tax-optimization-2025',
    content: `了解2025年日本房产投资的税务政策，合理规划可以显著降低持有成本。

固定资产税标准税率为1.4%，计算基础为固定资产评估额，通常为市场价的70%左右。新建住宅前3年减半征收。

[TABLE:0]

城市规划税税率上限为0.3%，征收对象为城市规划区域内的房产，用途为城市基础设施建设。

所得税采用累进税率，税率为5%至45%。扣除项目包括折旧、管理费、修缮费等。节税策略是合理利用折旧和费用扣除。

[TABLE:1]

2025年新政策方面，针对节能住宅的税收优惠扩大，抗震改造费用的扣除额度提升，长期持有物业的转让所得税优惠。

节税建议包括选择符合节能标准的物业，进行抗震改造以享受税收优惠，合理规划持有期限以利用长期持有优惠，以及咨询税务专业人士制定最优方案。`,
    charts: [
      {
        type: 'table',
        title: '主要税种一览',
        data: {
          headers: ['税种', '税率/计算基础', '特点'],
          rows: [
            ['固定资产税', '1.4%（评估额）', '评估额通常为市场价70%，新建住宅前3年减半'],
            ['城市规划税', '0.3%上限（评估额）', '仅城市规划区域内征收'],
            ['所得税', '5%-45%累进税率', '可扣除折旧、管理费、修缮费等'],
            ['转让所得税', '根据持有期限', '长期持有（5年以上）享受优惠'],
          ],
        },
      },
      {
        type: 'table',
        title: '2025年新政策优惠',
        data: {
          headers: ['政策', '优惠内容', '适用条件'],
          rows: [
            ['节能住宅', '税收优惠扩大', '符合节能标准的物业'],
            ['抗震改造', '扣除额度提升', '进行抗震改造的物业'],
            ['长期持有', '转让所得税优惠', '持有5年以上的物业'],
          ],
        },
      },
    ],
    i18n: {
      en: {
        content: `Understanding Japan’s 2025 tax policies for real estate investment—and planning accordingly—can meaningfully reduce holding costs.

Fixed Asset Tax has a standard rate of 1.4% and is calculated on the assessed value (often around 70% of market price). New homes may qualify for a 50% reduction for the first 3 years.

[TABLE:0]

City Planning Tax has a rate cap of 0.3% and applies to properties within designated city planning areas, funding local infrastructure.

Income tax is progressive (5%–45%). Deductible items often include depreciation, management fees, and repair costs. A key strategy is to optimize depreciation and expense deductions.

[TABLE:1]

New incentives in 2025 include expanded benefits for energy-efficient housing, higher deduction limits for seismic upgrades, and preferential capital gains tax treatment for long-term holdings.

Practical tips: choose properties that meet energy-efficiency standards, consider seismic upgrades to use incentives, plan holding periods to benefit from long-term treatment, and consult tax professionals for an optimal plan.`,
        charts: [
          {
            type: 'table',
            title: 'Key taxes at a glance',
            data: {
              headers: ['Tax', 'Rate / basis', 'Notes'],
              rows: [
                ['Fixed Asset Tax', '1.4% (assessed value)', 'Assessed value often ~70% of market; new homes may get 50% reduction for 3 years'],
                ['City Planning Tax', 'Up to 0.3% (assessed value)', 'Levied only in city planning areas'],
                ['Income tax', 'Progressive 5%–45%', 'Depreciation, management fees, repairs, etc. may be deductible'],
                ['Capital gains tax', 'Depends on holding period', 'Preferential treatment for long-term holdings (often 5+ years)'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025 policy incentives',
            data: {
              headers: ['Policy', 'Benefit', 'Eligibility'],
              rows: [
                ['Energy-efficient housing', 'Expanded tax incentives', 'Properties meeting energy-efficiency standards'],
                ['Seismic upgrades', 'Higher deduction limits', 'Properties undergoing seismic retrofit'],
                ['Long-term holding', 'Preferential capital gains tax', 'Holding period of 5+ years'],
              ],
            },
          },
        ],
      },
      ja: {
        content: `2025年の日本の不動産投資に関する税制を理解し、適切に設計することで保有コストを大きく抑えられる可能性があります。

固定資産税は標準税率1.4%で、固定資産税評価額（市場価格の約70%程度が目安）を基準に計算されます。新築住宅は3年間1/2軽減などの制度があります。

[TABLE:0]

都市計画税は税率上限0.3%で、都市計画区域内の不動産に課され、インフラ整備等の財源となります。

所得税は累進課税（5%〜45%）で、減価償却費、管理費、修繕費などを経費として控除できるケースがあります。節税の基本は、減価償却と経費控除を適切に活用することです。

[TABLE:1]

2025年の新しい動きとして、省エネ住宅の優遇拡大、耐震改修費用の控除枠拡大、長期保有に関する譲渡所得税の優遇などが挙げられます。

実務上は、省エネ基準を満たす物件の選定、耐震改修の検討、保有期間の設計（長期優遇の活用）、税務専門家への相談が有効です。`,
        charts: [
          {
            type: 'table',
            title: '主要税目一覧',
            data: {
              headers: ['税目', '税率／課税ベース', 'ポイント'],
              rows: [
                ['固定資産税', '1.4%（評価額）', '評価額は市場の約70%が目安／新築は3年1/2軽減等'],
                ['都市計画税', '上限0.3%（評価額）', '都市計画区域内のみ課税'],
                ['所得税', '累進 5%〜45%', '減価償却・管理費・修繕費等を控除できる場合あり'],
                ['譲渡所得税', '保有期間により異なる', '長期保有（5年以上等）で優遇'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025年の主な優遇策',
            data: {
              headers: ['施策', '内容', '条件'],
              rows: [
                ['省エネ住宅', '優遇拡大', '省エネ基準を満たす物件'],
                ['耐震改修', '控除枠の拡大', '耐震改修を実施する物件'],
                ['長期保有', '譲渡所得税の優遇', '5年以上保有する物件'],
              ],
            },
          },
        ],
      },
      'zh-HK': {
        content: `了解2025年日本房產投資的稅務政策，合理規劃可以顯著降低持有成本。

固定資產稅標準稅率為1.4%，計算基礎為固定資產評估額，通常為市場價的70%左右。新建住宅前3年減半徵收。

[TABLE:0]

城市規劃稅稅率上限為0.3%，徵收對象為城市規劃區域內的房產，用途為城市基礎設施建設。

所得稅採用累進稅率，稅率為5%至45%。扣除項目包括折舊、管理費、修繕費等。節稅策略是合理利用折舊和費用扣除。

[TABLE:1]

2025年新政策方面，針對節能住宅的稅收優惠擴大，抗震改造費用的扣除額度提升，長期持有物業的轉讓所得稅優惠。

節稅建議包括選擇符合節能標準的物業，進行抗震改造以享受稅收優惠，合理規劃持有期限以利用長期持有優惠，以及諮詢稅務專業人士制定最優方案。`,
        charts: [
          {
            type: 'table',
            title: '主要稅種一覽',
            data: {
              headers: ['稅種', '稅率／計算基礎', '特點'],
              rows: [
                ['固定資產稅', '1.4%（評估額）', '評估額通常為市場價70%，新建住宅前3年減半'],
                ['城市規劃稅', '0.3%上限（評估額）', '僅城市規劃區域內徵收'],
                ['所得稅', '5%-45%累進稅率', '可扣除折舊、管理費、修繕費等'],
                ['轉讓所得稅', '根據持有期限', '長期持有（5年以上）享受優惠'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025年新政策優惠',
            data: {
              headers: ['政策', '優惠內容', '適用條件'],
              rows: [
                ['節能住宅', '稅收優惠擴大', '符合節能標準的物業'],
                ['抗震改造', '扣除額度提升', '進行抗震改造的物業'],
                ['長期持有', '轉讓所得稅優惠', '持有5年以上的物業'],
              ],
            },
          },
        ],
      },
      'zh-TW': {
        content: `了解2025年日本房產投資的稅務政策，合理規劃可以顯著降低持有成本。

固定資產稅標準稅率為1.4%，計算基礎為固定資產評估額，通常為市場價的70%左右。新建住宅前3年減半徵收。

[TABLE:0]

城市規劃稅稅率上限為0.3%，徵收對象為城市規劃區域內的房產，用途為城市基礎設施建設。

所得稅採用累進稅率，稅率為5%至45%。扣除項目包括折舊、管理費、修繕費等。節稅策略是合理利用折舊和費用扣除。

[TABLE:1]

2025年新政策方面，針對節能住宅的稅收優惠擴大，抗震改造費用的扣除額度提升，長期持有物業的轉讓所得稅優惠。

節稅建議包括選擇符合節能標準的物業，進行抗震改造以享受稅收優惠，合理規劃持有期限以利用長期持有優惠，以及諮詢稅務專業人士制定最優方案。`,
        charts: [
          {
            type: 'table',
            title: '主要稅種一覽',
            data: {
              headers: ['稅種', '稅率／計算基礎', '特點'],
              rows: [
                ['固定資產稅', '1.4%（評估額）', '評估額通常為市場價70%，新建住宅前3年減半'],
                ['城市規劃稅', '0.3%上限（評估額）', '僅城市規劃區域內徵收'],
                ['所得稅', '5%-45%累進稅率', '可扣除折舊、管理費、修繕費等'],
                ['轉讓所得稅', '根據持有期限', '長期持有（5年以上）享受優惠'],
              ],
            },
          },
          {
            type: 'table',
            title: '2025年新政策優惠',
            data: {
              headers: ['政策', '優惠內容', '適用條件'],
              rows: [
                ['節能住宅', '稅收優惠擴大', '符合節能標準的物業'],
                ['抗震改造', '扣除額度提升', '進行抗震改造的物業'],
                ['長期持有', '轉讓所得稅優惠', '持有5年以上的物業'],
              ],
            },
          },
        ],
      },
    },
  },
]

// 最新资讯列表：仅保留静态条目，不包含房地产单条与 RSS（已按需求删除）
export function getLatestNews(): NewsItem[] {
  return [...latestNews]
}

// 根据 slug 获取资讯详情（房地产单条已从最新资讯移除，不再提供详情页）
export function getNewsBySlug(slug: string): NewsItem | undefined {
  return latestNews.find((news) => news.slug === slug)
}

// 根据 slug 获取百科详情
export function getEncyclopediaBySlug(slug: string) {
  const entry = encyclopediaEntries.find(entry => entry.slug === slug)
  return entry ? {
    ...entry,
    charts: entry.charts || []
  } : undefined
}

// 获取所有资讯 slug（含房地产单条）
export function getAllNewsSlugs() {
  return getLatestNews().map((news) => news.slug)
}

// 获取所有百科 slug
export function getAllEncyclopediaSlugs() {
  return encyclopediaEntries.map(entry => entry.slug)
}
