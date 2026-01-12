# 定时任务设置说明

## 概述

系统已创建API端点 `/api/generate-news`，用于每天自动搜索网络信息并生成日本不动产相关资讯。

## 设置步骤

### 1. 配置环境变量

在 `.env.local` 文件中添加：

```
CRON_SECRET=your-secret-key-here
```

### 2. 设置定时任务

#### 选项A：使用Vercel Cron（如果部署在Vercel）

在 `vercel.json` 文件中添加：

```json
{
  "crons": [
    {
      "path": "/api/generate-news",
      "schedule": "0 10,17 * * *"
    }
  ]
}
```

这将在每天上午10点和下午5点（UTC时间）执行任务。

#### 选项B：使用外部Cron服务

可以使用以下服务来调用API端点：
- GitHub Actions
- EasyCron
- Cron-job.org
- 或其他cron服务

调用方式：
```
GET https://your-domain.com/api/generate-news
Authorization: Bearer your-secret-key-here
```

#### 选项C：使用服务器Cron（如果使用自己的服务器）

在服务器上设置cron任务：

```bash
# 编辑crontab
crontab -e

# 添加以下行（每天上午10点和下午5点执行，根据服务器时区调整）
0 10,17 * * * curl -X GET "https://your-domain.com/api/generate-news" -H "Authorization: Bearer your-secret-key-here"
```

## 实现网络搜索

当前API端点只是一个框架，需要实现实际的网络搜索逻辑。可以：

1. 使用Google Custom Search API
2. 使用Bing Search API
3. 使用RSS Feed聚合
4. 使用其他新闻API

在 `app/api/generate-news/route.ts` 中实现搜索逻辑后，系统将自动生成新闻并添加到 `lib/knowledge.ts` 文件中。

## 注意事项

- 确保API端点有适当的认证保护
- 注意API调用频率限制
- 生成的新闻需要人工审核后再发布
- 建议先实现搜索逻辑，然后逐步启用自动生成功能










