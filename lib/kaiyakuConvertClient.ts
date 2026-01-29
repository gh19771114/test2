// Shared helpers for kaiyaku client pages:
// - keep UI data in internal codes (language-independent)
// - convert to Japanese payload when submitting to /api/kaiyaku (PDF is always Japanese)

export type KaiyakuInternalForm = {
  propertyName: string
  roomNumber: string
  propertyAddress: string
  contractHolder: string

  cancelDate: string
  moveOutDate: string
  inspectionDateTime: string

  bicycleParking: 'yes' | 'no'

  mailbox1Direction: 'left' | 'right'
  mailbox1Turns: string
  mailbox1Number: string
  mailbox2Direction: 'left' | 'right'
  mailbox2Turns: string
  mailbox2Number: string

  carParking: 'yes' | 'no'

  autoLock: 'yes' | 'no'
  autoLockKeyType: '' | 'keyType' | 'dial'
  autoLockDial: string

  bikeSpace: 'yes' | 'no'

  deliveryBox: 'yes' | 'no'
  deliveryBoxType: '' | 'keyType' | 'cardType'
  deliveryBoxNumber: string

  bankName: string
  bankBranch: string
  accountType: string
  accountNumber: string
  accountHolder: string

  reason:
    | ''
    | 'education'
    | 'employment'
    | 'transfer'
    | 'homePurchase'
    | 'returnHome'
    | 'rentAmount'
    | 'contractExpired'
    | 'other'
  reasonOtherText: string

  newAddress: string
  newBuildingAndRoom: string

  phoneCountryCode: string
  phoneNumber: string

  email: string
  signatureDataUrl: string

  signerName: string
}

export function looksLikeJapaneseKaiyakuData(data: any): boolean {
  const v = data || {}
  if (v.bicycleParking === '有' || v.bicycleParking === '無') return true
  if (v.mailbox1Direction === '左' || v.mailbox1Direction === '右') return true
  if (typeof v.reason === 'string' && ['進学', '就職', '転勤', '自宅購入', '帰国', '家賃金額', '契約期間満了', 'その他'].includes(v.reason)) return true
  return false
}

export function convertFromJapaneseToInternal(data: any): KaiyakuInternalForm {
  const reverseMap: Record<string, Record<string, string>> = {
    bicycleParking: { 有: 'yes', 無: 'no' },
    carParking: { 有: 'yes', 無: 'no' },
    autoLock: { 有: 'yes', 無: 'no' },
    bikeSpace: { 有: 'yes', 無: 'no' },
    deliveryBox: { 有: 'yes', 無: 'no' },
    mailbox1Direction: { 左: 'left', 右: 'right' },
    mailbox2Direction: { 左: 'left', 右: 'right' },
    autoLockKeyType: { 鍵式: 'keyType', ダイヤル: 'dial' },
    deliveryBoxType: { 鍵式: 'keyType', カード式: 'cardType' },
    reason: {
      進学: 'education',
      就職: 'employment',
      転勤: 'transfer',
      自宅購入: 'homePurchase',
      帰国: 'returnHome',
      家賃金額: 'rentAmount',
      契約期間満了: 'contractExpired',
      その他: 'other',
    },
  }

  const converted: any = { ...data }
  for (const k of Object.keys(reverseMap)) {
    const map = reverseMap[k]
    const raw = converted[k]
    if (raw && map[raw]) converted[k] = map[raw]
  }

  if (typeof converted.email !== 'string') converted.email = ''
  if (typeof converted.signatureDataUrl !== 'string') converted.signatureDataUrl = ''
  if (typeof converted.signerName !== 'string') converted.signerName = ''
  if (typeof converted.phoneCountryCode !== 'string') converted.phoneCountryCode = '+81'
  if (typeof converted.phoneNumber !== 'string') converted.phoneNumber = ''
  if (typeof converted.reasonOtherText !== 'string') converted.reasonOtherText = ''
  return converted as KaiyakuInternalForm
}

export function convertToJapanesePayload(data: KaiyakuInternalForm) {
  const japaneseMap: Record<string, Record<string, string>> = {
    bicycleParking: { yes: '有', no: '無' },
    carParking: { yes: '有', no: '無' },
    autoLock: { yes: '有', no: '無' },
    bikeSpace: { yes: '有', no: '無' },
    deliveryBox: { yes: '有', no: '無' },
    mailbox1Direction: { left: '左', right: '右' },
    mailbox2Direction: { left: '左', right: '右' },
    autoLockKeyType: { keyType: '鍵式', dial: 'ダイヤル' },
    deliveryBoxType: { keyType: '鍵式', cardType: 'カード式' },
    reason: {
      education: '進学',
      employment: '就職',
      transfer: '転勤',
      homePurchase: '自宅購入',
      returnHome: '帰国',
      rentAmount: '家賃金額',
      contractExpired: '契約期間満了',
      other: 'その他',
    },
  }

  const converted: any = { ...data }
  for (const k of Object.keys(japaneseMap)) {
    const map = japaneseMap[k]
    const raw = converted[k]
    if (raw && map[raw]) converted[k] = map[raw]
  }

  // signerName defaults to contract holder
  converted.signerName = (data.signerName || data.contractHolder || '').trim()
  return converted
}

export function reasonKeyForI18n(internalReason: KaiyakuInternalForm['reason']): string | null {
  const map: Record<string, string> = {
    education: '進学',
    employment: '就職',
    transfer: '転勤',
    homePurchase: '自宅購入',
    returnHome: '帰国',
    rentAmount: '家賃金額',
    contractExpired: '契約期間満了',
    other: 'その他',
  }
  return map[internalReason] || null
}

