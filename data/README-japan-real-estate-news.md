# 日本房地产相关新闻 — 搜索与收录说明

本目录下的 `japanRealEstateNews.ts` 用于维护「近三个月」内、可能影响地价/房价的日本房地产新闻。展示页：`/news/real-estate-market`。

## 为什么需要优化搜索方式

- 单靠少量关键词容易漏掉重要媒体（如东洋经济、日经）或主题（如建设费高腾、再开发中止）。
- 用**分主题 + 分媒体**的搜索词表定期跑一遍，能更稳定地覆盖：
  - 地价·公示
  - 住宅·マンション价格
  - **建设费·再开发**（东洋经济等）
  - 金利·日银
  - J-REIT·外资
  - 各主要媒体站内

## 搜索词表在哪里

- **`japanRealEstateNewsSearchQueries.ts`**：按主题分组的搜索词（日文 + 英文），以及「按媒体 site 搜索」的查询。
- 可直接打开该文件，复制 `query` 到 Google / Bing 使用；若有脚本需求，可 `import { allSearchQueries } from '@/data/japanRealEstateNewsSearchQueries'` 做批量查询。

## 建议的检索节奏

1. **每月一次**（或每两周一回）：在搜索引擎中按 `japanRealEstateNewsSearchQueries.ts` 中的分组依次执行查询。
2. **优先补全**：
   - 主题：**建设费高腾、都市再开发中止**（易漏）
   - 媒体：**東洋経済オンライン**、日経、Reuters、NHK、読売、毎日、SUUMO 等。
3. 只收录「发布时间」在**近三个月内**的报道，避免列表变成长期存档。

## 收录时请统一

- **标题、日期、出处、URL**：必填。
- **正文**：能抓取到全文的尽量贴入 `body`；若仅能访问摘要，可先写摘要，并注明「全文见链接」。
- **正文相关图片**：若有报道内配图的可引用 URL，可填入 `images` 数组（不要用站标/logo）。
- **id**：在 `japanRealEstateNews.ts` 内唯一，建议用「媒体缩写-主题-日期」等，如 `toyokeizai-construction-cost-2026`。

## 日期与「近三个月」

- 列表页会按**当前日期**自动只显示「发布时间 ≥ 当前日期的三个月前」的条目。
- 数据里只保留近三个月内的新闻即可；更早的可在下次检索时不再加入，或从数组中删除以保持文件精简。

按上述搜索方式定期执行，能明显减少像「东洋经济建设费报道」这类重要新闻被漏掉的情况。

---

## 通过 Google News RSS 抓取

项目已支持**通过 Google News RSS** 自动抓取日本不动产相关新闻摘要（标题、日期、出处、链接），无需手动逐条收录。

- **RSS 配置**：在 `japanRealEstateNewsSearchQueries.ts` 中：
  - `googleNewsRssQueries`：RSS 使用的搜索词（如「日本 不動産」「地価 マンション 東京」）。
  - `getGoogleNewsRssUrl(query)`：生成对应 RSS 地址（`https://news.google.com/rss/search?q=...&hl=ja&gl=JP&ceid=JP:ja`）。
- **API**：`GET /api/news/google-rss` 会请求上述 RSS，解析 XML，过滤近三个月条目并去重，返回 JSON（`items`、`fetchedAt`）。
- **展示**：`/news/real-estate-market` 页面下方有「来自 Google News RSS」区块，会调用该 API 并展示抓取结果；链接为 Google 跳转 URL，点击可到原文。
- **说明**：RSS 只提供标题/日期/出处/链接，不包含正文与配图；需要全文或配图时仍可把该条手动加入 `japanRealEstateNews.ts`。
