#!/bin/bash

# GeoCMS 授权服务器独立部署自动化脚本
# 用途：快速部署独立的授权管理服务器

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================="
echo "GeoCMS 授权服务器独立部署脚本"
echo -e "==================================${NC}\n"

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}提示: 建议使用 sudo 运行此脚本${NC}"
fi

# 步骤 1: 收集配置信息
echo -e "${GREEN}步骤 1: 配置信息收集${NC}"
echo "========================"

read -p "授权服务器域名 (例如: license.yourdomain.com): " LICENSE_DOMAIN
read -p "管理员邮箱: " ADMIN_EMAIL
read -sp "管理员密码: " ADMIN_PASSWORD
echo ""
read -sp "数据库root密码: " DB_ROOT_PASSWORD
echo ""
read -sp "授权数据库密码: " LICENSE_DB_PASSWORD
echo ""
read -p "服务器端口 [4000]: " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-4000}

echo -e "\n"

# 步骤 2: 安装系统依赖
echo -e "${GREEN}步骤 2: 安装系统依赖${NC}"
echo "========================"

# Node.js
if ! command -v node &> /dev/null; then
    echo "安装 Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo -e "${GREEN}✓ Node.js 已安装 ($(node -v))${NC}"
fi

# MySQL
if ! command -v mysql &> /dev/null; then
    echo "安装 MySQL..."
    sudo apt-get install -y mysql-server
    sudo mysql_secure_installation <<EOF
$DB_ROOT_PASSWORD
n
y
y
y
y
EOF
else
    echo -e "${GREEN}✓ MySQL 已安装${NC}"
fi

# Nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    sudo apt-get install -y nginx
else
    echo -e "${GREEN}✓ Nginx 已安装${NC}"
fi

# PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    sudo npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 已安装${NC}"
fi

echo -e "\n"

# 步骤 3: 创建项目目录
echo -e "${GREEN}步骤 3: 创建项目结构${NC}"
echo "========================"

PROJECT_DIR="/opt/geocms-license-server"
echo "项目目录: $PROJECT_DIR"

sudo mkdir -p $PROJECT_DIR
sudo chown $USER:$USER $PROJECT_DIR
cd $PROJECT_DIR

# 初始化项目
if [ ! -f "package.json" ]; then
    echo "初始化 Node.js 项目..."
    npm init -y
    
    # 安装依赖
    echo "安装依赖..."
    npm install next@latest react@latest react-dom@latest
    npm install @prisma/client bcryptjs jsonwebtoken cors express-rate-limit
    npm install -D prisma typescript @types/node @types/react @types/bcryptjs @types/jsonwebtoken
else
    echo -e "${GREEN}✓ 项目已存在${NC}"
fi

# 创建目录结构
mkdir -p src/{app,lib,components}
mkdir -p src/app/{api,license-admin}
mkdir -p src/app/api/license
mkdir -p src/lib/license/{core,crypto,fingerprint}
mkdir -p prisma-license

echo -e "\n"

# 步骤 4: 配置数据库
echo -e "${GREEN}步骤 4: 配置数据库${NC}"
echo "========================"

echo "创建数据库和用户..."
mysql -u root -p"$DB_ROOT_PASSWORD" <<EOF
CREATE DATABASE IF NOT EXISTS geocms_license CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'license_user'@'localhost' IDENTIFIED BY '$LICENSE_DB_PASSWORD';
GRANT ALL PRIVILEGES ON geocms_license.* TO 'license_user'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}✓ 数据库配置完成${NC}\n"

# 步骤 5: 创建配置文件
echo -e "${GREEN}步骤 5: 创建配置文件${NC}"
echo "========================"

# .env 文件
cat > .env <<EOF
# 数据库
DATABASE_URL="mysql://license_user:${LICENSE_DB_PASSWORD}@localhost:3306/geocms_license?connection_limit=10&pool_timeout=20"

# 服务器
PORT=${SERVER_PORT}
NODE_ENV=production
LICENSE_SERVER_URL=https://${LICENSE_DOMAIN}

# JWT密钥
JWT_SECRET=$(openssl rand -base64 32)

# 加密密钥
ENCRYPTION_KEY=$(openssl rand -base64 32)

# 管理员
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASSWORD}

# CORS
ALLOWED_ORIGINS=*
EOF

echo -e "${GREEN}✓ .env 文件创建完成${NC}"

# package.json 脚本
cat > package.json <<'EOF'
{
  "name": "geocms-license-server",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start -p 4000",
    "prisma:generate": "prisma generate --schema=./prisma-license/schema.prisma",
    "prisma:push": "prisma db push --schema=./prisma-license/schema.prisma",
    "prisma:studio": "prisma studio --schema=./prisma-license/schema.prisma --port 5556",
    "prisma:seed": "node prisma-license/seed.js"
  }
}
EOF

echo -e "${GREEN}✓ package.json 配置完成${NC}"

# next.config.js
cat > next.config.mjs <<'EOF'
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
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

export default nextConfig;
EOF

echo -e "${GREEN}✓ next.config.js 创建完成${NC}\n"

# 步骤 6: 复制文件提示
echo -e "${YELLOW}步骤 6: 文件复制${NC}"
echo "========================"
echo -e "${YELLOW}请手动从 GeoCMS 项目复制以下文件到 $PROJECT_DIR:${NC}"
echo ""
echo "1. 复制 API 路由:"
echo "   cp -r /path/to/geocms/src/app/api/license/* $PROJECT_DIR/src/app/api/license/"
echo ""
echo "2. 复制授权核心库:"
echo "   cp -r /path/to/geocms/src/lib/license/* $PROJECT_DIR/src/lib/license/"
echo ""
echo "3. 复制管理后台:"
echo "   cp -r /path/to/geocms/src/app/license-admin/* $PROJECT_DIR/src/app/license-admin/"
echo ""
echo "4. 复制 Prisma 文件:"
echo "   cp /path/to/geocms/prisma-license/* $PROJECT_DIR/prisma-license/"
echo ""

read -p "文件复制完成后按回车继续..."

# 步骤 7: Nginx 配置
echo -e "\n${GREEN}步骤 7: 配置 Nginx${NC}"
echo "========================"

sudo tee /etc/nginx/sites-available/license-server > /dev/null <<EOF
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;

server {
    listen 80;
    server_name ${LICENSE_DOMAIN};
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ${LICENSE_DOMAIN};

    # SSL占位符（等待 Certbot 配置）
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    location / {
        proxy_pass http://localhost:${SERVER_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:${SERVER_PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/license-server /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✓ Nginx 配置完成${NC}\n"

# 步骤 8: SSL 证书
echo -e "${GREEN}步骤 8: 配置 SSL 证书${NC}"
echo "========================"

if command -v certbot &> /dev/null; then
    echo "配置 Let's Encrypt 证书..."
    sudo certbot --nginx -d ${LICENSE_DOMAIN} --non-interactive --agree-tos -m ${ADMIN_EMAIL}
else
    echo -e "${YELLOW}Certbot 未安装，请手动配置 SSL:${NC}"
    echo "sudo apt-get install -y certbot python3-certbot-nginx"
    echo "sudo certbot --nginx -d ${LICENSE_DOMAIN}"
fi

echo -e "\n"

# 步骤 9: 防火墙
echo -e "${GREEN}步骤 9: 配置防火墙${NC}"
echo "========================"

if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
    echo -e "${GREEN}✓ 防火墙配置完成${NC}"
else
    echo -e "${YELLOW}UFW 未安装，请手动配置防火墙${NC}"
fi

echo -e "\n"

# 步骤 10: 构建和启动
echo -e "${GREEN}步骤 10: 构建和启动服务${NC}"
echo "========================"

echo "生成 Prisma Client..."
npm run prisma:generate

echo "推送数据库结构..."
npm run prisma:push

echo "构建项目..."
npm run build

echo "启动服务..."
pm2 start npm --name "license-server" -- start
pm2 save
pm2 startup

echo -e "\n${GREEN}=================================="
echo "部署完成！"
echo -e "==================================${NC}\n"

echo -e "${BLUE}访问信息:${NC}"
echo "管理后台: https://${LICENSE_DOMAIN}/license-admin"
echo "API 端点: https://${LICENSE_DOMAIN}/api/license/*"
echo "Prisma Studio: ssh -L 5556:localhost:5556 your-server 然后访问 http://localhost:5556"
echo ""
echo -e "${BLUE}管理员账户:${NC}"
echo "邮箱: ${ADMIN_EMAIL}"
echo "密码: [您设置的密码]"
echo ""
echo -e "${BLUE}常用命令:${NC}"
echo "查看日志: pm2 logs license-server"
echo "重启服务: pm2 restart license-server"
echo "停止服务: pm2 stop license-server"
echo "监控状态: pm2 monit"
echo ""
echo -e "${YELLOW}下一步:${NC}"
echo "1. 访问管理后台登录"
echo "2. 创建第一个客户和授权"
echo "3. 配置客户端 GeoCMS 连接到此授权服务器"
echo ""
echo "详细文档: $PROJECT_DIR/LICENSE_SERVER_DEPLOYMENT.md"
