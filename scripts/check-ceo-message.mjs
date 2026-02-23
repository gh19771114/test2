/**
 * 一次性脚本：手机竖屏打开董事长寄语页，点击 President Message，截图验证第三段最后4行 60% 宽 + 人物图布局
 * 运行：node scripts/check-ceo-message.mjs（需先 npm run dev 在 3000 端口）
 */
import { chromium } from 'playwright'

const base = 'http://localhost:3000'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 1,
  })
  await context.addInitScript(() => {
    const orig = window.matchMedia.bind(window)
    window.matchMedia = function (query) {
      const result = orig(query)
      if (query === '(pointer: coarse)') {
        return {
          matches: true,
          media: query,
          onchange: null,
          addEventListener: result.addEventListener.bind(result),
          removeEventListener: result.removeEventListener.bind(result),
          addListener: result.addListener ? result.addListener.bind(result) : () => {},
          removeListener: result.removeListener ? result.removeListener.bind(result) : () => {},
          dispatchEvent: result.dispatchEvent ? result.dispatchEvent.bind(result) : () => true,
        }
      }
      return result
    }
  })
  const page = await context.newPage()
  await page.goto(`${base}/company/ceo`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const messageTab = await page.locator('button:has-text("President Message"), button:has-text("董事长寄语"), button:has-text("代表メッセージ")').first()
  if (await messageTab.count()) {
    await messageTab.click()
    await page.waitForTimeout(1000)
  }
  await page.waitForSelector('.company-ceo-message-handheld-portrait, .company-ceo-message-wrap-after-float', { timeout: 8000 }).catch(() => {})
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'ceo-message-check.png', fullPage: true })
  await browser.close()
  console.log('Screenshot saved: ceo-message-check.png')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
