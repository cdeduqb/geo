# GeoCMS 与授权系统代码分离方案

## 🎯 分离目标

将 GeoCMS（内容管理系统）与授权管理系统完全分离，使两者可以独立开发、部署和维护。

---

## 📊 当前代码分布分析

### 1. **授权系统相关代码**（在 GeoCMS 项目中）

#### A. 服务端管理代码（需要移除）
```
📦 需要移除到独立授权服务器
├── src/app/license-admin/          # 授权管理后台 UI
│   ├── dashboard/                  # 仪表板
│   ├── customers/                  # 客户管理
│   ├── domains/                    # 域名管理
│   ├── generate/                   # 授权生成
│   └── login/                      # 管理员登录
│
├── src/app/api/license-admin/      # 授权管理后台 API
│   ├── customers/                  # 客户 CRUD
│   ├── licenses/                   # 授权 CRUD
│   └── stats/                      # 统计信息
│
├── scripts/create-license-admin.js # 创建授权管理员脚本
│
└── 文档（可选移除）
    ├── LICENSE_ADMIN_GUIDE.md      # 授权管理指南
    └── PRISMA_STUDIO_*.md          # Prisma Studio 相关文档
```

#### B. 客户端验证代码（需要保留并简化）
```
📦 保留在 GeoCMS（轻量级客户端）
├── src/lib/license/                # 授权核心库
│   ├── types.ts                    # 类型定义 ✅ 保留
│   ├── core/
│   │   ├── verifier.ts             # 验证器 ✅ 保留（简化）
│   │   ├── cache.ts                # 本地缓存 ✅ 保留
│   │   ├── heartbeat.ts            # 心跳服务 ⚠️ 保留（已优化）
│   │   └── timestamp.ts            # 时间戳保护 ✅ 保留
│   ├── crypto/                     # 加密模块
│   │   ├── rsa.ts                  # RSA 加密 ✅ 保留
│   │   ├── aes.ts                  # AES 加密 ⚠️ 可选
│   │   └── hash.ts                 # Hash 算法 ✅ 保留
│   ├── fingerprint/
│   │   └── generator.ts            # 硬件指纹 ✅ 保留
│   └── index.ts                    # 主入口 ✅ 保留
│
├── src/components/license/         # 授权相关组件
│   ├── Copyright.tsx               # 版权组件 ✅ 保留
│   └── LicenseFooter.tsx           # 授权提示 ⚠️ 简化或移除
│
├── src/app/api/license/            # 客户端授权 API
│   ├── activate/                   # 激活授权 ✅ 保留
│   ├── verify/                     # 验证授权 ✅ 保留
│   ├── info/                       # 查询信息 ✅ 保留
│   └── heartbeat/                  # 心跳检测 ⚠️ 可选（已优化）
│
└── src/app/admin/license/          # GeoCMS 后台授权页面
    └── page.tsx                    # 授权管理页面 ✅ 保留（简化）
```

#### C. 部署和工具代码（需要移除）
```
📦 移除或归档
├── deploy-license-server.sh        # 授权服务器部署脚本
├── extract-license-files.sh        # 文件提取脚本
├── env.license-server.example      # 授权服务器配置模板
├── license-server-package/         # 打包的授权服务器文件
├── license-server-package.tar.gz   # 压缩包
├── .license-cache/                 # 授权缓存目录
├── DEPLOY_SQ_MOLI123.md           # 部署文档
└── LICENSE_SERVER_DEPLOYMENT.md    # 部署文档
```

---

## 🔀 分离策略

### 方案 A：完全移除（推荐）

**适用场景**：授权系统已部署到独立服务器（sq.moli123.com）

**优点**：
- GeoCMS 代码库精简
- 降低维护复杂度
- 明确职责分离

**缺点**：
- 需要确保授权服务器稳定运行
- 客户端完全依赖外部授权服务

**具体步骤**：
1. 删除授权管理后台
2. 删除授权管理 API
3. 删除部署脚本和文档
4. 简化客户端验证代码
5. 更新依赖和配置

### 方案 B：模块化保留（备用方案）

**适用场景**：需要在 GeoCMS 中保留最小可用的授权管理功能

**优点**：
- 保留紧急情况下的管理能力
- 可以在无授权服务器时本地管理

**缺点**：
- 代码冗余
- 维护成本较高

**具体步骤**：
1. 将授权管理代码移到 `/optional-modules/license-admin/`
2. 默认不加载
3. 通过环境变量控制是否启用

---

## 📋 详细操作计划（方案 A - 推荐）

### 阶段 1：备份和准备（5分钟）

```bash
# 1. 创建备份分支
git checkout -b backup-before-license-removal
git add .
git commit -m "Backup: Before removing license admin code"
git push origin backup-before-license-removal

# 2. 创建新的开发分支
git checkout -b feature/remove-license-admin
```

### 阶段 2：移除授权管理代码（10分钟）

```bash
# 1. 删除授权管理后台
rm -rf src/app/license-admin/

# 2. 删除授权管理 API
rm -rf src/app/api/license-admin/

# 3. 删除管理员创建脚本
rm -f scripts/create-license-admin.js

# 4. 删除部署相关文件
rm -f deploy-license-server.sh
rm -f extract-license-files.sh
rm -f env.license-server.example
rm -rf license-server-package/
rm -f license-server-package.tar.gz

# 5. 删除授权相关文档
rm -f LICENSE_ADMIN_GUIDE.md
rm -f LICENSE_SERVER_DEPLOYMENT.md
rm -f DEPLOY_SQ_MOLI123.md
rm -f PRISMA_STUDIO_*.md
rm -f README_PRISMA_REMOVED.md

# 6. 删除授权缓存目录
rm -rf .license-cache/
```

### 阶段 3：简化客户端代码（15分钟）

#### 3.1 简化 LicenseFooter 组件
```bash
# 方式1：完全移除（如果不需要未授权提示）
rm -f src/components/license/LicenseFooter.tsx

# 方式2：保留但简化（推荐）
# 在下一步中会提供简化版代码
```

#### 3.2 简化授权管理页面
```bash
# 简化 src/app/admin/license/page.tsx
# 移除管理功能，只保留查看和激活功能
```

#### 3.3 清理心跳服务
```bash
# 确保心跳服务已优化（之前已完成）
# src/lib/license/core/heartbeat.ts 已经添加了 Serverless 环境检测
```

### 阶段 4：更新配置文件（5分钟）

#### 4.1 更新 package.json
```bash
# 移除授权管理相关的脚本
# 例如：prisma:license-studio 等
```

#### 4.2 更新 .gitignore
```bash
# 添加
echo ".license-cache/" >> .gitignore
```

#### 4.3 更新环境变量文档
```bash
# 在 .env.example 中明确标注授权服务器地址
```

### 阶段 5：更新导航和路由（5分钟）

```bash
# 从管理后台导航中移除授权管理入口
# 编辑 src/app/admin/layout.tsx 或相关导航组件
```

### 阶段 6：测试和验证（10分钟）

```bash
# 1. 运行构建测试
npm run build

# 2. 启动开发服务器
npm run dev

# 3. 测试关键功能
# - 访问 /admin/license（简化版）
# - 测试授权激活
# - 测试版权显示
# - 确保没有 404 错误
```

### 阶段 7：提交和部署（5分钟）

```bash
# 1. 提交更改
git add .
git commit -m "refactor: Remove license admin module, keep client validation only"

# 2. 推送到远程
git push origin feature/remove-license-admin

# 3. 合并到主分支
git checkout main
git merge feature/remove-license-admin
git push origin main

# 4. 部署到生产环境
```

---

## 📝 需要保留的核心文件清单

### 必须保留（客户端验证核心）

```
✅ src/lib/license/
  ├── index.ts
  ├── types.ts
  ├── core/
  │   ├── verifier.ts
  │   ├── cache.ts
  │   ├── heartbeat.ts
  │   └── timestamp.ts
  ├── crypto/
  │   ├── rsa.ts
  │   └── hash.ts
  └── fingerprint/
      └── generator.ts

✅ src/components/license/
  └── Copyright.tsx

✅ src/app/api/license/
  ├── activate/route.ts
  ├── verify/route.ts
  └── info/route.ts

✅ src/app/admin/license/
  └── page.tsx（简化版）
```

### 可选保留

```
⚠️ src/lib/license/crypto/aes.ts        # AES加密（如果不需要可移除）
⚠️ src/components/license/LicenseFooter.tsx  # 未授权提示（可简化）
⚠️ src/app/api/license/heartbeat/route.ts    # 心跳API（如果禁用心跳可移除）
```

---

## 🔧 代码修改示例

### 1. 简化后的 LicenseFooter.tsx

```typescript
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
```

### 2. 简化后的 /admin/license/page.tsx

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export default function LicensePage() {
    const [licenseInfo, setLicenseInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLicenseInfo();
    }, []);

    const fetchLicenseInfo = async () => {
        try {
            const res = await fetch('/api/license/info');
            const data = await res.json();
            setLicenseInfo(data);
        } catch (error) {
            console.error('获取授权信息失败:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="p-6">加载中...</div>;
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold">授权管理</h1>
            </div>

            {licenseInfo?.licensed ? (
                <LicenseActive license={licenseInfo.license} />
            ) : (
                <LicenseInactive onRefresh={fetchLicenseInfo} />
            )}
        </div>
    );
}

// 已授权状态
function LicenseActive({ license }: any) {
    return (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                    <h2 className="text-xl font-bold text-green-900">授权已激活</h2>
                    <p className="text-sm text-green-700 mt-1">系统已成功授权，所有功能可正常使用</p>
                </div>
            </div>

            <div className="bg-white rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">授权码</span>
                    <span className="font-mono text-sm">{license?.licenseCode}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">有效期至</span>
                    <span>{new Date(license?.expiresAt).toLocaleDateString('zh-CN')}</span>
                </div>
            </div>
        </div>
    );
}

// 未授权状态
function LicenseInactive({ onRefresh }: any) {
    const [licenseCode, setLicenseCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleActivate = async () => {
        if (!licenseCode) {
            setError('请输入授权码');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/license/activate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ licenseCode })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onRefresh();
            } else {
                setError(data.error || '激活失败');
            }
        } catch (err) {
            setError('激活请求失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <div className="text-center mb-6">
                <AlertTriangle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">未激活授权</h2>
                <p className="text-gray-600">请输入授权码激活系统</p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">授权码</label>
                    <input
                        type="text"
                        value={licenseCode}
                        onChange={(e) => setLicenseCode(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="请输入授权码"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={handleActivate}
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? '激活中...' : '激活授权'}
                    </button>
                    <a
                        href="https://moli123.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                        购买授权
                    </a>
                </div>
            </div>
        </div>
    );
}
```

### 3. 更新 .env.example

```env
# ==================== 授权配置 ====================
# 授权服务器地址（独立部署）
LICENSE_SERVER_URL=https://sq.moli123.com

# 是否禁用心跳服务（推荐禁用，避免服务器崩溃）
DISABLE_LICENSE_HEARTBEAT=true

# 心跳间隔（毫秒），仅在启用心跳时有效
LICENSE_HEARTBEAT_INTERVAL=3600000
```

---

## ⚠️ 注意事项

### 1. 数据迁移

如果之前在 GeoCMS 数据库中存储了授权数据：
```bash
# 备份授权相关数据
mysqldump -u user -p geocms license* > license_data_backup.sql

# 导入到授权服务器数据库
mysql -u license_user -p geocms_license < license_data_backup.sql
```

### 2. 环境变量更新

确保所有环境都更新了 `LICENSE_SERVER_URL`：
```bash
# 开发环境
# 生产环境
# 测试环境
```

### 3. 文档更新

更新项目文档，说明授权管理已独立部署：
```markdown
## 授权管理

授权管理系统已独立部署到：https://sq.moli123.com

如需管理授权，请访问授权服务器管理后台。

GeoCMS 本身只保留客户端激活和验证功能。
```

---

## 📊 分离前后对比

| 项目 | 分离前 | 分离后 |
|------|--------|--------|
| 代码行数 | ~8000+ 行 | ~2000 行 |
| 文件数量 | ~50+ 文件 | ~15 文件 |
| 项目大小 | 较大 | 精简 |
| 维护复杂度 | 高 | 低 |
| 部署难度 | 复杂 | 简单 |
| 职责范围 | 混合 | 明确 |

---

## 🎯 总结

### 推荐方案：方案 A（完全移除）

**操作步骤**：
1. ✅ 备份代码
2. ✅ 执行删除脚本
3. ✅ 简化客户端代码
4. ✅ 更新配置
5. ✅ 测试验证
6. ✅ 部署上线

**预计时间**：约 1 小时

**风险等级**：低（已备份，可回滚）

---

需要我帮您执行这个分离方案吗？我可以创建一个自动化脚本来完成大部分工作！
