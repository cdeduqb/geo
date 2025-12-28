# 🐳 GeoCMS 超简单部署方案 - Docker

**一键部署，无需手动配置环境！**

---

## 🎯 方案对比

### 传统部署 ❌
```
安装Node.js → 配置环境变量 → 安装依赖 → 配置PM2 
→ 配置Nginx → 配置SSL → 各种问题排查
```

### Docker部署 ✅
```
安装Docker → 配置.env → docker-compose up
```

---

## ⚡ 超简单3步部署

### 第1步: 安装Docker（5分钟）

**宝塔面板安装（最简单）**:
```
1. 宝塔面板 → 软件商店
2. 搜索 "Docker"
3. 点击 "Docker管理器" → 安装
4. 等待安装完成
```

**或通过SSH安装**:
```bash
# 一键安装Docker和Docker Compose
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun

# 启动Docker
systemctl start docker
systemctl enable docker

# 验证
docker -v
docker-compose -v
```

### 第2步: 上传代码并配置（3分钟）

```bash
# 上传代码到服务器
cd /www/wwwroot
# 方式1: Git克隆
git clone your-repo geocms
# 方式2: 上传zip并解压

cd geocms

# 复制环境配置
cp .env.example .env

# 编辑配置（只需改数据库密码）
nano .env
```

**最小配置 .env**:
```env
# 域名（改成你的）
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com

# 密码（改成安全的密码）
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password

# Secret（运行命令生成）
NEXTAUTH_SECRET=运行 openssl rand -base64 32 生成
```

### 第3步: 一键启动（1分钟）

```bash
# 启动所有服务
docker-compose up -d

# 查看状态
docker-compose ps

# 完成！
```

访问 `https://your-domain.com` 即可！

---

## 📁 需要的文件

### 1. Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npx prisma generate --schema=prisma/schema.license.prisma
RUN npm run build

# 生产环境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. docker-compose.yml

在项目根目录创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  # MySQL数据库
  mysql:
    image: mysql:8.0
    container_name: geocms-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: cms
      MYSQL_USER: cms
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"
    networks:
      - geocms-network

  # GeoCMS应用
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: geocms-app
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_URL: mysql://cms:${MYSQL_PASSWORD}@mysql:3306/cms
      LICENSE_DATABASE_URL: mysql://cms:${MYSQL_PASSWORD}@mysql:3306/cmslicense
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
    ports:
      - "3000:3000"
    depends_on:
      - mysql
    networks:
      - geocms-network

  # Nginx反向代理
  nginx:
    image: nginx:alpine
    container_name: geocms-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - /www/wwwlogs:/var/log/nginx
    depends_on:
      - app
    networks:
      - geocms-network

volumes:
  mysql_data:

networks:
  geocms-network:
    driver: bridge
```

### 3. init-db.sql

创建 `init-db.sql` 初始化授权数据库:

```sql
-- 创建授权数据库
CREATE DATABASE IF NOT EXISTS cmslicense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. nginx.conf

创建 `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 5. .env.example

创建 `.env.example` 模板:

```env
# 网站配置
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=生成随机字符串

# 数据库密码
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password

# AI配置（可选）
# DEEPSEEK_API_KEY=
# VOLCANO_API_KEY=
```

### 6. next.config.js

修改 `next.config.js` 添加standalone:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // 添加这行
  // ... 其他配置
}

module.exports = nextConfig
```

---

## 🚀 完整部署流程

### 一键部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 开始部署GeoCMS..."

# 检查Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker未安装，正在安装..."
    curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
    systemctl start docker
    systemctl enable docker
fi

# 检查配置
if [ ! -f .env ]; then
    echo "📝 创建配置文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件配置数据库密码和域名"
    echo "   然后重新运行此脚本"
    exit 1
fi

# 停止旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 构建并启动
echo "🔨 构建应用..."
docker-compose build

echo "🚀 启动服务..."
docker-compose up -d

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 初始化数据库
echo "💾 初始化数据库..."
docker-compose exec -T app npx prisma db push
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma

echo "✅ 部署完成！"
echo "📱 访问: ${NEXT_PUBLIC_SITE_URL}"
echo ""
echo "📋 常用命令:"
echo "  查看状态: docker-compose ps"
echo "  查看日志: docker-compose logs -f"
echo "  重启服务: docker-compose restart"
echo "  停止服务: docker-compose down"
```

### 使用方法

```bash
# 1. 上传所有文件到服务器
cd /www/wwwroot/geocms

# 2. 配置环境
cp .env.example .env
nano .env  # 修改密码和域名

# 3. 一键部署
chmod +x deploy.sh
./deploy.sh

# 完成！
```

---

## 🔧 常用命令

```bash
# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启服务
docker-compose restart app

# 停止所有服务
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 进入容器
docker-compose exec app sh

# 查看数据库
docker-compose exec mysql mysql -uroot -p
```

---

## 📊 对比说明

### 传统部署
```
✓ 完全控制
✗ 配置复杂
✗ 环境冲突
✗ 维护困难
✗ 迁移麻烦
```

### Docker部署
```
✓ 一键部署
✓ 环境隔离
✓ 易于维护
✓ 轻松迁移
✓ 自动重启
```

---

## 🎯 更新部署

```bash
# 1. 拉取最新代码
cd /www/wwwroot/geocms
git pull

# 2. 重新构建
docker-compose build app

# 3. 重启
docker-compose up -d app

# 完成！
```

---

## 💡 宝塔面板配置

### 方式1: 直接访问（简单）

```
不需要Nginx配置，直接访问:
http://服务器IP:3000
```

### 方式2: 使用宝塔反向代理（推荐）

```
1. 宝塔 → 网站 → 添加站点
2. 域名: your-domain.com
3. 反向代理 → http://127.0.0.1:3000
4. SSL → 申请证书
```

---

## ✅ 最终检查

部署成功后检查:

```bash
# 1. 容器运行
docker-compose ps
# 应该看到3个容器都是Up状态

# 2. 应用访问
curl http://localhost:3000
# 应该返回HTML内容

# 3. 数据库连接
docker-compose exec mysql mysql -ucms -p cms
# 能连接说明数据库正常
```

---

## 🎉 总结

**只需3个文件 + 3个命令**:

**文件**:
1. `Dockerfile`
2. `docker-compose.yml`  
3. `.env`

**命令**:
```bash
docker-compose build
docker-compose up -d
# 完成！
```

**比传统部署简单10倍！** 🚀
