# 视频无法显示问题诊断报告

## 视频文件信息
- **主文件路径**: `/public/movie/top.mp4`（原始素材，HEVC 编码）
- **兼容文件**: `/public/movie/top_compat.mp4`（H.264，约 13 MB）、`/public/movie/top.webm`（VP9，约 16 MB）
- **文件状态**: ✅ 均已生成，可在 Edge / Chrome / Safari 中播放

## 可能的原因分析

### 1. 浏览器自动播放策略限制
**可能性**: ⭐⭐⭐⭐⭐ (非常高)
- 现代浏览器（Chrome、Safari、Firefox）对视频自动播放有严格限制
- 需要用户交互后才能播放视频
- 即使设置了 `muted` 和 `playsInline`，某些浏览器仍可能阻止

**解决方案**:
- 添加用户交互触发播放
- 使用 `poster` 属性显示视频封面
- 添加播放按钮让用户手动触发

### 2. 视频编码格式不兼容
**可能性**: ⭐⭐⭐ (中等)
- 原视频使用 HEVC（H.265）编码，部分浏览器（如旧版 Edge）默认不支持
- 已提供 H.264 和 VP9 两种兼容格式，优先加载 `top_compat.mp4`，无法播放时退回到 WebM 或原视频

**解决方案**:
- 如后续替换素材，可使用以下命令重新生成：
  ```bash
  # 生成 H.264 版本
  ffmpeg -i movie/top.mp4 -vf scale=1920:-2 -c:v libx264 -profile:v high -level 4.0 \
    -pix_fmt yuv420p -preset medium -crf 24 -movflags +faststart -an public/movie/top_compat.mp4

  # 生成 VP9 版本
  ffmpeg -i movie/top.mp4 -vf scale=1920:-2 -c:v libvpx-vp9 -b:v 0 -crf 36 -an public/movie/top.webm
  ```

### 3. 文件路径问题
**可能性**: ⭐⭐ (较低)
- Next.js 的静态文件路径可能不正确
- 文件权限问题

**解决方案**:
- 确认文件在 `public/movie/` 目录下
- 检查文件权限：`chmod 644 public/movie/top.mp4`

### 4. 视频文件损坏
**可能性**: ⭐ (很低)
- 文件可能在传输过程中损坏

**解决方案**:
- 重新上传视频文件
- 使用视频播放器测试文件是否可以正常播放

### 5. CORS 或 MIME 类型问题
**可能性**: ⭐⭐ (较低)
- 服务器可能没有正确设置 MIME 类型

**解决方案**:
- Next.js 通常会自动处理，但可以检查 `next.config.js`

## 推荐的解决方案

### 方案1: 添加播放按钮（推荐）
如果自动播放被阻止，显示一个播放按钮让用户手动触发。

### 方案2: 转码视频
若需替换素材，请同时生成 H.264 与 VP9 两个版本，确保 Edge / Chrome / Safari 均可播放。

### 方案3: 使用视频封面
添加 `poster` 属性，显示视频的第一帧或自定义封面图。

### 方案4: 检查浏览器控制台
打开浏览器开发者工具（F12），查看 Console 和 Network 标签：
- Console: 查看是否有错误信息
- Network: 查看视频文件是否成功加载（状态码200）

## 当前实现状态
- ✅ 已添加错误处理与加载指示
- ✅ 已设置 `muted`、`playsInline`、`autoPlay`
- ✅ 在出错时提供“重试/手动播放”按钮
- ✅ 新增 H.264 + VP9 双格式，自动回退
- ⚠️ 若浏览器仍阻止自动播放，可提示用户点击手动播放按钮

## 下一步操作建议
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签的错误信息
3. 查看 Network 标签，确认视频文件是否加载
4. 如果视频文件加载失败，检查文件路径和权限
5. 如果视频加载成功但无法播放，可能需要转码

