/**
 * 日本近3个月房地产相关新闻（影响地价/房价）
 * 仅收录「发布时间」在近三个月内的条目；页面展示时也会按当前日期再次过滤。
 * 字段：标题、时间、出处、URL、正文、正文内相关图片（非站标）
 */
export interface JapanRealEstateNewsItem {
  id: string
  title: string
  date: string // YYYY-MM-DD
  source: string
  url: string
  body: string
  images: string[] // 正文内图片 URL，非平台 logo
}

export const japanRealEstateNews: JapanRealEstateNewsItem[] = [
  {
    id: 'toyokeizai-construction-cost-2026',
    title: '都市再開発など大型プロジェクト中止が相次ぐ…人手不足だけじゃない、日本の建設費高騰を引き起こした「本当の原因」',
    date: '2026-02-06',
    source: '東洋経済オンライン',
    url: 'https://toyokeizai.net/articles/-/933695',
    body: `建設費の高騰が止まらない。それによって都市再開発などの大型建設プロジェクトの見直しや中止が相次ぎ、日本経済にも深刻な悪影響を及ぼし始めている。

2025年12月には改正建設業法が施行され、建設技能者の適正な賃金を確保するための基準となる標準労務費が導入された。これにより、建設費には一段の上昇圧力がかかる見通しだ。

不動産協会（理事長・吉田淳一・三菱地所会長）は25年11月、日本建設業連合会（日建連）に対して「建築費高騰等の問題に係る緊急申し入れ」を行った。発注者である不動産会社としては、建設業界や政府が公表するコスト上昇率と、元請けのゼネコンから提示される見積もり価格の上昇率に「大幅な乖離が見受けられる」との不満が高まっているからだ。

かつて建設業の施工能力が過剰だった時代には、過度な受注競争による建設価格の下落に歯止めをかけようと受注調整を行う「談合」が行われてきた。一転して技能労働者の減少による施工能力不足に陥ったことで、建設費の上昇に歯止めがかからない事態となっている。建設費高騰はゼネコンが「談合」してつり上げているわけではなく、各社が施工能力に応じて受注工事を選別している結果であり、現状では施工能力不足を解消するしか解決策はないだろう。`,
    images: [],
  },
  {
    id: 'mainichi-condo-jan2026',
    title: 'Central Tokyo average condo price up 15.8% in January',
    date: '2026-02-19',
    source: 'The Mainichi',
    url: 'https://mainichi.jp/english/articles/20260219/p2g/00m/0bu/031000c',
    body: `TOKYO (Kyodo) -- The average price of a new condominium in central Tokyo in January rose 15.8 percent from a year earlier to 121.26 million yen ($782,000), a research institute said Thursday.

The price in the greater metropolitan area covering the capital and its three surrounding prefectures increased 14.2 percent to 83.83 million yen, increasing for a ninth consecutive month, due partly to rising construction costs, the Real Estate Economic Institute said.

The number of new condos listed for sale in Tokyo and the neighboring prefectures edged up 1.3 percent to 628 units, rising for the first time in four months, according to the institute.

In western Tokyo, outside the capital's 23 wards, the average price for new condominiums fell 13.7 percent to 65.24 million yen, while the price declined 3.3 percent to 54.92 million yen in neighboring Saitama Prefecture.

Meanwhile, the price rose 24.7 percent to 82.94 million yen in Kanagawa Prefecture and 21.8 percent to 59.33 million yen in Chiba Prefecture.`,
    images: [],
  },
  {
    id: 'nhk-mansion-dec2025',
    title: '12月の新築マンション平均価格 東京23区で1億4789万円に',
    date: '2026-01-26',
    source: 'NHK',
    url: 'https://www3.nhk.or.jp/news/html/20260126/k10015035931000.html',
    body: `2026年1月26日発表。12月、東京23区で発売された新築マンションの平均価格は、前の年の同じ月より36.7％上昇し、1億4789万円となりました。

民間の調査会社「不動産経済研究所」によりますと、12月に東京23区で発売された新築マンションの平均価格は前年同月比36.7％上昇の1億4789万円。首都圏全体の発売戸数は前年同月比6％減でしたが、1戸あたり平均価格は上昇が続いています。`,
    images: [],
  },
  {
    id: 'reuters-mansion-dec2025',
    title: '首都圏マンション、12月発売戸数6％減　価格は上昇＝不動産経済研',
    date: '2026-01-26',
    source: 'ロイター',
    url: 'https://jp.reuters.com/business/2W45DK6LPVMQ3C7BUABHZ2GCFI-2026-01-26/',
    body: `[東京 ２６日 ロイター] - 不動産経済研究所が２６日発表した１２月の首都圏（１都３県）新築分譲マンション市場動向によると、発売戸数は前年同月比６．０％減の５４６８戸だった。東京２３区などで落ち込み、３カ月連続で減少した。１戸当たりの平均価格は同１５．５％上昇の８４６９万円で、８カ月連続で上昇した。

東京２３区の発売戸数は同２５．１％減の１３９８戸、平均価格は３６．７％上昇し１億４７８９万円だった。

首都圏で１２月に新規販売されたマンションの初月契約率は６３．１％で、好不調の目安となる７０％を下回る状況が続いている。

２０２６年１月の発売は１０００戸程度を見込んでいる。

同時に発表した２５年１年間の首都圏新築分譲マンションの発売戸数は同４．５％減の２万１９６２戸で、１９７３年以降で最も少なかった。平均価格は９１８２万円（同１７．４％上昇）で２年ぶりに上昇、２３年の８１０１万円を上回り最高値を更新した。`,
    images: [],
  },
  {
    id: 'mainichi-condo-136mil',
    title: 'Central Tokyo condo prices hit record 136 million yen amid high costs',
    date: '2026-01-26',
    source: 'The Mainichi',
    url: 'https://mainichi.jp/english/articles/20260126/p2g/00m/0bu/045000c',
    body: `TOKYO (Kyodo) -- The average price of new condominiums in central Tokyo climbed to a record 136.13 million yen ($885,000) last year as building material and labor costs remained high, topping 100 million yen for the third consecutive year, real estate research firm data showed Monday.

The price per unit jumped 21.8 percent from a year earlier in Tokyo's 23 wards, while the average in the greater Tokyo metropolitan area, including three neighboring prefectures, rose 17.4 percent to 91.82 million yen, topping the 90 million yen mark for the first time, according to the Real Estate Economic Institute.

Meanwhile, the average price of new condos increased 13.7 percent to 66.99 million yen for Tokyo's municipalities outside the 23 wards, 11.4 percent to 71.65 million yen in Kanagawa Prefecture, 15.8 percent to 64.20 million yen in Saitama Prefecture, and 2.7 percent to 58.42 million yen in Chiba Prefecture.

The number of new condominiums put on sale in 2025 in the capital and the surrounding three prefectures fell 4.5 percent from the year before to 21,962 units, declining for the fourth straight year and renewing the lowest level marked the previous year since records began in 1973, the institute said.

Around 23,000 units are expected to be released this year in the greater capital region, up 4.7 percent, on the back of momentum in areas surrounding central Tokyo's 23 wards, it said.

Amid concerns that speculative purchases by foreign buyers are driving up condominium prices, the government is considering countermeasures such as requiring buyers to provide their nationality.`,
    images: [],
  },
  {
    id: 'mainichi-used-100mil',
    title: 'Average price of used condominium in Tokyo tops 100 mil. yen for 1st time',
    date: '2026-01-22',
    source: 'The Mainichi',
    url: 'https://mainichi.jp/english/articles/20260122/p2g/00m/0na/042000c',
    body: `TOKYO (Kyodo) -- The average asking price for a 70-square-meter used condominium in Tokyo's 23 wards in 2025 surpassed 100 million yen ($630,000) for the first time since records began in 1997, a private research firm said Thursday.

The figure jumped 34.6 percent from a year earlier to 103.93 million yen, Tokyo Kantei Co. said, as soaring prices for newly built condominiums have prompted more sellers to list used units above market levels.

Masayuki Takahashi, a researcher at the company, however, said some listings are "viewed as overly aggressive and fail to sell, leading to a buildup of inventory," adding it remains difficult to predict whether the upward trend will continue in 2026.

Prices of new condominiums in central Tokyo have been rising as construction costs climb, due in part to the sharp depreciation of the Japanese yen, while low interest rates and foreign buyers keep supporting demand despite Japan's shrinking population.

In Japan's other major metropolitan areas, the average price of a used 70-square-meter condominium increased 9.0 percent to 31.24 million yen in the Kinki region, including Osaka, and 3.3 percent to 23.15 million yen in the Chubu region, where Nagoya is located.`,
    images: [],
  },
  {
    id: 'yomiuri-used-100mil',
    title: '東京の中古マンション平均価格、初の１億円超え…１年間で２７７２万円上昇',
    date: '2026-01-22',
    source: '読売新聞',
    url: 'https://topics.smt.docomo.ne.jp/article/yomiuri/business/20260122-567-GYT1T00395',
    body: `東京の中古マンション平均価格（70平方メートル換算）は2025年12月に1億247万円となり、2002年の集計開始以来初めて1億円を超えました。前年同月比で37.1％（2772万円）の上昇です。首都圏全体では29.4％上昇の6554万円、東京23区は37.1％上昇の1億1960万円となっています。新築マンションの高騰に連動し、中古も価格が急上昇しています。`,
    images: [],
  },
  {
    id: 'nomura-index-2025q4',
    title: '野村不動産ソリューションズ 住宅地価INDEX 2025年第4四半期',
    date: '2026-01-01',
    source: 'PR TIMES',
    url: 'https://prtimes.jp/main/html/rd/p/000000868.000025694.html',
    body: `野村不動産ソリューションズの住宅地価INDEX（2026年1月1日時点＝2025年第4四半期）では、首都圏は+2.3％（22四半期連続上昇）、関西圏は+1.8％（10四半期連続上昇）。特に大阪市内は+4.2％で2006年以来最大の上昇率を記録しています。値上がり地点が15四半期ぶりに70地点を超え、上昇エリアが拡大。東京都区部が+1.8％、神奈川・埼玉・千葉では上昇率が大幅に拡大し、都心の価格高騰を背景に周辺エリアへの需要が流入しています。`,
    images: [],
  },
  {
    id: 'homes-boj-075',
    title: '【2025年12月】日銀が0.75％へ利上げ決定！ 30年ぶりの金利水準で住宅ローン・物価・株価はどう変わる？',
    date: '2025-12-18',
    source: 'LIFULL HOME\'S 不動産投資',
    url: 'https://toushi.homes.co.jp/column/lifeplan/social-issues/money57/',
    body: `2025年12月18〜19日に開催された金融政策決定会合で、日銀は政策金利を0.25％引き上げることを決定。政策金利は0.50％から0.75％へ上昇し、12月22日から適用。政策金利が0.75％となるのは1995年以来約30年ぶりの高水準です。

マイナス金利解除から約2年で4回目の利上げ。利上げの理由として、米国経済・通商政策の不確実性低下、2026年も高水準の賃上げ見通し、物価高・円安の食い止めが挙げられています。

今回の利上げを受け、メガバンク3行は2026年2月から変動金利の指標となる短期プライムレートを1.875％から2.125％に引き上げると発表。変動型住宅ローンは契約者の約8割が利用しており、借入残高3,000万円・返済期間残り25年の場合、0.25％の金利上昇で月々約3,000〜4,000円の負担増となります。普通預金金利は0.21％から0.3％に引き上げられ、約33年ぶりの高水準。不動産価格には金利上昇による下落圧力が働く可能性があります。`,
    images: [],
  },
  {
    id: 'yahoo-housing-loan-dec',
    title: '住宅ローン固定金利　12月から引き上げ　大手5行そろって　変動は据え置き',
    date: '2025-12-01',
    source: 'テレビ朝日系（ANN）',
    url: 'https://news.yahoo.co.jp/articles/1efc28c1925487747149f2959565cc671536c9f0',
    body: `2025年12月1日適用で、大手銀行5行が住宅ローンの固定金利を引き上げました。三菱UFJ銀行は10年固定 年2.26％（+0.09％）、三井住友銀行は年2.35％（+0.15％）、みずほ銀行は年2.30％（+0.2％）、三井住友信託銀行は年2.655％（+0.26％）、りそな銀行は年2.665％（+0.18％）。変動金利は据え置きですが、三菱UFJは最優遇金利を0.675％に引き上げ。日銀の利上げ方針を反映した動きで、今後の住宅取得コストに影響します。`,
    images: [],
  },
  {
    id: 'tokyo-np-2025-report',
    title: '【全種別で過去最高値を更新】区分マンションは前年比15%超の上昇、底値から約2.8倍の水準へ',
    date: '2025-12-01',
    source: '東京新聞 × PR TIMES',
    url: 'https://adv.tokyo-np.co.jp/prtimes/article115170/',
    body: `2025年通年で、区分マンション全国平均価格は2,388万円（前年比+15.47％）となり、3種別の中で最も高い上昇率。2011年の底値846万円から約2.8倍の水準まで高騰。広島市では前年比+93.39％と特に急騰。名古屋市では利回りが全国平均を下回る水準まで低下。「収益物件 市場動向年間レポート」2025年版の要点です。`,
    images: [],
  },
  {
    id: 'nikkei-advance-osaka',
    title: 'Advance Residence to acquire apartment in Osaka',
    date: '2025-11-20',
    source: 'NIKKEI REAL ESTATE MARKET REPORT',
    url: 'https://nrm.nikkei.co.jp/articles/-/23945',
    body: `Advance Residence Investment Corporation acquires an 11-storey apartment building (RESIDIA Sakaisuji-Hommachi) in Osaka's Chuo ward. The deal reflects continued institutional investment in Osaka residential assets and supports local land and property values.`,
    images: [],
  },
  {
    id: 'prtimes-investment-mansion',
    title: '投資用区分マンション、前月比+10.5%の急騰。3種別すべてで直近12年の最高値を更新',
    date: '2025-11-01',
    source: '東京新聞 × PR TIMES',
    url: 'https://adv.tokyo-np.co.jp/prtimes/article97730/',
    body: `2025年11月期、投資用区分マンション価格が前月比+10.57％と二桁の急伸を記録。全国平均価格は2,679万円で、前年同月比でも+20.03％の高水準を維持。3種別すべて（区分マンション・一棟アパート・一棟マンション）で直近12年の最高値を更新。関西圏は前月比+12.31％、首都圏は前月比+9.10％・平均価格3,093万円で全地域で最高。東海は前月比-23.54％、北海道は前月比-10.32％と地域差が拡大しています。`,
    images: [],
  },
  {
    id: 'prtimes-gifu-accessible-group-home-202604',
    title: '【日本初】障がい者が「好みの部屋を選んで入居できる」グループホーム、岐阜市に開設',
    date: '2026-03-05',
    source: 'PR TIMES',
    url: 'https://prtimes.jp/main/html/rd/p/000000002.000178850.html',
    body: `優しい街と株式会社が、障がいのある人が自分の好みに合った部屋を選んで入居できるワンルームアパート型グループホーム「ゆいまちとひとり」1号棟を2026年4月、岐阜市に開設するというプレスリリース。

全国の障がい者数は約1,160万人、グループホーム利用者は過去15年で3.5倍に増加した一方、供給不足により約2万2,000人が入居待機という深刻な状況にある。調査では、障がい者の63％が「一人暮らしをしてみたい」と回答しているにもかかわらず、貸主の74.2％が障がい者の入居に難色を示し、約3割が入居を断られた経験を持つなど、「大家の壁」により住まいの選択肢が奪われている実態が示されている。

同社は、創業28年の不動産会社として培ったネットワークと物件調達力を活かし、建築基準法や用途地域の制限、管理会社・保証会社の運用など、これまで50件以上断られてきた障壁を一つずつクリアすることで物件を確保した。さらに代表自らがインテリアスタイリストとして各部屋の内装をデザインし、入居希望者が事前に複数のインテリアスタイルから好みの部屋を選べる仕組みを導入。「与えられた部屋」に入る従来型から、「選べる部屋」で暮らしをスタートできる次世代型グループホームを目指している。

ワンルーム完全個室でプライバシーを確保しつつ、夜間支援体制も整備。家賃自己負担は月額9,900円からと岐阜市でも最安値級の水準を実現しており、経済的理由で一人暮らしを諦めていた人にも届く価格帯を目指している。`,
    images: [],
  },
]

const minBodyLength = 200
const isPersonnelTitle = (t: string) =>
  (t?.trim().length ?? 0) <= 18 ||
  /(社長|会長|委員長|部長|取締役|CEO|COO)\s*に\s*.+氏|に.+氏\s*[-|–—]|人事\s*(異動|発表|任命|就任)/i.test(t?.trim() ?? '')

/** 筛选后的列表：近 3 个月 + 正文不少于 200 字 + 非人事任命标题。供详情页与最新资讯使用。 */
export function getFilteredJapanRealEstateNews(): JapanRealEstateNewsItem[] {
  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - 3)
  return japanRealEstateNews
    .filter((item) => new Date(item.date) >= cutoff)
    .filter((item) => (item.body?.trim().length ?? 0) >= minBodyLength && !isPersonnelTitle(item.title))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getJapanRealEstateNewsById(id: string): JapanRealEstateNewsItem | undefined {
  return japanRealEstateNews.find((item) => item.id === id)
}
