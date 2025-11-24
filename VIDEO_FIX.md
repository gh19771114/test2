# 视频播放问题修复指南

## 问题诊断

如果视频无法播放，可能的原因：

1. **视频编码格式不兼容** - 某些浏览器不支持特定的编码格式
2. **文件路径问题** - 确保文件在 `public/movie/top.mp4`
3. **浏览器自动播放策略** - 某些浏览器阻止自动播放

## 视频转码方案

### 方案1：使用 FFmpeg 转码（推荐）

如果系统已安装 FFmpeg：

```bash
# 转码为 H.264 编码的 MP4（最广泛兼容）
ffmpeg -i movie/top.mp4 -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k -movflags +faststart public/movie/top.mp4

# 或者创建 WebM 格式作为备选
ffmpeg -i movie/top.mp4 -c:v libvpx-vp9 -crf 30 -c:a libopus public/movie/top.webm
```

### 方案2：使用在线工具

1. 访问 https://cloudconvert.com/mp4-converter
2. 上传原始视频文件
3. 选择输出格式：MP4 (H.264)
4. 下载转换后的文件
5. 替换 `public/movie/top.mp4`

### 方案3：使用 macOS 自带的工具

```bash
# 使用 avconvert（如果可用）
avconvert --source movie/top.mp4 --output public/movie/top.mp4 --preset PresetHEVC1920x1080
```

## 当前实现

代码已实现：
- ✅ 使用 `<source>` 标签支持多种格式
- ✅ 添加了自动播放重试逻辑
- ✅ 设置了 `muted` 和 `playsInline` 属性
- ✅ 添加了错误处理和循环播放

## 测试步骤

1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签是否有错误信息
3. 查看 Network 标签，确认视频文件是否成功加载
4. 检查视频元素的状态

## 如果仍然无法播放

1. **检查文件大小** - 确保文件没有损坏
2. **尝试不同的浏览器** - Chrome、Firefox、Safari
3. **检查浏览器控制台** - 查看具体错误信息
4. **考虑使用 CDN** - 将视频上传到 CDN 服务




