#!/bin/bash

# GeoCMS 授权数据库初始化脚本

echo "🚀 开始初始化授权数据库..."

# 读取环境变量
source .env

# 使用独立的 schema 文件
SCHEMA_FILE="prisma/schema.license.prisma"

echo "📦 使用 schema 文件: $SCHEMA_FILE"

# 1. 生成 Prisma Client
echo "1️⃣ 生成 Prisma Client (授权数据库)..."
npx prisma generate --schema=$SCHEMA_FILE

# 2. 推送数据库结构
echo "2️⃣ 推送数据库结构到授权数据库..."
npx prisma db push --schema=$SCHEMA_FILE --skip-generate

# 3. 创建初始管理员
echo "3️⃣ 创建初始管理员账户..."
node scripts/create-admin.js

# 4. 初始化系统配置
echo "4️⃣ 初始化系统配置..."
node scripts/init-license-config.js

# 5. 生成 RSA 密钥对
echo "5️⃣ 生成 RSA 密钥对..."
node scripts/generate-rsa-keys.js

echo "✅ 授权数据库初始化完成！"
echo ""
echo "📋 下一步:"
echo "  1. 检查 .keys/ 目录中的 RSA 密钥"
echo "  2. 将公钥添加到 GeoCMS 客户端代码"
echo "  3. 启动授权服务器"
echo ""
echo "🔐 默认管理员账户:"
echo "  用户名: admin"
echo "  密码: admin123 (请立即修改)"
