#!/bin/bash

echo "🚀 开始部署GeoCMS (Docker方式)..."
echo ""

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装"
    echo "📦 正在安装Docker..."
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
    systemctl start docker
    systemctl enable docker
    echo "✅ Docker安装完成"
    echo ""
fi

# 检查Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "📦 安装Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "✅ Docker Compose安装完成"
    echo ""
fi

# 检查配置文件
if [ ! -f .env ]; then
    echo "⚠️  .env文件不存在"
    echo "📝 正在创建配置文件..."
    
    # 生成随机密码
    MYSQL_PASS=$(openssl rand -base64 12)
    AUTH_SECRET=$(openssl rand -base64 32)
    
    cat > .env <<EOF
# 网站配置
NEXT_PUBLIC_SITE_URL=https://moli123.com
NEXTAUTH_URL=https://moli123.com
NEXTAUTH_SECRET=$AUTH_SECRET

# 数据库配置
MYSQL_ROOT_PASSWORD=$MYSQL_PASS
MYSQL_PASSWORD=$MYSQL_PASS

# Prisma 连接字符串 (直接定义避免替换失败)
DATABASE_URL=mysql://cms:$MYSQL_PASS@mysql:3306/cms
LICENSE_DATABASE_URL=mysql://cms:$MYSQL_PASS@mysql:3306/cmslicense
EOF
    
    echo "✅ 配置文件已创建"
    echo "⚠️  请确保 .env 文件中的 NEXTAUTH_URL 与您的实际访问域名一致"
    echo "   当前设置为: https://moli123.com"
    echo ""
    read -p "按回车继续部署，或Ctrl+C退出修改配置..."
fi

# 检查 NEXTAUTH_SECRET 和连接字符串
if ! grep -q "NEXTAUTH_SECRET" .env; then
    echo "🔑 正在生成 NEXTAUTH_SECRET..."
    AUTH_SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=$AUTH_SECRET" >> .env
fi

if ! grep -q "DATABASE_URL" .env; then
    echo "🔌 正在补全数据库连接字符串..."
    # 尝试从 .env 中读取已有的密码
    EXISTING_PASS=$(grep MYSQL_PASSWORD .env | cut -d'=' -f2)
    if [ -z "$EXISTING_PASS" ]; then EXISTING_PASS="cmspassword"; fi
    echo "DATABASE_URL=mysql://cms:$EXISTING_PASS@mysql:3306/cms" >> .env
    echo "LICENSE_DATABASE_URL=mysql://cms:$EXISTING_PASS@mysql:3306/cmslicense" >> .env
fi

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down 2>/dev/null

# 构建镜像
echo "🔨 构建/检查 Docker镜像..."
docker-compose build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi

# 启动服务
echo "🚀 启动服务..."
docker-compose up -d

# 等待数据库就绪
echo "⏳ 等待数据库启动（最多60秒）..."
for i in {1..60}; do
    if docker-compose exec -T mysql mysqladmin ping -h localhost --silent 2>/dev/null; then
        echo "✅ 数据库已就绪"
        break
    fi
    echo -n "."
    sleep 1
done
echo ""

# 初始化数据库
echo "💾 正在同步数据库架构（使用 root 权限执行）..."
sleep 5
echo "1. 同步主数据库..."
docker-compose exec -T -u root app npx prisma@5 db push --accept-data-loss
echo "2. 同步授权数据库..."
docker-compose exec -T -u root app npx prisma@5 db push --schema=prisma/schema.license.prisma --accept-data-loss
echo "3. 填充种子数据 (可能需要下载 ts-node)..."
docker-compose exec -T -u root app npx -p ts-node -p typescript ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

echo ""
echo "✅ 部署完成！"
echo ""
echo "📱 访问地址: https://moli123.com"
echo "🔑 默认管理员账号: admin@example.com"
echo "🔑 默认管理员密码: admin"
echo ""
echo "📋 常用命令:"
echo "   查看状态: docker-compose ps"
echo "   查看日志: docker-compose logs -f app"
echo "   重启服务: docker-compose restart"
echo ""
echo "🎉 开始使用GeoCMS吧！"
