# GeoCMS 授权管理系统独立部署指南

## 📋 目录
1. [部署架构](#部署架构)
2. [准备工作](#准备工作)
3. [部署步骤](#部署步骤)
4. [配置说明](#配置说明)
5. [安全加固](#安全加固)
6. [维护运维](#维护运维)

---

## 🏗️ 部署架构

### 架构图
```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   GeoCMS 实例1  │      │   GeoCMS 实例2  │      │   GeoCMS 实例N  │
│  (客户端系统)    │      │  (客户端系统)    │      │  (客户端系统)    │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         │  HTTPS (授权验证)       │                        │
         └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │   授权服务器              │
                    │  (独立部署)               │
                    │  - API 服务               │
                    │  - 管理后台               │
                    │  - 数据库                 │
                    └─────────────────────────┘
```

### 组件说明
1. **授权服务器**：独立部署的授权管理系统
2. **客户端系统**：多个 GeoCMS 实例
3. **通信方式**：HTTPS API 调用

---

## 📦 准备工作

### 1. 服务器要求

#### 最低配置
- **CPU**: 2核
- **内存**: 4GB
- **硬盘**: 20GB SSD
- **带宽**: 5Mbps
- **系统**: Ubuntu 20.04+ / CentOS 7+

#### 推荐配置
- **CPU**: 4核
- **内存**: 8GB
- **硬盘**: 40GB SSD
- **带宽**: 10Mbps

### 2. 软件环境

```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MySQL 8.0+
sudo apt-get install -y mysql-server

# Nginx
sudo apt-get install -y nginx

# PM2（进程管理）
sudo npm install -g pm2

# Git
sudo apt-get install -y git
```

---

## 🚀 部署步骤

### 步骤 1：创建独立授权服务器项目

```bash
# 1. 创建项目目录
mkdir geocms-license-server
cd geocms-license-server

# 2. 初始化 Node.js 项目
npm init -y

# 3. 安装依赖
npm install next@latest react@latest react-dom@latest
npm install @prisma/client bcryptjs jsonwebtoken
npm install -D prisma typescript @types/node @types/react
```

### 步骤 2：复制授权系统文件

从现有的 GeoCMS 项目中提取以下文件：

```bash
# 创建目录结构
mkdir -p src/{app,lib,components}
mkdir -p src/app/{api,license-admin}
mkdir -p src/lib/license
mkdir -p prisma-license

# 复制必要文件
# 注意：需要从您的 GeoCMS 项目中复制以下文件
```

#### 需要复制的文件列表：

**1. API 路由** (`src/app/api/license/`)
```
src/app/api/license/
├── activate/route.ts
├── verify/route.ts
├── info/route.ts
├── heartbeat/route.ts
└── deactivate/route.ts
```

**2. 授权核心库** (`src/lib/license/`)
```
src/lib/license/
├── index.ts
├── types.ts
├── core/
│   ├── verifier.ts
│   ├── cache.ts
│   ├── heartbeat.ts
│   └── timestamp.ts
├── crypto/
│   ├── rsa.ts
│   ├── aes.ts
│   └── hash.ts
└── fingerprint/
    └── generator.ts
```

**3. 管理后台** (`src/app/license-admin/`)
```
src/app/license-admin/
├── dashboard/page.tsx
├── customers/page.tsx
├── licenses/page.tsx
├── generate/page.tsx
├── domains/page.tsx
└── login/page.tsx
```

**4. 数据库** (`prisma-license/`)
```
prisma-license/
├── schema.prisma
└── seed.ts
```

### 步骤 3：配置文件

#### 创建 `.env`
```env
# 数据库
DATABASE_URL="mysql://license_user:STRONG_PASSWORD@localhost:3306/geocms_license?connection_limit=10&pool_timeout=20"

# 服务器
PORT=4000
NODE_ENV=production

# 授权服务器URL（供客户端调用）
LICENSE_SERVER_URL=https://license.yourdomain.com

# JWT密钥（用于管理后台登录）
JWT_SECRET=your-super-secret-jwt-key-change-this

# 加密密钥
ENCRYPTION_KEY=your-32-char-encryption-key-here

# 管理员
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=change-this-password

# 允许的域名（CORS）
ALLOWED_ORIGINS=https://client1.com,https://client2.com
```

#### 创建 `next.config.js`
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 监听所有网络接口
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

module.exports = nextConfig;
```

#### 创建 `package.json` 脚本
```json
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
```

### 步骤 4：数据库设置

```bash
# 1. 创建数据库
mysql -u root -p
```

```sql
-- 在 MySQL 中执行
CREATE DATABASE geocms_license CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建专用用户
CREATE USER 'license_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON geocms_license.* TO 'license_user'@'localhost';
FLUSH PRIVILEGES;
```

```bash
# 2. 推送数据库结构
npm run prisma:push

# 3. 生成 Prisma Client
npm run prisma:generate

# 4. 执行种子数据
npm run prisma:seed
```

### 步骤 5：构建和启动

```bash
# 1. 构建生产版本
npm run build

# 2. 使用 PM2 启动
pm2 start npm --name "license-server" -- start

# 3. 设置开机自启
pm2 startup
pm2 save
```

### 步骤 6：配置 Nginx 反向代理

创建 `/etc/nginx/sites-available/license-server`：

```nginx
server {
    listen 80;
    server_name license.yourdomain.com;

    # 强制 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name license.yourdomain.com;

    # SSL 证书
    ssl_certificate /etc/letsencrypt/live/license.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/license.yourdomain.com/privkey.pem;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 反向代理到 Next.js
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API 限流
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}

# API 限流配置（添加到 http 块）
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/license-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤 7：配置 SSL 证书

```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d license.yourdomain.com

# 自动续期
sudo certbot renew --dry-run
```

---

## ⚙️ 客户端配置

### 在 GeoCMS 实例中配置

更新 GeoCMS 的 `.env` 文件：

```env
# 授权服务器地址
LICENSE_SERVER_URL=https://license.yourdomain.com

# 禁用本地心跳（使用服务器端验证）
DISABLE_LICENSE_HEARTBEAT=true

# 心跳间隔（可选，如果启用）
LICENSE_HEARTBEAT_INTERVAL=3600000
```

---

## 🔒 安全加固

### 1. 防火墙配置

```bash
# 只开放必要端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. 数据库安全

```bash
# 运行 MySQL 安全脚本
sudo mysql_secure_installation

# 配置 MySQL 只监听本地
# 编辑 /etc/mysql/mysql.conf.d/mysqld.cnf
bind-address = 127.0.0.1
```

### 3. API 访问控制

在 `src/app/api/license/middleware.ts` 添加：

```typescript
export function validateApiKey(req: Request) {
  const apiKey = req.headers.get('X-API-Key');
  const validKeys = process.env.VALID_API_KEYS?.split(',') || [];
  
  if (!apiKey || !validKeys.includes(apiKey)) {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

### 4. 日志监控

```bash
# PM2 日志
pm2 logs license-server --lines 100

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 监控和维护

### 1. 性能监控

```bash
# 安装监控工具
pm2 install pm2-metrics

# 查看实时监控
pm2 monit
```

### 2. 数据库备份

创建备份脚本 `/root/backup-license-db.sh`：

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/license-db"
mkdir -p $BACKUP_DIR

mysqldump -u license_user -p'PASSWORD' geocms_license | gzip > $BACKUP_DIR/license_$DATE.sql.gz

# 保留最近 30 天的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

```bash
# 添加到 crontab
chmod +x /root/backup-license-db.sh
crontab -e
# 添加: 0 2 * * * /root/backup-license-db.sh
```

### 3. 更新部署

```bash
# 1. 拉取最新代码
cd /path/to/license-server
git pull

# 2. 安装依赖
npm install

# 3. 重新构建
npm run build

# 4. 重启服务
pm2 restart license-server

# 5. 验证
pm2 logs license-server --lines 50
```

---

## 🧪 测试部署

### 1. 健康检查

```bash
# API 可用性
curl https://license.yourdomain.com/api/health

# 管理后台
curl -I https://license.yourdomain.com/license-admin
```

### 2. 授权激活测试

```bash
curl -X POST https://license.yourdomain.com/api/license/activate \
  -H "Content-Type: application/json" \
  -d '{
    "licenseCode": "TEST-CODE",
    "fingerprint": "test-fingerprint",
    "domain": "test.com"
  }'
```

---

## 📞 故障排查

### 常见问题

1. **数据库连接失败**
   ```bash
   # 检查 MySQL 状态
   sudo systemctl status mysql
   
   # 测试连接
   mysql -u license_user -p -h localhost geocms_license
   ```

2. **端口被占用**
   ```bash
   # 查看端口占用
   sudo lsof -i :4000
   
   # 修改端口（在 .env 中）
   PORT=4001
   ```

3. **SSL 证书问题**
   ```bash
   # 检查证书有效期
   sudo certbot certificates
   
   # 强制续期
   sudo certbot renew --force-renewal
   ```

---

## 📝 总结

### 部署清单
- [ ] 服务器准备完成
- [ ] 软件环境安装完成
- [ ] 项目文件部署完成
- [ ] 数据库配置完成
- [ ] Nginx 反向代理配置完成
- [ ] SSL 证书配置完成
- [ ] 防火墙配置完成
- [ ] 监控和备份配置完成
- [ ] 测试验证通过

### 访问地址
- **管理后台**: https://license.yourdomain.com/license-admin
- **API 端点**: https://license.yourdomain.com/api/license/*
- **Prisma Studio**: SSH 隧道 + http://localhost:5556

### 下一步
1. 配置客户端 GeoCMS 实例连接到授权服务器
2. 创建第一个客户和授权
3. 测试完整的激活流程
4. 配置监控告警

---

**文档版本**: 1.0  
**创建日期**: 2025-12-28  
**适用版本**: GeoCMS v1.0+
