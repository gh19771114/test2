# 字体文件设置说明

为了支持 PDF 中的中文字符显示，需要下载 Noto Sans SC 字体文件。

## 方法 1：自动下载（推荐）

代码会在首次运行时自动尝试从 CDN 下载字体文件。如果自动下载失败，请使用方法 2。

## 方法 2：手动下载

1. 访问以下任一链接下载 Noto Sans SC 字体：
   - https://fonts.google.com/noto/specimen/Noto+Sans+SC
   - 或搜索 "Noto Sans SC download"

2. 下载后，将字体文件重命名为 `NotoSansSC-Regular.ttf`

3. 将文件放置到以下目录：
   ```
   public/fonts/NotoSansSC-Regular.ttf
   ```

4. 确保文件大小大于 50KB（完整的字体文件通常为 200-300KB）

## 验证

重启开发服务器后，字体文件会被自动加载。如果仍有问题，请检查：
- 文件路径是否正确
- 文件大小是否合理（> 50KB）
- 文件权限是否可读





