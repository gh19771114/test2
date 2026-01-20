/**
 * Prepare Company History milestone images.
 *
 * Usage:
 *   node scripts/prepare_history_images.mjs --in ./tmp/history --out ./public/imgs/company/history
 *
 * Expected input filenames (any of png/jpg/jpeg/webp):
 *   milestone-01.png ... milestone-11.png
 *
 * Output:
 *   milestone-01.webp ... milestone-11.webp (1600x900, cover)
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

function parseArgs(argv) {
  const out = { inDir: null, outDir: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--in') out.inDir = argv[++i]
    if (a === '--out') out.outDir = argv[++i]
  }
  if (!out.inDir || !out.outDir) {
    throw new Error('Missing args. Example: node scripts/prepare_history_images.mjs --in ./tmp/history --out ./public/imgs/company/history')
  }
  return out
}

async function fileExists(p) {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

async function main() {
  const { inDir, outDir } = parseArgs(process.argv.slice(2))
  const absIn = path.resolve(process.cwd(), inDir)
  const absOut = path.resolve(process.cwd(), outDir)
  await fs.mkdir(absOut, { recursive: true })

  const exts = ['.png', '.jpg', '.jpeg', '.webp']

  for (let i = 1; i <= 11; i++) {
    const id = String(i).padStart(2, '0')
    let inputPath = null
    for (const ext of exts) {
      const p = path.join(absIn, `milestone-${id}${ext}`)
      if (await fileExists(p)) {
        inputPath = p
        break
      }
    }
    if (!inputPath) {
      console.warn(`[skip] milestone-${id}: input not found in ${absIn}`)
      continue
    }

    const outPath = path.join(absOut, `milestone-${id}.webp`)
    await sharp(inputPath)
      .resize(1600, 900, { fit: 'cover', position: 'entropy' })
      .webp({ quality: 82 })
      .toFile(outPath)

    console.log(`[ok] ${path.basename(outPath)}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

