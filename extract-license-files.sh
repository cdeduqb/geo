#!/bin/bash

# GeoCMS 授权系统文件提取脚本
# 用途：从完整的 GeoCMS 项目中提取授权系统相关文件

set -e

SOURCE_DIR="."
DEST_DIR="./license-server-package"

echo "=================================="
echo "GeoCMS 授权系统文件提取工具"
echo "=================================="
echo ""

# 创建目标目录
echo "创建目标目录结构..."
mkdir -p ${DEST_DIR}/{src,prisma-license,docs}
mkdir -p ${DEST_DIR}/src/{app,lib,components}
mkdir -p ${DEST_DIR}/src/app/{api,license-admin}
mkdir -p ${DEST_DIR}/src/lib/license

# 复制 API 路由
echo "复制 API 路由..."
if [ -d "${SOURCE_DIR}/src/app/api/license" ]; then
    cp -r ${SOURCE_DIR}/src/app/api/license ${DEST_DIR}/src/app/api/
    echo "✓ API 路由已复制"
else
    echo "✗ 未找到 API 路由目录"
fi

# 复制授权核心库
echo "复制授权核心库..."
if [ -d "${SOURCE_DIR}/src/lib/license" ]; then
    cp -r ${SOURCE_DIR}/src/lib/license ${DEST_DIR}/src/lib/
    echo "✓ 授权核心库已复制"
else
    echo "✗ 未找到授权核心库目录"
fi

# 复制管理后台
echo "复制管理后台..."
if [ -d "${SOURCE_DIR}/src/app/license-admin" ]; then
    cp -r ${SOURCE_DIR}/src/app/license-admin ${DEST_DIR}/src/app/
    echo "✓ 管理后台已复制"
else
    echo "✗ 未找到管理后台目录"
fi

# 复制 Prisma 文件
echo "复制 Prisma 授权数据库文件..."
if [ -d "${SOURCE_DIR}/prisma-license" ]; then
    cp -r ${SOURCE_DIR}/prisma-license/* ${DEST_DIR}/prisma-license/
    echo "✓ Prisma 文件已复制"
else
    echo "✗ 未找到 Prisma 授权数据库目录"
fi

# 复制文档
echo "复制文档..."
if [ -f "${SOURCE_DIR}/LICENSE_SERVER_DEPLOYMENT.md" ]; then
    cp ${SOURCE_DIR}/LICENSE_SERVER_DEPLOYMENT.md ${DEST_DIR}/docs/
    echo "✓ 部署文档已复制"
fi

if [ -f "${SOURCE_DIR}/LICENSE_ADMIN_GUIDE.md" ]; then
    cp ${SOURCE_DIR}/LICENSE_ADMIN_GUIDE.md ${DEST_DIR}/docs/
    echo "✓ 管理指南已复制"
fi

# 创建 package.json
echo "创建 package.json..."
cat > ${DEST_DIR}/package.json <<'EOF'
{
  "name": "geocms-license-server",
  "version": "1.0.0",
  "description": "GeoCMS 独立授权管理服务器",
  "scripts": {
    "dev": "next dev -p 4000",
    "build": "next build",
    "start": "next start -p 4000",
    "prisma:generate": "prisma generate --schema=./prisma-license/schema.prisma",
    "prisma:push": "prisma db push --schema=./prisma-license/schema.prisma",
    "prisma:studio": "prisma studio --schema=./prisma-license/schema.prisma --port 5556",
    "prisma:seed": "node prisma-license/seed.js"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "prisma": "^5.7.0",
    "typescript": "^5.3.0",
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.5"
  }
}
EOF

# 创建 next.config.mjs
echo "创建 next.config.mjs..."
cat > ${DEST_DIR}/next.config.mjs <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.ALLOWED_ORIGINS || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-API-Key' },
        ],
      },
    ];
  },
};

export default nextConfig;
EOF

# 创建 .env.example
echo "创建 .env.example..."
cat > ${DEST_DIR}/.env.example <<'EOF'
# 数据库
DATABASE_URL="mysql://license_user:PASSWORD@localhost:3306/geocms_license?connection_limit=10&pool_timeout=20"

# 服务器
PORT=4000
NODE_ENV=production
LICENSE_SERVER_URL=https://license.yourdomain.com

# JWT密钥（使用 openssl rand -base64 32 生成）
JWT_SECRET=your-super-secret-jwt-key

# 加密密钥（使用 openssl rand -base64 32 生成）
ENCRYPTION_KEY=your-32-char-encryption-key

# 管理员
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=change-this-password

# CORS（多个域名用逗号分隔）
ALLOWED_ORIGINS=https://client1.com,https://client2.com
EOF

# 创建 README.md
echo "创建 README.md..."
cat > ${DEST_DIR}/README.md <<'EOF'
# GeoCMS 授权管理服务器

## 简介
这是从 GeoCMS 项目中提取的独立授权管理系统，可以单独部署为授权服务器。

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入正确的配置
```

### 3. 初始化数据库
```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

### 4. 启动服务
```bash
# 开发模式
npm run dev

# 生产模式
npm run build
npm start
```

## 部署指南
详细部署步骤请查看 `docs/LICENSE_SERVER_DEPLOYMENT.md`

## 管理指南
管理后台使用说明请查看 `docs/LICENSE_ADMIN_GUIDE.md`

## 访问地址
- 管理后台: http://localhost:4000/license-admin
- API 端点: http://localhost:4000/api/license/*
- Prisma Studio: npm run prisma:studio

## 技术栈
- Next.js 14
- Prisma ORM
- MySQL
- TypeScript
- RSA/AES 加密

## 许可证
保留所有权利 © 2024
EOF

# 创建 .gitignore
echo "创建 .gitignore..."
cat > ${DEST_DIR}/.gitignore <<'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# prisma
/prisma-license/migrations/
EOF

# 打包
echo ""
echo "创建压缩包..."
tar -czf license-server-package.tar.gz -C ${DEST_DIR} .

echo ""
echo "=================================="
echo "✓ 文件提取完成！"
echo "=================================="
echo ""
echo "提取的文件位于: ${DEST_DIR}/"
echo "压缩包: license-server-package.tar.gz"
echo ""
echo "文件清单:"
echo "  ├── src/app/api/license/        # API 路由"
echo "  ├── src/app/license-admin/      # 管理后台"
echo "  ├── src/lib/license/            # 授权核心库"
echo "  ├── prisma-license/             # 数据库文件"
echo "  ├── docs/                       # 文档"
echo "  ├── package.json                # 项目配置"
echo "  ├── next.config.mjs             # Next.js 配置"
echo "  ├── .env.example                # 环境变量示例"
echo "  └── README.md                   # 使用说明"
echo ""
echo "下一步:"
echo "1. 将 license-server-package.tar.gz 上传到目标服务器"
echo "2. 解压: tar -xzf license-server-package.tar.gz"
echo "3. 按照 docs/LICENSE_SERVER_DEPLOYMENT.md 进行部署"
echo ""
