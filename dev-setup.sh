#!/bin/bash

echo "🔧 Molicms 开发环境快速设置"
echo ""

# 检查是否有node_modules
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
else
    echo "✅ 依赖已存在"
fi

echo ""
echo "⚙️  生成Prisma Client..."

# 生成主数据库Client
npx prisma generate
echo "✅ 主数据库 Prisma Client 已生成"

# 生成授权数据库Client
npx prisma generate --schema=prisma/schema.license.prisma
echo "✅ 授权数据库 Prisma Client 已生成"

echo ""
echo "💾 同步数据库..."

# 同步主数据库
npx prisma db push
echo "✅ 主数据库已同步"

# 同步授权数据库
npx prisma db push --schema=prisma/schema.license.prisma
echo "✅ 授权数据库已同步"

echo ""
echo "🎉 设置完成！"
echo ""
echo "📋 下一步:"
echo "   npm run dev          # 启动开发服务器"
echo "   npm run prisma:studio  # 打开数据库管理"
echo ""
echo "💡 常用命令:"
echo "   npm run prisma:generate  # 重新生成Prisma Client"
echo "   npm run prisma:push      # 同步数据库结构"
echo "   npm run setup            # 完整重置环境"
