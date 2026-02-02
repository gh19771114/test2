#!/bin/bash
# 一键上传到 GitHub：add + commit + push
cd "$(dirname "$0")"
git add -A
git status
echo ""
read -p "提交说明 (直接回车用「更新」): " msg
msg=${msg:-更新}
git commit -m "$msg"
git push
