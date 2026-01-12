# 如何获取YouTube视频ID

## 方法1：从视频URL获取

1. 打开您的YouTube频道：https://www.youtube.com/@bournmark
2. 点击您想要显示的最新视频
3. 查看浏览器地址栏，URL格式如下：
   ```
   https://www.youtube.com/watch?v=VIDEO_ID_HERE
   ```
   其中 `VIDEO_ID_HERE` 就是视频ID（11个字符）

## 方法2：从视频分享链接获取

1. 在YouTube视频页面点击"分享"按钮
2. 点击"复制链接"
3. 链接格式：`https://youtu.be/VIDEO_ID_HERE`
   其中 `VIDEO_ID_HERE` 就是视频ID

## 方法3：从嵌入代码获取

1. 在YouTube视频页面点击"分享"
2. 选择"嵌入"
3. 在嵌入代码中找到：
   ```html
   <iframe src="https://www.youtube.com/embed/VIDEO_ID_HERE">
   ```
   其中 `VIDEO_ID_HERE` 就是视频ID

## 示例

如果您的视频URL是：
```
https://www.youtube.com/watch?v=abc123xyz45
```

那么视频ID就是：`abc123xyz45`

## 配置方法

获取视频ID后，在 `.env.local` 文件中添加：

```env
YOUTUBE_LATEST_VIDEO_ID=你的视频ID
```

然后重启开发服务器。


