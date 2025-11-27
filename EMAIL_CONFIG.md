# 邮件配置说明

## 概述

网站的联系表单功能需要配置 SMTP 邮件服务器才能正常工作。本文档说明如何配置邮件发送功能。

## 配置步骤

### 1. 创建环境变量文件

在项目根目录（`2版/`）下创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

### 2. 填写邮件配置

编辑 `.env.local` 文件，填写您的 SMTP 服务器信息：

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAIL_TO=info@bournmark.jp
```

### 3. 常见邮件服务商配置

#### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # 需要使用应用专用密码，不是普通密码
```

**注意**：Gmail 需要使用[应用专用密码](https://support.google.com/accounts/answer/185833)，而不是普通密码。

#### QQ 邮箱

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@qq.com
SMTP_PASS=your-authorization-code  # 需要使用授权码，不是普通密码
```

**注意**：QQ 邮箱需要在设置中开启 SMTP 服务并获取授权码。

#### 163 邮箱

```env
SMTP_HOST=smtp.163.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@163.com
SMTP_PASS=your-authorization-code  # 需要使用授权码
```

#### 企业邮箱（以腾讯企业邮箱为例）

```env
SMTP_HOST=smtp.exmail.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@yourdomain.com
SMTP_PASS=your-password
```

### 4. 重启开发服务器

配置完成后，需要重启开发服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

## 环境变量说明

| 变量名 | 说明 | 必填 | 示例 |
|--------|------|------|------|
| `SMTP_HOST` | SMTP 服务器地址 | 是 | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP 端口 | 是 | `465` 或 `587` |
| `SMTP_SECURE` | 是否使用安全连接 | 是 | `true` 或 `false` |
| `SMTP_USER` | SMTP 用户名（通常是邮箱地址） | 是 | `your-email@gmail.com` |
| `SMTP_PASS` | SMTP 密码（可能是邮箱密码或应用专用密码） | 是 | `your-password` |
| `MAIL_TO` | 接收邮件的邮箱地址 | 是 | `info@bournmark.jp` |

## 安全注意事项

1. **不要将 `.env.local` 文件提交到 Git 仓库**
   - `.env.local` 文件已添加到 `.gitignore`
   - 只提交 `.env.example` 作为模板

2. **使用应用专用密码**
   - Gmail、QQ 邮箱等建议使用应用专用密码或授权码
   - 不要使用普通邮箱密码

3. **生产环境配置**
   - 在 Vercel、Netlify 等平台部署时，需要在平台的环境变量设置中添加这些变量
   - 不要在生产环境使用 `.env.local` 文件

## 测试邮件发送

配置完成后，可以通过以下方式测试：

1. 访问网站首页
2. 滚动到页面底部的"联系我们"部分
3. 填写留言表单并提交
4. 检查 `MAIL_TO` 指定的邮箱是否收到邮件

## 故障排除

### 错误：邮件配置不完整

**原因**：环境变量未正确设置

**解决方法**：
1. 确认 `.env.local` 文件存在于项目根目录
2. 确认所有必需的环境变量都已填写
3. 重启开发服务器

### 错误：SMTP 连接失败

**原因**：SMTP 服务器地址、端口或认证信息错误

**解决方法**：
1. 检查 `SMTP_HOST` 和 `SMTP_PORT` 是否正确
2. 确认 `SMTP_USER` 和 `SMTP_PASS` 是否正确
3. 对于 Gmail，确认是否使用了应用专用密码
4. 对于 QQ 邮箱，确认是否使用了授权码

### 错误：认证失败

**原因**：用户名或密码错误

**解决方法**：
1. 确认邮箱地址和密码正确
2. 对于 Gmail，使用应用专用密码而不是普通密码
3. 对于 QQ 邮箱，使用授权码而不是普通密码
4. 确认邮箱已开启 SMTP 服务

## 相关文件

- `.env.example` - 环境变量模板文件
- `.env.local` - 实际配置文件（不提交到 Git）
- `pages/api/send-form.ts` - 邮件发送 API 路由



