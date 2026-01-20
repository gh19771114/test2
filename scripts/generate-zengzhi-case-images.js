#!/usr/bin/env node
/**
 * 批量生成 资产增值页“涨租案例”8 张卡片背景图（通过 nano banana pro 接口）
 *
 * - 读取 scripts/zengzhi-case-images.manifest.json
 * - 生成后统一裁切为 1200x800 webp（与 manifest 的 size 一致）
 *
 * 用法：
 *   node version2/scripts/generate-zengzhi-case-images.js --dotenv
 *   node version2/scripts/generate-zengzhi-case-images.js --dotenv --limit 2
 */

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

function parseArgs(argv) {
  const out = { limit: null, dotenv: false, match: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dotenv') out.dotenv = true
    if (a === '--match') {
      out.match = String(argv[i + 1] || '').trim() || null
      i++
    }
    if (a === '--limit') {
      const n = Number(argv[i + 1])
      if (Number.isFinite(n) && n > 0) out.limit = Math.floor(n)
      i++
    }
  }
  return out
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function loadEnvFile(p) {
  const txt = fs.readFileSync(p, 'utf8')
  for (const line of txt.split(/\r?\n/)) {
    if (!line || /^\s*#/.test(line)) continue
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    if (process.env[m[1]] == null) process.env[m[1]] = v
  }
}

function pick(obj, keys, fallback = undefined) {
  for (const k of keys) {
    if (obj && obj[k] != null && obj[k] !== '') return obj[k]
  }
  return fallback
}

function buildEndpoint({ model }) {
  const normalizedModel = String(model || '').startsWith('models/')
    ? String(model || '').slice('models/'.length)
    : String(model || '')
  const base =
    process.env.NANO_BANANA_ENDPOINT ||
    process.env.GOOGLE_GENAI_ENDPOINT ||
    'https://generativelanguage.googleapis.com/v1beta/models'
  if (base.includes(':generateContent')) return base
  return `${base}/${normalizedModel}:generateContent`
}

function buildRequestBody({ prompt }) {
  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  }

  const modalitiesRaw = process.env.NANO_BANANA_RESPONSE_MODALITIES
  if (modalitiesRaw) {
    try {
      const parsed = JSON.parse(modalitiesRaw)
      body.generationConfig = body.generationConfig || {}
      body.generationConfig.responseModalities = parsed
    } catch {
      // ignore
    }
  }

  const genCfgRaw = process.env.NANO_BANANA_GENERATION_CONFIG_JSON
  if (genCfgRaw) {
    try {
      const cfg = JSON.parse(genCfgRaw)
      body.generationConfig = { ...(body.generationConfig || {}), ...cfg }
    } catch {
      // ignore
    }
  }

  return body
}

function extractFirstImagePart(json) {
  const candidates = json?.candidates
  if (!Array.isArray(candidates)) return null
  for (const c of candidates) {
    const parts = c?.content?.parts
    if (!Array.isArray(parts)) continue
    for (const p of parts) {
      const inline = p?.inlineData
      if (inline?.data && inline?.mimeType && String(inline.mimeType).startsWith('image/')) {
        return { mimeType: inline.mimeType, data: inline.data }
      }
      const inline2 = p?.inline_data
      if (inline2?.data && inline2?.mime_type && String(inline2.mime_type).startsWith('image/')) {
        return { mimeType: inline2.mime_type, data: inline2.data }
      }
    }
  }
  return null
}

async function callApi({ endpoint, apiKey, body }) {
  const headers = { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey }
  const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(`API 返回非 JSON：${text.slice(0, 300)}`)
  }
  if (!res.ok) {
    const msg = json?.error?.message || text.slice(0, 300)
    throw new Error(`API 请求失败 ${res.status}: ${msg}`)
  }
  return json
}

async function writeWebp({ outFile, buffer }) {
  ensureDir(path.dirname(outFile))
  await sharp(buffer).resize(1200, 800, { fit: 'cover', position: 'entropy' }).webp({ quality: 84 }).toFile(outFile)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (args.dotenv) {
    const envPath = path.join(__dirname, '..', '.env.local')
    if (fs.existsSync(envPath)) loadEnvFile(envPath)
  }

  const apiKey = pick(process.env, ['NANO_BANANA_API_KEY', 'GOOGLE_API_KEY'])
  if (!apiKey) {
    console.error('缺少 API Key：请设置环境变量 NANO_BANANA_API_KEY（不要写进代码库）')
    process.exit(1)
  }

  const model = pick(process.env, ['NANO_BANANA_MODEL', 'GOOGLE_MODEL'], 'gemini-3-pro-image-preview')
  const endpoint = buildEndpoint({ model })

  const manifestPath = path.join(__dirname, 'zengzhi-case-images.manifest.json')
  if (!fs.existsSync(manifestPath)) {
    console.error(`找不到 manifest：${manifestPath}`)
    process.exit(1)
  }

  const manifest = readJson(manifestPath)
  if (!Array.isArray(manifest) || manifest.length === 0) {
    console.error('manifest 为空或格式不正确')
    process.exit(1)
  }

  const filtered = args.match
    ? manifest.filter((it) => `${it?.id || ''} ${it?.publicPath || ''} ${it?.outFile || ''}`.includes(args.match))
    : manifest
  const items = args.limit ? filtered.slice(0, args.limit) : filtered

  const concurrency = Number(process.env.NANO_BANANA_CONCURRENCY || '2')
  const maxRetries = Number(process.env.NANO_BANANA_MAX_RETRIES || '2')

  console.log(`模型: ${model}`)
  console.log(`endpoint: ${endpoint}`)
  console.log(
    `任务数: ${items.length}${args.match ? ` (match=${args.match})` : ''}${args.limit ? ` (limit=${args.limit})` : ''}, concurrency=${concurrency}`
  )

  let idx = 0
  let done = 0
  let failed = 0

  async function worker(workerId) {
    while (true) {
      const i = idx++
      if (i >= items.length) return
      const item = items[i]
      const outFile = item.outFile

      if (fs.existsSync(outFile) && fs.statSync(outFile).size > 30_000) {
        done++
        continue
      }

      const body = buildRequestBody({ prompt: item.prompt })
      let attempt = 0
      let ok = false
      while (attempt <= maxRetries && !ok) {
        attempt++
        try {
          const json = await callApi({ endpoint, apiKey, body })
          const img = extractFirstImagePart(json)
          if (!img) {
            throw new Error(`未在响应中找到图片（inlineData）。响应片段：${JSON.stringify(json).slice(0, 300)}`)
          }
          const buf = Buffer.from(img.data, 'base64')
          await writeWebp({ outFile, buffer: buf })
          ok = true
        } catch (e) {
          const msg = e?.message || String(e)
          if (attempt <= maxRetries) {
            console.warn(`[worker ${workerId}] 失败(${attempt}/${maxRetries}) ${path.basename(outFile)}: ${msg}`)
            await sleep(900 * attempt)
          } else {
            console.error(`[worker ${workerId}] 失败(最终) ${path.basename(outFile)}: ${msg}`)
          }
        }
      }

      if (ok) done++
      else failed++
      await sleep(150)
    }
  }

  const workers = Array.from({ length: Math.max(1, concurrency) }, (_, w) => worker(w + 1))
  await Promise.all(workers)

  console.log(`完成：done=${done}, failed=${failed}`)
  if (failed > 0) process.exit(2)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

