import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'

async function testWithBottom(bottomValue) {
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
  
  // 修改 bottom 值并获取位置
  const info = await page.evaluate((bottomVal) => {
    const wrap = document.querySelector('.company-ceo-message-portrait-wrap')
    if (!wrap) return null
    
    // 强制设置 bottom 值
    wrap.style.bottom = bottomVal
    
    // 等一下让浏览器重新计算
    wrap.offsetHeight // 触发 reflow
    
    const style = window.getComputedStyle(wrap)
    const rect = wrap.getBoundingClientRect()
    return {
      bottom: style.bottom,
      rectTop: rect.top,
      rectBottom: rect.bottom,
    }
  }, bottomValue)
  
  await page.screenshot({ path: `compare-bottom-${bottomValue.replace(/[^a-z0-9]/g, '')}.png`, fullPage: true })
  await browser.close()
  
  return info
}

async function main() {
  console.log('=== 对比测试：人物图位置 ===\n')
  
  // 测试 bottom: 0
  console.log('测试 bottom: 0')
  const info0 = await testWithBottom('0')
  if (info0) {
    console.log('  computed bottom:', info0.bottom)
    console.log('  rect.top:', info0.rectTop)
    console.log('  rect.bottom:', info0.rectBottom)
  }
  console.log('  截图: compare-bottom-0.png')
  
  console.log('')
  
  // 测试 bottom: 50rem
  console.log('测试 bottom: 50rem')
  const info50 = await testWithBottom('50rem')
  if (info50) {
    console.log('  computed bottom:', info50.bottom)
    console.log('  rect.top:', info50.rectTop)
    console.log('  rect.bottom:', info50.rectBottom)
  }
  console.log('  截图: compare-bottom-50rem.png')
  
  console.log('')
  
  if (info0 && info50) {
    const diff = info0.rectTop - info50.rectTop
    console.log(`=== 结论 ===`)
    console.log(`人物图向上移动了 ${Math.round(diff)}px`)
  }
}

main().catch(console.error)
