# 页面加载问题排查指南

## ⚠️ 重要提示

**如果遇到 "Cannot find module './XXX.js'" 错误，这是 Next.js 开发服务器缓存问题。**

### 🚀 推荐解决方案（已优化配置）

现在项目已优化配置，减少缓存问题。如果仍然遇到：

1. **使用清理启动命令**（推荐）：
   ```bash
   npm run dev:clean
   ```
   这会自动清理缓存并启动开发服务器。

2. **或者手动修复**：
   ```bash
   ./scripts/fix-build-error.sh
   ```

### 📝 预防措施

- 修改代码后如果出现错误，先尝试刷新浏览器
- 如果错误持续，使用 `npm run dev:clean` 重启
- 定期清理缓存：`npm run clean`

---

如果页面无法正确显示，请按以下步骤排查：

## 🚨 快速修复（推荐）

### 开发时遇到模块找不到错误

如果开发时遇到 "Cannot find module './XXX.js'" 错误：

**方法 1：快速重启（推荐）**
```bash
./scripts/restart-dev.sh
```
这会快速清理开发缓存并重启服务器。

**方法 2：完全重建**
```bash
./scripts/fix-build-error.sh
```
这会清除所有缓存并重新构建（较慢但更彻底）。

## 1. 清除所有缓存并重新构建

```bash
# 停止当前的开发服务器（Ctrl+C）

# 清除构建缓存
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# 重新构建
npm run build

# 重新启动开发服务器
npm run dev
```

或者使用提供的脚本：
```bash
./scripts/clean-and-restart.sh
```

## 2. 清除浏览器缓存

- **Chrome/Edge**: 按 `Cmd+Shift+R` (Mac) 或 `Ctrl+Shift+R` (Windows) 进行硬刷新
- **Safari**: 按 `Cmd+Option+R` 进行硬刷新
- 或者：打开开发者工具 (F12) → 右键刷新按钮 → 选择"清空缓存并硬性重新加载"

## 3. 检查浏览器控制台

打开浏览器开发者工具 (F12)，查看：
- **Console** 标签：是否有 JavaScript 错误
- **Network** 标签：是否有请求失败

## 4. 验证代码

运行代码验证脚本：
```bash
node scripts/verify-code.js
```

## 5. 检查常见问题

### 问题：页面显示空白
- **原因**: 可能是组件渲染错误
- **解决**: 查看浏览器控制台的错误信息

### 问题：页面显示 404
- **原因**: 路由配置问题
- **解决**: 检查 `app` 目录下的文件结构

### 问题：样式不显示
- **原因**: Tailwind CSS 未正确编译
- **解决**: 重新构建项目

### 问题：组件不更新
- **原因**: 开发服务器缓存
- **解决**: 重启开发服务器并清除缓存

### 问题：Cannot find module './XXX.js'
- **原因**: Next.js 开发服务器缓存损坏（通常在代码修改后发生）
- **快速解决**: 运行 `./scripts/restart-dev.sh` 快速重启
- **彻底解决**: 运行 `./scripts/fix-build-error.sh` 完全重建
- **预防**: 如果频繁出现，考虑定期重启开发服务器

## 6. 如果问题仍然存在

1. 检查 `package.json` 中的依赖版本
2. 运行 `npm install` 重新安装依赖
3. 检查 Node.js 版本（推荐 v18+）
4. 查看终端中的错误信息

## 代码验证清单

✅ 所有文件都有 `export default`
✅ 所有客户端组件都有 `'use client'` 指令
✅ 所有 hooks 都在组件顶部调用
✅ 所有 JSX 标签都正确闭合
✅ TypeScript 类型检查通过
✅ ESLint 检查通过
✅ 构建成功


