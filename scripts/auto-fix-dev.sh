#!/bin/bash

# 自动修复开发服务器错误的脚本
# 当检测到模块找不到错误时自动运行

echo "🔧 自动修复开发服务器错误..."
echo ""

# 检查是否有开发服务器在运行
if pgrep -f "next dev" > /dev/null; then
    echo "1️⃣ 停止开发服务器..."
    pkill -f "next dev"
    sleep 2
fi

# 清理缓存
echo "2️⃣ 清理缓存..."
rm -rf .next/cache
rm -rf .next/server
rm -rf node_modules/.cache

echo "✅ 缓存已清理"
echo ""
echo "🚀 重新启动开发服务器..."
npm run dev






