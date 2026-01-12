# reCAPTCHA 配置说明

## 概述

已为以下表单添加了 reCAPTCHA 机器人验证系统，以防止恶意提交：

1. **联系表单** (`/components/Contact.tsx`) - 在确认信息页面添加验证
2. **解约申请表单** (`/app/tenant/kaiyaku/preview/page.tsx`) - 在确认提交页面添加验证

## 配置步骤

### 1. 获取 reCAPTCHA 密钥

1. 访问 [Google reCAPTCHA 管理控制台](https://www.google.com/recaptcha/admin)
2. 点击"创建"按钮
3. 填写表单：
   - **标签**：Bourn Mark 网站
   - **reCAPTCHA 类型**：选择 "reCAPTCHA v2" → "我不是机器人"复选框
   - **域名**：添加您的域名（例如：`bournmark.jp`、`localhost` 用于开发）
4. 接受服务条款并提交
5. 获取两个密钥：
   - **站点密钥** (Site Key) - 用于前端
   - **密钥** (Secret Key) - 用于后端验证

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中添加以下环境变量：

```env
# reCAPTCHA 配置
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=你的站点密钥
RECAPTCHA_SECRET_KEY=你的密钥
```

**注意**：
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` 必须以 `NEXT_PUBLIC_` 开头，这样 Next.js 才能在前端访问
- `RECAPTCHA_SECRET_KEY` 仅用于服务器端验证，不会暴露给前端

### 3. 重启开发服务器

配置环境变量后，需要重启开发服务器：

```bash
npm run dev
```

## 工作原理

1. **用户填写表单** → 点击"提交信息"或"提交预览"
2. **显示确认页面** → 用户确认信息
3. **显示 reCAPTCHA** → 用户完成验证
4. **点击确认提交** → 系统先验证 reCAPTCHA token
5. **验证通过** → 提交表单数据
6. **验证失败** → 显示错误信息，要求重新验证

## 验证流程

```
用户操作 → reCAPTCHA 验证 → 服务器验证 token → 提交表单
```

## 测试

### 开发环境测试

1. 在 `.env.local` 中添加测试密钥
2. 访问联系表单或解约申请页面
3. 填写表单并提交
4. 在确认页面完成 reCAPTCHA 验证
5. 点击确认提交

### 生产环境

确保：
- 域名已添加到 reCAPTCHA 配置中
- 环境变量已正确设置
- HTTPS 已启用（reCAPTCHA 要求）

## 故障排除

### reCAPTCHA 不显示

- 检查 `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` 是否正确设置
- 确认域名已添加到 reCAPTCHA 配置中
- 检查浏览器控制台是否有错误

### 验证失败

- 检查 `RECAPTCHA_SECRET_KEY` 是否正确设置
- 查看服务器日志中的错误信息
- 确认网络连接正常（需要访问 Google 的验证服务）

### 开发环境问题

- 在 reCAPTCHA 配置中添加 `localhost` 作为允许的域名
- 确保使用 `http://localhost:3000` 访问（不是 `127.0.0.1`）

## 安全说明

- **Secret Key 必须保密**：永远不要提交到代码仓库
- **使用环境变量**：将密钥存储在 `.env.local` 中，并添加到 `.gitignore`
- **定期轮换密钥**：建议定期更换 reCAPTCHA 密钥以提高安全性

## 相关文件

- `/app/api/verify-recaptcha/route.ts` - reCAPTCHA 验证 API
- `/components/Contact.tsx` - 联系表单组件
- `/app/tenant/kaiyaku/preview/page.tsx` - 解约申请预览页面

















