#!/usr/bin/env bash
# 一键执行：第一步抓列表 + 第二步抓正文并概括
# 使用前请先启动开发服务器：在 version2 目录执行 npm run dev
# 用法：在项目根目录执行 bash version2/scripts/crawl-news.sh

set -e
BASE="${BASE_URL:-http://localhost:3000}"

echo "第一步：抓取近三个月日本房地产新闻列表..."
RESP1=$(curl -s -w "\n%{http_code}" "$BASE/api/news/google-rss-screened")
CODE1=$(echo "$RESP1" | tail -n1)
if [ "$CODE1" = "200" ] && echo "$RESP1" | grep -q "fetchedAt"; then
  echo "  ✓ 列表已写入 data/rssSnapshot.json"
else
  echo "  ✗ 第一步失败（HTTP $CODE1）。请确认已启动：cd version2 && npm run dev"
  exit 1
fi

echo "第二步：逐条抓正文并概括（可能需 1～2 分钟）..."
RESP2=$(curl -s "$BASE/api/news/rss-dump")
if echo "$RESP2" | grep -q '"ok":true'; then
  echo "  ✓ 已更新 data/rssArticles.json 与 data/rssTranslations.json"
else
  echo "  ✗ 第二步失败"
  exit 1
fi

echo "完成。请打开 $BASE/news 查看最新资讯。"
