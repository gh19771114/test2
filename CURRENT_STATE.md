# 当前网页状态记录

**保存时间**: 2024年

## 已完成的功能

### 1. 全局背景图片
- **位置**: `/Users/gaohang/Documents/BMHP/2版/imgs/background.png`
- **实现方式**: 在 `PageLayout` 组件中添加背景
- **效果**: 所有使用 `PageLayout` 的页面都会显示背景图
- **技术细节**: 
  - 使用 `absolute` 定位，背景跟随页面滚动
  - 背景层级 `z-0`，内容层级 `z-10`
  - 使用 Next.js Image 组件优化加载
  - 背景图会随页面内容一起移动

### 2. 首页背景图应用
- **修改文件**: `app/page.tsx`
- **修改内容**: 将首页改为使用 `PageLayout` 组件
- **效果**: 首页现在也显示背景图

### 3. 白色背景透明化处理
所有白色背景部分已改为半透明（`bg-white/80 backdrop-blur-sm`），背景图可以透过显示：

#### 页面文件
- `app/qichu/page.tsx` - 合作伙伴网络部分
- `app/company/sns/page.tsx` - SNS平台卡片
- `app/wuye/page.tsx` - 服务卡片和案例卡片
- `app/touzi/page.tsx` - 信息卡片和投资属性卡片
- `app/cases/page.tsx` - 案例卡片和导航按钮
- `app/maimai/page.tsx` - 房源卡片和费用卡片（浮层菜单保持不透明）

#### 组件文件
- `components/Insights.tsx` - 资讯和百科卡片
- `components/Contact.tsx` - 联系表单和联系方式卡片
- `components/Services.tsx` - 服务部分（去掉section背景）
- `components/Works.tsx` - 案例卡片

## 页面结构

### 使用 PageLayout 的页面
所有页面现在都通过 `PageLayout` 组件统一管理，包括：
- 首页 (`app/page.tsx`)
- 所有业务介绍页面
- 所有企业介绍页面
- 所有案例和详情页面

### 背景图片配置
```tsx
// PageLayout.tsx
<div className="absolute inset-0 z-0">
  <Image
    src={backgroundImage}
    alt=""
    fill
    className="object-cover"
    priority={false}
    quality={90}
  />
</div>
```
**注意**: 使用 `absolute` 定位，背景会跟随页面滚动移动

## 样式规范

### 半透明背景
- **标准格式**: `bg-white/80 backdrop-blur-sm`
- **用途**: 卡片、容器等需要显示背景图的内容区域
- **效果**: 80% 不透明度 + 背景模糊效果

### 完全透明
- **移除**: `bg-white`、`bg-gray-50` 等纯色背景
- **用途**: section 容器，让背景图完全显示

## 注意事项

1. **浮层菜单**: 买卖中介页面的滑出菜单保持 `bg-white`（完全不透明），确保可读性
2. **标题背景**: 各页面的标题部分保持原有的渐变背景和图片，不受影响
3. **z-index层级**: 
   - 背景图: `z-0`
   - 页面内容: `z-10`
   - 标题背景: 更高层级（在各自页面中定义）

## 技术栈

- Next.js 14 (App Router)
- React
- Tailwind CSS
- Framer Motion
- Next.js Image 组件

## 文件清单

### 已修改的核心文件
- `components/PageLayout.tsx` - 添加全局背景
- `app/page.tsx` - 首页使用PageLayout

### 已修改的页面文件
- `app/qichu/page.tsx`
- `app/company/sns/page.tsx`
- `app/wuye/page.tsx`
- `app/touzi/page.tsx`
- `app/cases/page.tsx`
- `app/maimai/page.tsx`

### 已修改的组件文件
- `components/Insights.tsx`
- `components/Contact.tsx`
- `components/Services.tsx`
- `components/Works.tsx`

## 当前状态总结

✅ 所有页面已应用全局背景图
✅ 所有白色背景已改为半透明
✅ 背景图可以透过半透明区域显示
✅ 背景图跟随页面滚动移动（使用 absolute 定位）
✅ 标题背景和重要内容区域保持原有样式
✅ 代码无错误，可以正常构建和运行

## 最新更新

**更新时间**: 2024年

### 背景滚动功能
- **修改**: 将背景定位从 `fixed` 改为 `absolute`
- **效果**: 背景图现在会跟随页面内容一起滚动，而不是固定在视口中
- **文件**: `components/PageLayout.tsx`

