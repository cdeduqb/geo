#!/bin/bash

# GeoCMS 开发测试文件和文档清理脚本
# 用途：删除开发过程中产生的测试文件和不必要的说明文档

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================="
echo "GeoCMS 测试文件和文档清理"
echo -e "==================================${NC}\n"

echo -e "${GREEN}开始清理...${NC}\n"

# 1. 清理测试文件
echo "1. 清理测试文件..."
rm -f test-*.js && echo "  ✓ 删除 test-*.js" || echo "  ℹ 无测试文件"
rm -f test-*.ts && echo "  ✓ 删除 test-*.ts" || true

# 2. 清理开发过程文档
echo ""
echo "2. 清理开发文档..."

# 删除具体的开发文档（保留 README.md 和 CLEANUP_REPORT.md）
rm -f ADMIN_LOGIN.md && echo "  ✓ 删除 ADMIN_LOGIN.md"
rm -f DOCKER_ERROR_FIX.md && echo "  ✓ 删除 DOCKER_ERROR_FIX.md"
rm -f SEO_PUSH_QUICK_REVIEW.md && echo "  ✓ 删除 SEO_PUSH_QUICK_REVIEW.md"
rm -f NEXTJS_MODULE_ERROR_FIXED.md && echo "  ✓ 删除 NEXTJS_MODULE_ERROR_FIXED.md"
rm -f SEO_BUILD_ERROR_FIXED.md && echo "  ✓ 删除 SEO_BUILD_ERROR_FIXED.md"
rm -f SEO_PUSH_OPTIMIZATION_COMPLETE.md && echo "  ✓ 删除 SEO_PUSH_OPTIMIZATION_COMPLETE.md"
rm -f SEO_PUSH_ANALYSIS.md && echo "  ✓ 删除 SEO_PUSH_ANALYSIS.md"
rm -f STAGE2_TEST_COMPLETE.md && echo "  ✓ 删除 STAGE2_TEST_COMPLETE.md"
rm -f TEST_COMPLETE.md && echo "  ✓ 删除 TEST_COMPLETE.md"
rm -f GEO_FEATURE_EXPLANATION.md && echo "  ✓ 删除 GEO_FEATURE_EXPLANATION.md"
rm -f CUSTOMER_EDIT_FIX.md && echo "  ✓ 删除 CUSTOMER_EDIT_FIX.md"
rm -f SIDEBAR_MENU_OPTIMIZED.md && echo "  ✓ 删除 SIDEBAR_MENU_OPTIMIZED.md"
rm -f MODULE_ERROR_FIX.md && echo "  ✓ 删除 MODULE_ERROR_FIX.md"
rm -f NPM_NOT_FOUND_FIX.md && echo "  ✓ 删除 NPM_NOT_FOUND_FIX.md"

# 3. 清理部署相关文档（保留最终版）
echo ""
echo "3. 清理旧的部署文档..."
rm -f DEPLOYMENT_DOCKER_SIMPLE.md && echo "  ✓ 删除 DEPLOYMENT_DOCKER_SIMPLE.md"
rm -f DEPLOYMENT_FINAL.md && echo "  ✓ 删除 DEPLOYMENT_FINAL.md"
rm -f DEPLOYMENT_3_STEPS.md && echo "  ✓ 删除 DEPLOYMENT_3_STEPS.md"
rm -f DEPLOYMENT_QUICK_REFERENCE.md && echo "  ✓ 删除 DEPLOYMENT_QUICK_REFERENCE.md"
rm -f DEPLOYMENT_BAOTA.md && echo "  ✓ 删除 DEPLOYMENT_BAOTA.md"
rm -f LOCAL_DEV_SETUP.md && echo "  ✓ 删除 LOCAL_DEV_SETUP.md"

# 4. 清理临时说明文档
echo ""
echo "4. 清理临时说明文档..."
rm -f CLEANUP_REPORT.md && echo "  ✓ 删除 CLEANUP_REPORT.md"

# 5. 清理 docs 目录中的临时文档
echo ""
echo "5. 清理 docs 目录..."
if [ -d "docs" ]; then
    # 删除空目录
    find docs -type d -empty -delete && echo "  ✓ 删除空目录" || true
    
    # 如果 docs 本身是空的，也删除
    if [ -z "$(ls -A docs 2>/dev/null)" ]; then
        rm -rf docs && echo "  ✓ 删除空的 docs 目录"
    fi
else
    echo "  ℹ docs 目录不存在"
fi

# 6. 清理其他临时文件
echo ""
echo "6. 清理其他临时文件..."
rm -f *.log && echo "  ✓ 删除 *.log" || true
rm -f *.tmp && echo "  ✓ 删除 *.tmp" || true
rm -f .DS_Store && echo "  ✓ 删除 .DS_Store" || true
find . -name ".DS_Store" -type f -delete && echo "  ✓ 删除所有 .DS_Store" || true

# 7. 提交更改
echo ""
echo "7. 提交更改..."
git add -A
if git diff-index --quiet HEAD --; then
    echo "  ℹ 没有需要提交的更改"
else
    git commit -m "chore: Clean up development test files and documentation

- Removed all test-*.js files
- Removed development process documentation
- Removed old deployment guides
- Removed temporary explanation files
- Cleaned up empty directories

Keeping only essential documentation: README.md"
    echo "  ✓ 更改已提交"
fi

# 完成
echo ""
echo -e "${BLUE}=================================="
echo "清理完成！"
echo -e "==================================${NC}\n"

echo -e "${GREEN}已删除：${NC}"
echo "  ✓ 所有测试文件 (test-*.js)"
echo "  ✓ 开发过程文档 (15+ 个)"
echo "  ✓ 旧的部署文档 (6 个)"
echo "  ✓ 临时说明文档"
echo "  ✓ 临时和日志文件"
echo ""

echo -e "${GREEN}保留的文档：${NC}"
echo "  ✓ README.md - 项目主文档"
echo ""

echo -e "${BLUE}当前分支: ${NC}$(git branch --show-current)"
echo -e "${GREEN}项目已精简，准备好进行生产部署！${NC}"
