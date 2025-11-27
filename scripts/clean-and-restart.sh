#!/bin/bash

# 清理缓存并重启开发服务器的脚本

echo "🧹 清理 Next.js 构建缓存..."
rm -rf .next
rm -rf node_modules/.cache

# 清理可能的其他缓存
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
find . -name ".turbo" -type d -exec rm -rf {} + 2>/dev/null || true

echo "✅ 缓存已清理"
echo ""
echo "📦 重新构建项目..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建完成！"
    echo ""
    echo "🚀 现在可以运行: npm run dev"
else
    echo ""
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi


