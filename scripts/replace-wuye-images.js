#!/usr/bin/env node
/**
 * 将 wuye 页面里引用的 /imgs/wuye/*.svg 替换为 /imgs/wuye/real/*.jpg
 * 读取 scripts/wuye-real-images.manifest.json 作为映射源。
 *
 * 用法：
 *   node version2/scripts/replace-wuye-images.js --dry-run
 *   node version2/scripts/replace-wuye-images.js --apply
 */

const fs = require('fs')
const path = require('path')

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

function walk(dir) {
  const out = []
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name)
    const st = fs.statSync(p)
    if (st.isDirectory()) out.push(...walk(p))
    else out.push(p)
  }
  return out
}

function main() {
  const args = new Set(process.argv.slice(2))
  const dryRun = args.has('--dry-run') || !args.has('--apply')

  const manifestPath = path.join(__dirname, 'wuye-real-images.manifest.json')
  if (!fs.existsSync(manifestPath)) {
    console.error(`找不到 manifest：${manifestPath}`)
    process.exit(1)
  }
  const manifest = readJson(manifestPath)

  const mappings = manifest
    .filter((x) => x?.sourceSvg && x?.publicPath)
    .map((x) => [x.sourceSvg, x.publicPath])

  const wuyeDir = path.join(__dirname, '..', 'app', 'wuye')
  const files = walk(wuyeDir).filter((p) => p.endsWith('.tsx'))

  let changedFiles = 0
  let totalRepl = 0

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8')
    let replaced = 0
    for (const [from, to] of mappings) {
      if (content.includes(from)) {
        const count = content.split(from).length - 1
        content = content.split(from).join(to)
        replaced += count
      }
    }
    if (replaced > 0) {
      changedFiles++
      totalRepl += replaced
      if (!dryRun) fs.writeFileSync(file, content, 'utf8')
      console.log(`${dryRun ? '[dry-run] ' : ''}${path.relative(path.join(__dirname, '..'), file)}: ${replaced} replacements`)
    }
  }

  console.log(`done. changedFiles=${changedFiles}, totalRepl=${totalRepl}, mode=${dryRun ? 'dry-run' : 'apply'}`)
}

main()

