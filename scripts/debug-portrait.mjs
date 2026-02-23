import { chromium } from 'playwright'

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  })

  // 更完整的 matchMedia mock
  await context.addInitScript(() => {
    const originalMatchMedia = window.matchMedia.bind(window)
    window.matchMedia = function (query) {
      const result = originalMatchMedia(query)
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
  await page.goto('http://localhost:3000/company/ceo', { waitUntil: 'networkidle' })
  
  // 多等几秒让 React hydration 完成
  await page.waitForTimeout(5000)

  // 检查 matchMedia 和 React 状态
  const info = await page.evaluate(() => {
    // 测试 matchMedia
    const pointerCoarse = window.matchMedia('(pointer: coarse)')
    const orientation = window.matchMedia('(orientation: portrait)')
    
    // 检查所有 section 元素
    const sections = document.querySelectorAll('section')
    const sectionInfo = Array.from(sections).map((s, i) => ({ index: i, class: s.className }))
    
    // 检查是否有 company-ceo-message 相关元素
    const messageSection = document.querySelector('.company-ceo-message-section')
    const handheldPortrait = document.querySelector('.company-ceo-message-handheld-portrait')
    const portraitWrap = document.querySelector('.company-ceo-message-portrait-wrap')
    
    // 检查 message tab
    const messageTab = document.querySelector('[class*="message"]')
    
    return {
      pointerCoarse: pointerCoarse.matches,
      orientation: orientation.matches,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      shortSide: Math.min(window.innerWidth, window.innerHeight),
      sectionCount: sections.length,
      sectionInfo,
      messageSection: messageSection ? messageSection.className : null,
      handheldPortrait: handheldPortrait ? handheldPortrait.className : null,
      portraitWrap: portraitWrap ? portraitWrap.className : null,
      hasMessageTab: !!messageTab,
    }
  })

  console.log('=== 媒体查询状态 ===')
  console.log('pointer: coarse:', info.pointerCoarse)
  console.log('orientation: portrait:', info.orientation)
  console.log('viewport:', info.viewportWidth, 'x', info.viewportHeight)
  console.log('shortSide:', info.shortSide)
  console.log()
  console.log('=== Section 元素 ===')
  console.log('总数:', info.sectionCount)
  info.sectionInfo.forEach(s => console.log(`  [${s.index}] ${s.class}`))
  console.log()
  console.log('=== CEO Message 相关元素 ===')
  console.log('messageSection:', info.messageSection)
  console.log('handheldPortrait:', info.handheldPortrait)
  console.log('portraitWrap:', info.portraitWrap)

  // 需要点击"寄语"tab才能看到寄语内容
  console.log('\n=== 点击寄语 Tab ===')
  
  // 找到并点击寄语tab
  const tabClicked = await page.evaluate(() => {
    const tabs = document.querySelectorAll('button')
    for (const tab of tabs) {
      const text = tab.textContent || ''
      if (text.includes('寄语') || text.includes('Message') || text.includes('メッセージ')) {
        tab.click()
        return true
      }
    }
    return false
  })
  console.log('Tab 点击成功:', tabClicked)
  
  await page.waitForTimeout(2000)
  
  // 再次检查
  const info2 = await page.evaluate(() => {
    const messageSection = document.querySelector('.company-ceo-message-section')
    const handheldPortrait = document.querySelector('.company-ceo-message-handheld-portrait')
    const portraitWrap = document.querySelector('.company-ceo-message-portrait-wrap')
    const portraitDiv = document.querySelector('.company-ceo-message-portrait')
    
    // 获取 portrait wrap 的计算样式
    let wrapStyle = null
    if (portraitWrap) {
      const cs = window.getComputedStyle(portraitWrap)
      const rect = portraitWrap.getBoundingClientRect()
      wrapStyle = {
        position: cs.position,
        bottom: cs.bottom,
        right: cs.right,
        top: cs.top,
        rect: { top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height }
      }
    }
    
    return {
      messageSection: messageSection ? messageSection.className : null,
      handheldPortrait: handheldPortrait ? handheldPortrait.className : null,
      portraitWrap: portraitWrap ? portraitWrap.className : null,
      portraitDiv: portraitDiv ? portraitDiv.className : null,
      wrapStyle,
    }
  })
  
  console.log('\n=== 点击后 CEO Message 相关元素 ===')
  console.log('messageSection:', info2.messageSection)
  console.log('handheldPortrait:', info2.handheldPortrait)
  console.log('portraitWrap:', info2.portraitWrap)
  console.log('portraitDiv:', info2.portraitDiv)
  if (info2.wrapStyle) {
    console.log('\n=== Portrait Wrap 样式 ===')
    console.log('position:', info2.wrapStyle.position)
    console.log('bottom:', info2.wrapStyle.bottom)
    console.log('right:', info2.wrapStyle.right)
    console.log('top:', info2.wrapStyle.top)
    console.log('rect:', info2.wrapStyle.rect)
  }

  // 截图全页
  await page.screenshot({ path: 'debug-portrait-full.png', fullPage: true })
  console.log('\n截图已保存: debug-portrait-full.png')

  await browser.close()
}

main().catch(console.error)
