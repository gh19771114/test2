#!/bin/bash

# 重启开发服务器的脚本
# 用于快速解决开发时的缓存问题

echo "🔄 重启开发服务器..."
echo ""

# 1. 停止可能正在运行的开发服务器
echo "1️⃣ 停止开发服务器..."
pkill -f "next dev" 2>/dev/null || true
sleep 2

# 2. 清理开发缓存（保留构建缓存以加快重启速度）
echo "2️⃣ 清理开发缓存..."
rm -rf .next/cache
rm -rf node_modules/.cache

echo "✅ 缓存已清理"
echo ""

# 3. 启动开发服务器
echo "3️⃣ 启动开发服务器..."
npm run dev






