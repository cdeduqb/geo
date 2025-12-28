# GeoCMS 授权服务器快速部署指南
## 部署域名: sq.moli123.com

---

## 🎯 部署概览

**服务器信息**
- 域名: `sq.moli123.com`
- 端口: `4000` (内部) / `443` (外部HTTPS)
- 数据库: MySQL 8.0+
- 运行环境: PM2 + Nginx

---

## ⚡ 快速部署（15分钟完成）

### 步骤 1：准备服务器

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 更新系统
apt update && apt upgrade -y

# 安装必要软件
apt install -y curl wget git nginx mysql-server
```

### 步骤 2：安装 Node.js 和 PM2

```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 安装 PM2
npm install -g pm2

# 验证安装
node -v   # 应显示 v18.x.x
npm -v    # 应显示 9.x.x
pm2 -v    # 应显示版本号
```

### 步骤 3：配置数据库

```bash
# 登录 MySQL
mysql -u root -p
```

在 MySQL 中执行：
```sql
-- 创建数据库
CREATE DATABASE geocms_license CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建用户（请修改密码）
CREATE USER 'license_user'@'localhost' IDENTIFIED BY 'YOUR_STRONG_PASSWORD';

-- 授权
GRANT ALL PRIVILEGES ON geocms_license.* TO 'license_user'@'localhost';
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

### 步骤 4：部署项目文件

```bash
# 创建项目目录
mkdir -p /opt/geocms-license-server
cd /opt/geocms-license-server

# 上传项目文件（从本地执行）
# 方式1：使用提取脚本打包
cd /path/to/geocms
./extract-license-files.sh
scp license-server-package.tar.gz root@your-server:/opt/geocms-license-server/

# 在服务器上解压
cd /opt/geocms-license-server
tar -xzf license-server-package.tar.gz
rm license-server-package.tar.gz

# 方式2：使用 Git（如果有私有仓库）
# cd /opt/geocms-license-server
# git clone your-private-repo .
```

### 步骤 5：配置环境变量

```bash
cd /opt/geocms-license-server

# 复制配置模板
cp env.license-server.example .env

# 编辑配置文件
nano .env
```

**必须修改的配置**：
```env
# 修改数据库密码（与步骤3中创建的密码一致）
DATABASE_URL="mysql://license_user:YOUR_STRONG_PASSWORD@localhost:3306/geocms_license?connection_limit=10&pool_timeout=20"

# 生成并设置 JWT 密钥
JWT_SECRET=$(openssl rand -base64 32)

# 生成并设置加密密钥
ENCRYPTION_KEY=$(openssl rand -base64 32)

# 设置管理员密码（强密码）
ADMIN_PASSWORD=YourStrongAdminPassword123!

# 配置客户端域名（根据实际情况修改）
ALLOWED_ORIGINS=https://client1.com,https://client2.com
```

**快捷生成密钥**：
```bash
# 自动生成并替换密钥
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)

# 更新 .env 文件
sed -i "s/REPLACE_WITH_STRONG_SECRET_KEY/$JWT_SECRET/" .env
sed -i "s/REPLACE_WITH_32_CHAR_KEY/$ENCRYPTION_KEY/" .env
```

### 步骤 6：安装依赖并初始化数据库

```bash
# 安装 Node.js 依赖
npm install

# 生成 Prisma Client
npm run prisma:generate

# 推送数据库结构
npm run prisma:push

# 执行种子数据（创建管理员账户）
npm run prisma:seed
```

### 步骤 7：构建项目

```bash
# 构建生产版本
npm run build

# 验证构建
ls -la .next/
```

### 步骤 8：配置 Nginx

创建 Nginx 配置文件：
```bash
nano /etc/nginx/sites-available/sq.moli123.com
```

粘贴以下配置：
```nginx
# API 限流配置
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name sq.moli123.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 主配置
server {
    listen 443 ssl http2;
    server_name sq.moli123.com;

    # SSL 证书（暂时使用自签名，后续用 Certbot 替换）
    ssl_certificate /etc/ssl/certs/ssl-cert-snakeoil.pem;
    ssl_certificate_key /etc/ssl/private/ssl-cert-snakeoil.key;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 安全头
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

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
        limit_req_status 429;
        
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /_next/static/ {
        proxy_pass http://localhost:4000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, max-age=3600";
    }

    # 访问日志
    access_log /var/log/nginx/sq.moli123.com-access.log;
    error_log /var/log/nginx/sq.moli123.com-error.log;
}
```

启用配置：
```bash
# 创建软链接
ln -s /etc/nginx/sites-available/sq.moli123.com /etc/nginx/sites-enabled/

# 删除默认配置（可选）
rm /etc/nginx/sites-enabled/default

# 测试配置
nginx -t

# 重载 Nginx
systemctl reload nginx
```

### 步骤 9：配置 SSL 证书

```bash
# 安装 Certbot
apt install -y certbot python3-certbot-nginx

# 获取 SSL 证书（自动配置 Nginx）
certbot --nginx -d sq.moli123.com --non-interactive --agree-tos -m admin@moli123.com

# 测试自动续期
certbot renew --dry-run

# 设置自动续期（已自动配置）
systemctl status certbot.timer
```

### 步骤 10：启动服务

```bash
cd /opt/geocms-license-server

# 使用 PM2 启动
pm2 start npm --name "license-server" -- start

# 查看状态
pm2 status

# 查看日志
pm2 logs license-server --lines 50

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 复制输出的命令并执行
```

### 步骤 11：配置防火墙

```bash
# 安装 UFW（如果未安装）
apt install -y ufw

# 配置规则
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS

# 启用防火墙
ufw --force enable

# 查看状态
ufw status
```

### 步骤 12：验证部署

```bash
# 1. 检查服务状态
pm2 status

# 2. 测试 API 健康检查
curl https://sq.moli123.com/api/license/info

# 3. 检查 SSL
curl -I https://sq.moli123.com

# 4. 查看日志
pm2 logs license-server --lines 20
tail -f /var/log/nginx/sq.moli123.com-access.log
```

**预期结果**：
- PM2 状态显示为 `online`
- API 返回 JSON 响应
- SSL 证书有效
- 无错误日志

---

## 🎉 部署完成！

### 访问地址

**管理后台**
```
https://sq.moli123.com/license-admin
```
- 用户名: `admin@moli123.com`
- 密码: 您在 `.env` 中设置的密码

**API 端点**
```
https://sq.moli123.com/api/license/*
```

**Prisma Studio**（仅限服务器本地或 SSH 隧道访问）
```bash
# 在服务器上运行
npm run prisma:studio

# 从本地通过 SSH 隧道访问
ssh -L 5556:localhost:5556 root@your-server
# 然后在浏览器访问 http://localhost:5556
```

---

## 🔧 配置客户端

在客户端 GeoCMS 实例的 `.env` 文件中添加：

```env
# 授权服务器地址
LICENSE_SERVER_URL=https://sq.moli123.com

# 禁用本地心跳（推荐，避免服务器崩溃）
DISABLE_LICENSE_HEARTBEAT=true

# 心跳间隔（如果启用心跳）
LICENSE_HEARTBEAT_INTERVAL=3600000
```

---

## 📊 日常运维

### 查看服务状态
```bash
pm2 status
pm2 monit
```

### 查看日志
```bash
# PM2 日志
pm2 logs license-server
pm2 logs license-server --lines 100

# Nginx 日志
tail -f /var/log/nginx/sq.moli123.com-access.log
tail -f /var/log/nginx/sq.moli123.com-error.log
```

### 重启服务
```bash
# 重启 Node.js 应用
pm2 restart license-server

# 重启 Nginx
systemctl restart nginx

# 重启 MySQL
systemctl restart mysql
```

### 更新部署
```bash
cd /opt/geocms-license-server

# 1. 拉取最新代码（如果使用 Git）
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

### 数据库备份
```bash
# 创建备份脚本
cat > /root/backup-license-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/license-db"
mkdir -p $BACKUP_DIR

mysqldump -u license_user -p'YOUR_DB_PASSWORD' geocms_license \
  | gzip > $BACKUP_DIR/license_$DATE.sql.gz

# 保留最近 30 天的备份
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: license_$DATE.sql.gz"
EOF

chmod +x /root/backup-license-db.sh

# 添加到 crontab（每天凌晨2点备份）
crontab -e
# 添加: 0 2 * * * /root/backup-license-db.sh >> /var/log/license-backup.log 2>&1
```

### 恢复数据库
```bash
# 查看备份文件
ls -lh /backup/license-db/

# 恢复（替换日期）
gunzip < /backup/license-db/license_20241228_020000.sql.gz \
  | mysql -u license_user -p'YOUR_DB_PASSWORD' geocms_license
```

---

## 🛡️ 安全检查清单

- [ ] 修改了默认管理员密码
- [ ] 配置了强密码策略
- [ ] 启用了 HTTPS 和 SSL 证书
- [ ] 配置了防火墙规则
- [ ] 限制了 API 访问频率
- [ ] 启用了访问日志
- [ ] 配置了数据库自动备份
- [ ] 限制了 MySQL 远程访问
- [ ] 配置了 CORS 白名单
- [ ] 设置了环境变量保护

---

## 🆘 故障排查

### 问题1：无法访问管理后台

**检查**：
```bash
# 1. 检查服务状态
pm2 status

# 2. 检查端口监听
netstat -tlnp | grep 4000

# 3. 检查 Nginx 配置
nginx -t
systemctl status nginx

# 4. 检查防火墙
ufw status
```

### 问题2：API 返回 500 错误

**检查**：
```bash
# 查看应用日志
pm2 logs license-server --lines 100

# 查看数据库连接
mysql -u license_user -p'YOUR_DB_PASSWORD' -e "USE geocms_license; SHOW TABLES;"

# 检查环境变量
cat .env | grep DATABASE_URL
```

### 问题3：SSL 证书问题

**检查**：
```bash
# 查看证书状态
certbot certificates

# 强制续期
certbot renew --force-renewal

# 查看 Nginx SSL 配置
cat /etc/nginx/sites-available/sq.moli123.com | grep ssl
```

---

## 📞 技术支持

- 文档位置: `/opt/geocms-license-server/docs/`
- 日志位置: `/var/log/nginx/` 和 `pm2 logs`
- 配置文件: `/opt/geocms-license-server/.env`

---

**部署完成时间**: 约 15-20 分钟  
**首次登录**: https://sq.moli123.com/license-admin  
**技术栈**: Next.js 14 + Prisma + MySQL + Nginx + PM2

🎊 恭喜！授权服务器部署完成！
