import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 844, height: 390 },
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
  await page.waitForTimeout(5000)
  
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
  await page.waitForTimeout(3000)
  
  // 检查实际渲染的 HTML
  const info = await page.evaluate(() => {
    const portrait = document.querySelector('.company-ceo-message-portrait')
    const stage = document.querySelector('.company-ceo-message-stage')
    
    // 检查是否有 flex 布局（手机横版特征）
    const flexContainer = document.querySelector('.company-ceo-message-text .flex.items-start')
    
    // 检查是否有 float-right（桌面版特征）
    const floatRight = document.querySelector('.company-ceo-message-float')
    
    return {
      portraitStyle: portrait ? portrait.getAttribute('style') : null,
      portraitWidth: portrait ? window.getComputedStyle(portrait).width : null,
      stageClass: stage ? stage.className : null,
      hasFlexLayout: !!flexContainer,
      hasFloatLayout: !!floatRight,
    }
  })
  
  console.log('=== 布局检查 ===')
  console.log('portraitStyle:', info.portraitStyle)
  console.log('portraitWidth:', info.portraitWidth)
  console.log('stageClass:', info.stageClass)
  console.log('hasFlexLayout (手机横版):', info.hasFlexLayout)
  console.log('hasFloatLayout (桌面版):', info.hasFloatLayout)
  
  await page.screenshot({ path: 'landscape-check.png', fullPage: true })
  console.log('\n截图已保存: landscape-check.png')
  
  await browser.close()
}

main().catch(console.error)
