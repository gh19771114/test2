import { chromium } from 'playwright'

async function testBottomValue(bottomValue) {
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
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => true,
        }
      }
      return result
    }
  })
  
  const page = await context.newPage()
  await page.goto('http://localhost:3000/company/ceo', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  
  // 点击寄语 tab
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('button')
    for (const tab of tabs) {
      const text = tab.textContent || ''
      if (text.includes('寄语') || text.includes('Message') || text.includes('メッセージ')) {
        tab.click()
        return
      }
    }
  })
  await page.waitForTimeout(2000)
  
  // 获取人物图的位置
  const info = await page.evaluate(() => {
    const wrap = document.querySelector('.company-ceo-message-portrait-wrap')
    if (!wrap) return null
    const style = window.getComputedStyle(wrap)
    const rect = wrap.getBoundingClientRect()
    return {
      bottom: style.bottom,
      rectTop: rect.top,
      rectBottom: rect.bottom,
    }
  })
  
  await page.screenshot({ path: `test-bottom-${bottomValue}.png`, fullPage: true })
  await browser.close()
  
  return info
}

async function main() {
  console.log('测试当前设置 (50rem):')
  const info = await testBottomValue('current')
  if (info) {
    console.log('  computed bottom:', info.bottom)
    console.log('  rect.top:', info.rectTop)
    console.log('  rect.bottom:', info.rectBottom)
  } else {
    console.log('  人物图元素未找到')
  }
  console.log('\n截图已保存: test-bottom-current.png')
}

main().catch(console.error)
