# Tailwind响应式类使用指南

## 已添加的自定义断点

在 `tailwind.config.js` 中已添加以下自定义断点：

```javascript
screens: {
  // 移动设备（手机竖版）
  'mobile': {'max': '767px'},
  // 平板设备（iPad竖版、手机横版）
  'tablet': {'min': '768px', 'max': '1023px'},
  // 平板横版/小桌面（iPad横版、iPad Pro竖版）
  'tablet-lg': {'min': '1024px', 'max': '1279px'},
  // 桌面版
  'desktop': {'min': '1280px'},
  // iPad竖版（包含iPad Pro 11"）
  'ipad-portrait': {'min': '768px', 'max': '1023px', 'raw': '(orientation: portrait)'},
  // iPad横版
  'ipad-landscape': {'min': '768px', 'max': '1023px', 'raw': '(orientation: landscape)'},
  // iPad Pro竖版（1024px-1279px竖屏）- 解决iPad Pro 12.9"竖版问题
  'ipad-pro-portrait': {'min': '1024px', 'max': '1279px', 'raw': '(orientation: portrait)'},
  // iPad Pro横版/小桌面
  'ipad-pro-landscape': {'min': '1024px', 'max': '1279px', 'raw': '(orientation: landscape)'},
}
```

## 使用方式

### 基础用法

```tsx
// 移动优先策略 - 基础样式是移动端，然后逐步添加更大屏幕的样式
<div className="
  w-full p-4                    // 移动端：全宽，padding 16px
  tablet:p-6                    // 平板：padding 24px
  tablet-lg:p-8                 // 小桌面/iPad Pro：padding 32px
  desktop:p-10                  // 桌面：padding 40px
">
  内容
</div>
```

### 高度和宽度示例

```tsx
<section className="
  h-[600px]                     // 移动端高度
  tablet:h-[812px]              // 平板高度
  tablet-lg:h-[1000px]          // iPad Pro竖版高度
  desktop:h-[1000px]            // 桌面高度
  min-h-[600px]                 // 移动端最小高度
  tablet:min-h-[812px]          // 平板最小高度
  tablet-lg:min-h-[1000px]      // iPad Pro最小高度
  desktop:min-h-[1000px]        // 桌面最小高度
">
  内容
</section>
```

### Padding示例

```tsx
<section className="
  pt-0 pb-2                     // 移动端：padding-top 0, padding-bottom 8px
  tablet:pt-0 tablet:pb-2       // 平板：同上
  tablet-lg:pt-0 tablet-lg:pb-2 // iPad Pro：同上
  desktop:pt-0 desktop:pb-2     // 桌面：同上
">
  内容
</section>
```

### 显示/隐藏示例

```tsx
{/* 仅在移动端显示 */}
<div className="mobile:block hidden">
  移动端内容
</div>

{/* 仅在平板显示 */}
<div className="hidden tablet:block desktop:hidden">
  平板内容
</div>

{/* 仅在桌面显示 */}
<div className="hidden desktop:block">
  桌面内容
</div>
```

### 针对合作伙伴网络部分的改进建议

由于合作伙伴网络部分使用了复杂的绝对定位和transform，完全用Tailwind类替换不太现实。但可以部分改进：

#### 当前实现（使用内联样式）

```tsx
<section
  className="section-padding partners-section desktop-partners-network"
  style={{
    paddingTop: isDesktop ? '0' : (showIpadPortrait ? '0' : '43px'),
    paddingBottom: isDesktop ? '8px' : '7px',
    minHeight: isDesktop ? '1000px' : (showIpadPortrait ? '7200px' : (showMobilePortrait ? '600px' : '812px')),
    height: isDesktop ? '1000px' : (showIpadPortrait ? '7200px' : (showMobilePortrait ? '600px' : '812px')),
  }}
>
```

#### 改进方案（使用Tailwind类 + 少量内联样式）

```tsx
<section
  className="
    section-padding partners-section desktop-partners-network
    relative z-10 w-full overflow-hidden border-[3px] border-green-500 box-border
    pt-0 pb-2
    h-[600px] min-h-[600px]
    tablet:h-[812px] tablet:min-h-[812px]
    tablet-lg:h-[1000px] tablet-lg:min-h-[1000px]
    ipad-pro-portrait:h-[7200px] ipad-pro-portrait:min-h-[7200px]
    desktop:h-[1000px] desktop:min-h-[1000px]
  "
>
```

**注意**: 由于iPad竖版需要特殊的高度（7200px），这个值太大，可能不适合用Tailwind类，可以保留为内联样式或使用CSS变量。

### 简化版本（推荐）

对于合作伙伴网络部分，建议保留必要的内联样式，但使用Tailwind类处理简单的属性：

```tsx
<section
  className="
    section-padding partners-section desktop-partners-network
    relative z-10 w-full overflow-hidden
    border-[3px] border-green-500 box-border
    pt-0 pb-2
  "
  style={{
    // 只保留复杂的高度计算
    minHeight: isDesktop ? '1000px' : (showIpadPortrait ? '7200px' : (showMobilePortrait ? '600px' : '812px')),
    height: isDesktop ? '1000px' : (showIpadPortrait ? '7200px' : (showMobilePortrait ? '600px' : '812px')),
  }}
>
```

## 注意事项

1. **移动优先策略**: Tailwind使用移动优先策略，基础类适用于移动端，然后使用前缀添加更大屏幕的样式。

2. **自定义断点优先级**: 自定义断点会与Tailwind默认断点（sm, md, lg, xl, 2xl）共存。建议优先使用标准断点，只在必要时使用自定义断点。

3. **复杂布局**: 对于使用绝对定位、复杂transform等的情况，保留内联样式或使用CSS变量是合理的。

4. **渐进式改进**: 不需要一次性替换所有样式，可以逐步将简单的属性改为Tailwind类。

## 下一步建议

1. **简化设备检测**: 创建一个统一的响应式Hook，减少JavaScript状态管理
2. **使用CSS变量**: 对于需要在多个地方使用的值（如高度、padding），使用CSS变量
3. **逐步重构**: 先重构简单的组件，再处理复杂的布局
4. **减少!important**: 通过提高CSS选择器优先级来减少!important的使用



