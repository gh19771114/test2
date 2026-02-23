import { chromium } from 'playwright'

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
  
  // 获取关键元素的位置
  const info = await page.evaluate(() => {
    const stage = document.querySelector('.company-ceo-message-stage-handheld-portrait')
    const textWrap = document.querySelector('.company-ceo-message-text-wrap')
    const signature = document.querySelector('.company-ceo-message-signature')
    const portraitWrap = document.querySelector('.company-ceo-message-portrait-wrap')
    const portrait = document.querySelector('.company-ceo-message-portrait')
    
    const getInfo = (el, name) => {
      if (!el) return { name, exists: false }
      const rect = el.getBoundingClientRect()
      const style = window.getComputedStyle(el)
      return {
        name,
        exists: true,
        rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), height: Math.round(rect.height) },
        position: style.position,
        bottom: style.bottom,
      }
    }
    
    return {
      stage: getInfo(stage, 'stage'),
      textWrap: getInfo(textWrap, 'textWrap'),
      signature: getInfo(signature, 'signature'),
      portraitWrap: getInfo(portraitWrap, 'portraitWrap'),
      portrait: getInfo(portrait, 'portrait'),
      documentHeight: document.body.scrollHeight,
    }
  })
  
  console.log('=== 布局调试 ===')
  console.log('文档高度:', info.documentHeight)
  console.log()
  
  for (const key of ['stage', 'textWrap', 'signature', 'portraitWrap', 'portrait']) {
    const el = info[key]
    if (!el.exists) {
      console.log(`${el.name}: 不存在`)
    } else {
      console.log(`${el.name}:`)
      console.log(`  rect: top=${el.rect.top}, bottom=${el.rect.bottom}, height=${el.rect.height}`)
      if (el.position) console.log(`  position: ${el.position}, bottom: ${el.bottom}`)
    }
  }
  
  await browser.close()
}

main().catch(console.error)
