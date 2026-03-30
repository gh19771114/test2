/**
 * 将 public/imgs/logo-icon.png 合成为 1200×630 Open Graph 横版分享图
 * 运行：pnpm exec node scripts/build-og-share.mjs（在 version2 目录下）
 */
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')
const logoPath = path.join(root, 'public/imgs/logo-icon.png')
const outPath = path.join(root, 'public/imgs/og-share.png')

const W = 1200
const H = 630
// 与站点页首/导航相近的深蓝
const TOP = { r: 15, g: 23, b: 42, alpha: 1 }
const BOTTOM = { r: 30, g: 58, b: 95, alpha: 1 }

async function main() {
  const topStrip = await sharp({
    create: { width: W, height: Math.floor(H / 2), channels: 4, background: TOP },
  })
    .png()
    .toBuffer()

  const logoBuf = await sharp(logoPath)
    .resize({
      height: 420,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .png()
    .toBuffer()

  const meta = await sharp(logoBuf).metadata()
  const lw = meta.width ?? 400
  const lh = meta.height ?? 400
  const left = Math.round((W - lw) / 2)
  const top = Math.round((H - lh) / 2)

  await sharp({
    create: { width: W, height: H, channels: 4, background: BOTTOM },
  })
    .composite([
      { input: topStrip, top: 0, left: 0 },
      { input: logoBuf, left, top },
    ])
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  console.log('Wrote', outPath, `${W}×${H}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
