#!/bin/bash

echo "🔧 修复Docker部署错误..."
echo ""

# 修复Dockerfile
echo "1️⃣ 修复Dockerfile..."
sed -i 's/RUN npm ci/RUN npm install --production=false/g' Dockerfile
echo "✅ Dockerfile已修复"
echo ""

# 检查并添加NEXTAUTH_SECRET
echo "2️⃣ 检查环境变量..."
if ! grep -q "NEXTAUTH_SECRET" .env 2>/dev/null; then
    echo "添加NEXTAUTH_SECRET..."
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
    echo "✅ NEXTAUTH_SECRET已添加"
else
    echo "✅ NEXTAUTH_SECRET已存在"
fi
echo ""

# 清理旧容器
echo "3️⃣ 清理旧容器..."
docker-compose down 2>/dev/null
echo "✅ 已清理"
echo ""

# 重新构建
echo "4️⃣ 重新构建镜像（可能需要10分钟）..."
docker-compose build --no-cache

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo "✅ 构建成功"
echo ""

# 启动服务
echo "5️⃣ 启动服务..."
docker-compose up -d
echo "✅ 服务已启动"
echo ""

# 等待MySQL就绪
echo "6️⃣ 等待MySQL启动（30秒）..."
sleep 30
echo "✅ MySQL应该已就绪"
echo ""

# 初始化数据库
echo "7️⃣ 初始化数据库..."
docker-compose exec -T app npx prisma db push --accept-data-loss 2>/dev/null
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma --accept-data-loss 2>/dev/null
echo "✅ 数据库已初始化"
echo ""

# 检查状态
echo "8️⃣ 检查服务状态..."
docker-compose ps
echo ""

echo "🎉 修复完成！"
echo ""
echo "📱 访问地址:"
echo "   http://服务器IP:3000"
echo ""
echo "📋 查看日志:"
echo "   docker-compose logs -f app"
