#!/bin/bash

# 快速修复 Next.js 构建错误的脚本
# 用于解决 "Cannot find module './XXX.js'" 等缓存问题

echo "🔧 修复 Next.js 构建错误..."
echo ""

# 1. 停止可能正在运行的开发服务器
echo "1️⃣ 停止开发服务器..."
pkill -f "next dev" 2>/dev/null || true
sleep 1

# 2. 清理所有缓存
echo "2️⃣ 清理构建缓存..."
rm -rf .next
rm -rf node_modules/.cache
rm -rf .turbo

# 3. 清理可能的临时文件
find . -name "*.tsbuildinfo" -delete 2>/dev/null || true

echo "✅ 缓存已清理"
echo ""

# 4. 重新构建
echo "3️⃣ 重新构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 修复完成！构建成功"
    echo ""
    echo "🚀 现在可以运行: npm run dev"
else
    echo ""
    echo "❌ 构建仍然失败，请检查代码错误"
    exit 1
fi






