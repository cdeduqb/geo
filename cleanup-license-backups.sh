#!/bin/bash

# GeoCMS 授权系统备份清理脚本
# 用途：删除所有授权系统相关的备份文件和文档

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================="
echo "GeoCMS 授权系统备份清理"
echo -e "==================================${NC}\n"

echo -e "${YELLOW}警告: 此操作将删除所有授权系统相关的备份文件${NC}"
echo -e "${YELLOW}请确保您已经备份了需要的文件！${NC}\n"

# 确认删除
read -p "确认删除所有授权系统备份文件？(yes/no): " CONFIRM
if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}取消操作${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}开始清理...${NC}\n"

# 删除压缩包和解压目录
echo "1. 清理授权服务器打包文件..."
if [ -f "license-server-package.tar.gz" ]; then
    rm -f license-server-package.tar.gz
    echo "  ✓ 删除 license-server-package.tar.gz"
fi

if [ -d "license-server-package" ]; then
    rm -rf license-server-package/
    echo "  ✓ 删除 license-server-package/"
fi

# 删除部署文档
echo ""
echo "2. 清理部署文档..."
rm -f UPLOAD_TO_SERVER.md && echo "  ✓ 删除 UPLOAD_TO_SERVER.md"
rm -f SERVER_CRASH_FIX.md && echo "  ✓ 删除 SERVER_CRASH_FIX.md"
rm -f separate-license-system.sh && echo "  ✓ 删除 separate-license-system.sh"

# 删除归档的文档目录
echo ""
echo "3. 清理归档文档..."
if [ -d "docs/archived/license-server" ]; then
    rm -rf docs/archived/license-server/
    echo "  ✓ 删除 docs/archived/license-server/"
fi

# 删除空的归档目录
if [ -d "docs/archived" ] && [ -z "$(ls -A docs/archived)" ]; then
    rm -rf docs/archived/
    echo "  ✓ 删除空目录 docs/archived/"
fi

# 删除备份分支
echo ""
echo "4. 删除备份分支..."
CURRENT_BRANCH=$(git branch --show-current)

if git show-ref --verify --quiet refs/heads/backup-before-license-removal; then
    if [ "$CURRENT_BRANCH" = "backup-before-license-removal" ]; then
        echo -e "${YELLOW}  ⚠ 当前在备份分支，先切换到主分支${NC}"
        git checkout feature/remove-license-admin || git checkout main
    fi
    git branch -D backup-before-license-removal
    echo "  ✓ 删除分支 backup-before-license-removal"
else
    echo "  ℹ 备份分支不存在或已删除"
fi

# 清理 git stash
echo ""
echo "5. 清理 git stash..."
STASH_COUNT=$(git stash list | wc -l)
if [ "$STASH_COUNT" -gt 0 ]; then
    git stash clear
    echo "  ✓ 清理所有 stash ($STASH_COUNT 个)"
else
    echo "  ℹ 没有 stash 需要清理"
fi

# 删除临时文件
echo ""
echo "6. 清理临时文件..."
rm -f .DS_Store && echo "  ✓ 删除 .DS_Store" || true
rm -f *.bak && echo "  ✓ 删除 *.bak 文件" || true

# 提交更改
echo ""
echo "7. 提交清理更改..."
git add -A
if git diff-index --quiet HEAD --; then
    echo "  ℹ 没有需要提交的更改"
else
    git commit -m "chore: Clean up license system backup files

- Removed license-server-package.tar.gz
- Removed license-server-package directory
- Removed deployment and backup documentation
- Removed archived license server docs
- Deleted backup branch
- Cleaned up git stash

All license system files have been backed up separately.
The license management system is now completely independent at sq.moli123.com."
    echo "  ✓ 更改已提交"
fi

# 完成
echo ""
echo -e "${BLUE}=================================="
echo "清理完成！"
echo -e "==================================${NC}\n"

echo -e "${GREEN}已删除的文件和目录：${NC}"
echo "  ✓ license-server-package.tar.gz"
echo "  ✓ license-server-package/"
echo "  ✓ UPLOAD_TO_SERVER.md"
echo "  ✓ SERVER_CRASH_FIX.md"
echo "  ✓ separate-license-system.sh"
echo "  ✓ docs/archived/license-server/"
echo "  ✓ backup-before-license-removal 分支"
echo "  ✓ Git stash 缓存"
echo ""

echo -e "${GREEN}保留的内容：${NC}"
echo "  ✓ src/lib/license/ - 客户端验证核心库"
echo "  ✓ src/components/license/ - 授权相关组件"
echo "  ✓ src/app/api/license/ - 客户端授权 API"
echo "  ✓ src/app/admin/license/ - 简化的授权管理页面"
echo ""

echo -e "${BLUE}当前分支: ${NC}$(git branch --show-current)"
echo -e "${BLUE}授权服务器: ${NC}https://sq.moli123.com"
echo ""
echo -e "${GREEN}GeoCMS 系统现在已完全专注于内容管理功能！${NC}"
