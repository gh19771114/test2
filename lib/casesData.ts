// 统一的成功案例数据（供 /cases 页面与首页 Works 复用）

// 案例ID列表
export const caseIds = [
  // 买卖中介
  'grand-maison-asakusa-1302',
  'park-tower-nishishinjuku-101-201',
  'my-castle-yoyogi-1203',
  // 物业管理
  'abc-hall-management',
  'shibuya-luxury-apartment',
  'yokohama-waterfront-complex',
  'nagoya-student-apartment',
  // 企业出海助力
  'kingsoft-wps-japan',
  // 资产投资
  'shinjuku-daikan-plaza-a-201',
] as const

// 案例日期映射
export const caseDates: Record<string, string> = {
  'grand-maison-asakusa-1302': '2025/08/25',
  'park-tower-nishishinjuku-101-201': '2025/09/25',
  'my-castle-yoyogi-1203': '2025/05/16',
  'abc-hall-management': '2025/10/23',
  'shibuya-luxury-apartment': '2024/03/15',
  'yokohama-waterfront-complex': '2024/06/20',
  'nagoya-student-apartment': '2024/09/10',
  // 企业出海助力：成功案例卡片显示“2025年”
  'kingsoft-wps-japan': '2025/11/15',
  // 企业出海助力：苏州工业园卡片显示“2025年10月”
  'suzhou-industrial-park': '2025/10',
  'shinjuku-daikan-plaza-a-201': '2025/10/23',
}

// 案例图片映射（本地图片优先，保证一致性与可控性）
export const caseImages: Record<(typeof caseIds)[number], string> = {
  'grand-maison-asakusa-1302': '/imgs/Grand Maison Asakusa Hanakawado.jpeg',
  'park-tower-nishishinjuku-101-201': '/imgs/maimai/Park Tower Nishi-Shinjuku Facility Building.jpeg',
  'my-castle-yoyogi-1203': '/imgs/My Castle Yoyogi.jpeg',
  // 物业管理：用“管理房产”图片替换原 4 个管理委托案例（卡片与详情页保持一致）
  'abc-hall-management': '/imgs/managed-properties/mp-03.jpeg',
  'shibuya-luxury-apartment': '/imgs/managed-properties/mp-04.jpeg',
  'yokohama-waterfront-complex': '/imgs/managed-properties/mp-09.jpeg',
  'nagoya-student-apartment': '/imgs/managed-properties/mp-18.jpeg',
  'kingsoft-wps-japan': '/imgs/WPS.jpeg',
  'shinjuku-daikan-plaza-a-201': '/imgs/Shinjuku Daikan Plaza.jpeg',
}

// 案例分类组映射
export const caseCategoryGroups: Record<(typeof caseIds)[number], 'maimai' | 'wuye' | 'qichu' | 'touzi'> = {
  'grand-maison-asakusa-1302': 'maimai',
  'park-tower-nishishinjuku-101-201': 'maimai',
  'my-castle-yoyogi-1203': 'maimai',
  'abc-hall-management': 'wuye',
  'shibuya-luxury-apartment': 'wuye',
  'yokohama-waterfront-complex': 'wuye',
  'nagoya-student-apartment': 'wuye',
  'kingsoft-wps-japan': 'qichu',
  'shinjuku-daikan-plaza-a-201': 'touzi',
}

