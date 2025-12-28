#!/bin/bash

# GeoCMS 授权系统代码分离自动化脚本
# 用途：将授权管理代码从 GeoCMS 中移除，保留客户端验证功能

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================="
echo "GeoCMS 授权系统代码分离"
echo -e "==================================${NC}\n"

# 检查是否在正确的目录
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo -e "${RED}错误: 请在 GeoCMS 项目根目录运行此脚本${NC}"
    exit 1
fi

# 步骤 1: 创建备份分支
echo -e "${GREEN}步骤 1/7: 创建备份分支${NC}"
echo "========================"

git checkout -b backup-before-license-removal || true
git add -A
git commit -m "Backup: Before removing license admin code" || echo "No changes to commit"

echo -e "${GREEN}✓ 备份完成${NC}\n"

# 步骤 2: 创建工作分支
echo -e "${GREEN}步骤 2/7: 创建工作分支${NC}"
echo "========================"

git checkout -b feature/remove-license-admin || git checkout feature/remove-license-admin

echo -e "${GREEN}✓ 工作分支已创建${NC}\n"

# 步骤 3: 移除授权管理后台代码
echo -e "${GREEN}步骤 3/7: 移除授权管理代码${NC}"
echo "========================"

# 删除授权管理后台 UI
if [ -d "src/app/license-admin" ]; then
    rm -rf src/app/license-admin/
    echo "✓ 删除 src/app/license-admin/"
fi

# 删除授权管理 API
if [ -d "src/app/api/license-admin" ]; then
    rm -rf src/app/api/license-admin/
    echo "✓ 删除 src/app/api/license-admin/"
fi

# 删除管理员创建脚本
if [ -f "scripts/create-license-admin.js" ]; then
    rm -f scripts/create-license-admin.js
    echo "✓ 删除 scripts/create-license-admin.js"
fi

echo -e "${GREEN}✓ 授权管理代码已移除${NC}\n"

# 步骤 4: 删除部署和工具文件
echo -e "${GREEN}步骤 4/7: 清理部署文件${NC}"
echo "========================"

# 删除部署脚本
rm -f deploy-license-server.sh && echo "✓ 删除 deploy-license-server.sh"
rm -f extract-license-files.sh && echo "✓ 删除 extract-license-files.sh"

# 删除配置模板
rm -f env.license-server.example && echo "✓ 删除 env.license-server.example"

# 删除打包文件
rm -rf license-server-package/ && echo "✓ 删除 license-server-package/"
rm -f license-server-package.tar.gz && echo "✓ 删除 license-server-package.tar.gz"

# 删除缓存目录
rm -rf .license-cache/ && echo "✓ 删除 .license-cache/"

echo -e "${GREEN}✓ 部署文件已清理${NC}\n"

# 步骤 5: 清理文档
echo -e "${GREEN}步骤 5/7: 清理授权相关文档${NC}"
echo "========================"

# 移动文档到归档目录
mkdir -p docs/archived/license-server/

# 移动而不是删除（保留备份）
if [ -f "LICENSE_ADMIN_GUIDE.md" ]; then
    mv LICENSE_ADMIN_GUIDE.md docs/archived/license-server/ 2>/dev/null || true
    echo "✓ 归档 LICENSE_ADMIN_GUIDE.md"
fi

if [ -f "LICENSE_SERVER_DEPLOYMENT.md" ]; then
    mv LICENSE_SERVER_DEPLOYMENT.md docs/archived/license-server/ 2>/dev/null || true
    echo "✓ 归档 LICENSE_SERVER_DEPLOYMENT.md"
fi

if [ -f "DEPLOY_SQ_MOLI123.md" ]; then
    mv DEPLOY_SQ_MOLI123.md docs/archived/license-server/ 2>/dev/null || true
    echo "✓ 归档 DEPLOY_SQ_MOLI123.md"
fi

if [ -f "LICENSE_SEPARATION_PLAN.md" ]; then
    mv LICENSE_SEPARATION_PLAN.md docs/archived/license-server/ 2>/dev/null || true
    echo "✓ 归档 LICENSE_SEPARATION_PLAN.md"
fi

# 删除 Prisma Studio 相关文档
rm -f PRISMA_STUDIO_*.md && echo "✓ 删除 PRISMA_STUDIO 文档"
rm -f README_PRISMA_REMOVED.md && echo "✓ 删除 README_PRISMA_REMOVED.md"
rm -f PRISMA_CLIENT_FIX.md && echo "✓ 删除 PRISMA_CLIENT_FIX.md"

echo -e "${GREEN}✓ 文档已清理${NC}\n"

# 步骤 6: 创建简化的组件
echo -e "${GREEN}步骤 6/7: 创建简化的客户端代码${NC}"
echo "========================"

# 创建简化的 LicenseFooter
cat > src/components/license/LicenseFooter.tsx << 'EOF'
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function LicenseFooter() {
    const [licenseInfo, setLicenseInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/license/info')
            .then(res => res.json())
            .then(data => setLicenseInfo(data))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    // 如果已授权，不显示任何内容
    if (licenseInfo?.licensed) {
        return null;
    }

    // 加载中
    if (loading) {
        return null;
    }

    // 未授权时显示简单提示
    return (
        <div className="fixed bottom-4 right-4 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg z-50 max-w-xs">
            <div className="flex items-start gap-2 text-sm">
                <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-amber-900">未授权使用</p>
                    <div className="mt-1 flex gap-2 text-xs">
                        <Link href="/admin/license" className="text-blue-600 hover:underline">
                            激活授权
                        </Link>
                        <span className="text-gray-400">|</span>
                        <a href="https://moli123.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            购买授权
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
EOF
echo "✓ 创建简化的 LicenseFooter.tsx"

# 更新 .gitignore
if ! grep -q ".license-cache/" .gitignore 2>/dev/null; then
    echo -e "\n# License cache\n.license-cache/" >> .gitignore
    echo "✓ 更新 .gitignore"
fi

echo -e "${GREEN}✓ 客户端代码已简化${NC}\n"

# 步骤 7: 提交更改
echo -e "${GREEN}步骤 7/7: 提交更改${NC}"
echo "========================"

git add -A
git commit -m "refactor: Remove license admin module, keep client validation only

- Removed license-admin UI and management APIs
- Removed license server deployment scripts and tools
- Simplified LicenseFooter component
- Archived license server documentation
- Updated .gitignore for license cache

The license management system is now completely independent and deployed at sq.moli123.com.
GeoCMS only retains lightweight client-side license validation functionality."

echo -e "${GREEN}✓ 更改已提交${NC}\n"

# 完成
echo -e "${BLUE}=================================="
echo "分离完成！"
echo -e "==================================${NC}\n"

echo -e "${GREEN}已完成的操作：${NC}"
echo "✓ 创建备份分支: backup-before-license-removal"
echo "✓ 删除授权管理后台: src/app/license-admin/"
echo "✓ 删除授权管理 API: src/app/api/license-admin/"
echo "✓ 删除部署工具: deploy-license-server.sh, extract-license-files.sh"
echo "✓ 清理打包文件: license-server-package/"
echo "✓ 归档文档: docs/archived/license-server/"
echo "✓ 简化客户端代码: LicenseFooter.tsx"
echo "✓ 提交到分支: feature/remove-license-admin"
echo ""

echo -e "${YELLOW}保留的文件：${NC}"
echo "✓ src/lib/license/ - 客户端验证核心库"
echo "✓ src/components/license/Copyright.tsx - 版权组件"
echo "✓ src/app/api/license/ - 客户端授权 API"
echo "✓ src/app/admin/license/ - 简化的授权管理页面"
echo ""

echo -e "${BLUE}下一步操作：${NC}"
echo "1. 运行测试验证:"
echo "   npm run build"
echo "   npm run dev"
echo ""
echo "2. 测试关键功能:"
echo "   - 访问 http://localhost:3000/admin/license"
echo "   - 测试授权激活功能"
echo "   - 检查版权显示"
echo ""
echo "3. 如确认无误，合并到主分支:"
echo "   git checkout main"
echo "   git merge feature/remove-license-admin"
echo "   git push"
echo ""
echo "4. 如需回滚，切换到备份分支:"
echo "   git checkout backup-before-license-removal"
echo ""

echo -e "${GREEN}当前分支: ${NC}$(git branch --show-current)"
echo -e "${GREEN}授权服务器: ${NC}https://sq.moli123.com"
echo ""
