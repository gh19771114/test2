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
export const caseDates: Record<(typeof caseIds)[number], string> = {
  'grand-maison-asakusa-1302': '2025/08/25',
  'park-tower-nishishinjuku-101-201': '2025/09/25',
  'my-castle-yoyogi-1203': '2025/05/16',
  'abc-hall-management': '2025/10/23',
  'shibuya-luxury-apartment': '2024/03/15',
  'yokohama-waterfront-complex': '2024/06/20',
  'nagoya-student-apartment': '2024/09/10',
  'kingsoft-wps-japan': '2024/11/15',
  'shinjuku-daikan-plaza-a-201': '2025/10/23',
}

// 案例图片映射（本地图片优先，保证一致性与可控性）
export const caseImages: Record<(typeof caseIds)[number], string> = {
  'grand-maison-asakusa-1302': '/imgs/Grand Maison Asakusa Hanakawado.jpeg',
  'park-tower-nishishinjuku-101-201': '/imgs/Park Tower Nishishinjuku Facility.jpeg',
  'my-castle-yoyogi-1203': '/imgs/My Castle Yoyogi.jpeg',
  'abc-hall-management': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'shibuya-luxury-apartment': 'https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'yokohama-waterfront-complex': 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'nagoya-student-apartment': 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'kingsoft-wps-japan': '/imgs/WPS.jpeg',
  'shinjuku-daikan-plaza-a-201': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
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

