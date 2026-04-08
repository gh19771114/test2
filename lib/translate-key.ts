import zhTranslations from '@/locales/zh.json'

export function resolveFrom(source: Record<string, unknown>, fullKey: string) {
  const keys = fullKey.split('.')
  let value: unknown = source
  for (const k of keys) {
    if (value && typeof value === 'object' && k in (value as object)) {
      value = (value as Record<string, unknown>)[k]
    } else {
      return { found: false as const, value: undefined, usedKey: fullKey }
    }
  }
  return { found: true as const, value, usedKey: fullKey }
}

/**
 * 与 LanguageProvider 内 translate 逻辑一致（含 zh 回退、kaiyaku 键别名），无 React 状态。
 */
export function translateKey(
  source: Record<string, unknown>,
  key: string,
  options?: { returnObjects?: boolean; [key: string]: unknown }
): unknown {
  let resolved = resolveFrom(source, key)
  if (!resolved.found && key.startsWith('tenant.kaiyaku.')) {
    resolved = resolveFrom(source, key.replace(/^tenant\.kaiyaku\./, 'tenant.services.kaiyaku.'))
  }
  if (!resolved.found) {
    const fb = resolveFrom(zhTranslations as unknown as Record<string, unknown>, key)
    if (!fb.found && key.startsWith('tenant.kaiyaku.')) {
      const fb2 = resolveFrom(
        zhTranslations as unknown as Record<string, unknown>,
        key.replace(/^tenant\.kaiyaku\./, 'tenant.services.kaiyaku.')
      )
      if (fb2.found) resolved = fb2
    } else if (fb.found) resolved = fb
  }
  const value = resolved.found ? resolved.value : undefined
  if (options?.returnObjects && (Array.isArray(value) || typeof value === 'object')) return value
  let result = typeof value === 'string' ? value : key
  if (options && typeof result === 'string') {
    Object.keys(options).forEach((optKey) => {
      if (optKey !== 'returnObjects' && options[optKey] !== undefined) {
        result = result.replace(new RegExp(`\\{${optKey}\\}`, 'g'), String(options[optKey]))
      }
    })
  }
  return result
}
