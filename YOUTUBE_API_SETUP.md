# YouTube API 配置说明

## 概述

企业SNS页面需要配置 YouTube Data API 来自动获取频道最新视频。本文档说明如何配置 YouTube API 密钥。

## 配置步骤

### 1. 获取 YouTube API 密钥

1. **访问 Google Cloud Console**
   - 打开 [Google Cloud Console](https://console.cloud.google.com/)

2. **创建或选择项目**
   - 点击顶部项目选择器
   - 创建新项目或选择现有项目

3. **启用 YouTube Data API v3**
   - 在左侧菜单选择 **"API 和服务"** → **"库"**
   - 搜索 **"YouTube Data API v3"**
   - 点击进入详情页
   - 点击 **"启用"** 按钮

4. **创建 API 密钥**
   - 在左侧菜单选择 **"API 和服务"** → **"凭据"**
   - 点击 **"创建凭据"** → **"API 密钥"**
   - 复制生成的 API 密钥（格式类似：`AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`）

5. **（可选）限制 API 密钥**
   - 点击刚创建的 API 密钥进行编辑
   - 在 **"API 限制"** 中选择 **"限制密钥"**
   - 选择 **"YouTube Data API v3"**
   - 保存更改

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中添加以下内容：

```env
# YouTube API 配置
YOUTUBE_API_KEY=你的API密钥

# 可选：手动指定最新视频ID（如果不使用API自动获取）
# YOUTUBE_LATEST_VIDEO_ID=your_video_id_here
```

**示例：**
```env
YOUTUBE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 重启开发服务器

配置完成后，需要重启开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## 频道信息

- **频道ID**: `UC217cs4dB9SRDAgpHzaD49w`
- **频道用户名**: `@bournmark`

## 工作原理

1. 页面加载时，前端调用 `/api/youtube-latest` API
2. API 使用 YouTube Data API 获取频道最新视频
3. 返回视频 ID 用于嵌入播放
4. 如果 API 调用失败，使用 fallback 视频 ID

## 故障排除

### API 密钥无效

**错误信息**: `API key not valid` 或 `403 Forbidden`

**解决方法**:
- 确认 API 密钥是否正确复制（没有多余空格）
- 确认已启用 YouTube Data API v3
- 检查 API 密钥是否被限制（如果限制了，确保允许 YouTube Data API v3）

### 配额超限

**错误信息**: `Quota exceeded`

**解决方法**:
- YouTube Data API 有每日配额限制（默认 10,000 单位/天）
- 每次搜索请求消耗 100 单位
- 如果配额不足，可以：
  - 等待配额重置（每天重置）
  - 在 Google Cloud Console 申请增加配额
  - 使用手动指定的视频 ID（`YOUTUBE_LATEST_VIDEO_ID`）

### 找不到视频

**错误信息**: `No videos found in channel`

**解决方法**:
- 确认频道 ID 正确：`UC217cs4dB9SRDAgpHzaD49w`
- 确认频道中有已发布的视频
- 检查视频是否为公开状态

### 使用 Fallback 视频

如果没有配置 API 密钥或 API 调用失败，系统会使用 fallback 视频 ID。可以通过设置 `YOUTUBE_LATEST_VIDEO_ID` 环境变量来指定一个固定的视频 ID。

## 安全提示

1. **不要提交 API 密钥到 Git**
   - `.env.local` 文件已添加到 `.gitignore`
   - 永远不要将 API 密钥提交到代码仓库

2. **限制 API 密钥使用**
   - 在 Google Cloud Console 中限制 API 密钥只能用于 YouTube Data API v3
   - 可以添加 HTTP 引用限制（仅允许特定域名使用）

3. **定期轮换密钥**
   - 建议定期更换 API 密钥以提高安全性

## 相关文件

- `/app/api/youtube-latest/route.ts` - YouTube API 路由
- `/app/company/sns/page.tsx` - 企业 SNS 页面
- `.env.local` - 环境变量配置文件（不提交到 Git）

## 测试

配置完成后，可以通过以下方式测试：

1. 访问 `/company/sns` 页面
2. 查看页面是否显示最新视频
3. 检查浏览器控制台是否有错误
4. 检查网络请求中 `/api/youtube-latest` 的响应

## 生产环境部署

在生产环境（如 Vercel、Netlify）部署时：

1. 在平台的环境变量设置中添加 `YOUTUBE_API_KEY`
2. 不要使用 `.env.local` 文件
3. 确保环境变量名称与代码中使用的完全一致


