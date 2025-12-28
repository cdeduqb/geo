# 🚀 GeoCMS 宝塔面板部署完整指南

**文档时间**: 2025-12-25  
**适用版本**: GeoCMS 1.0+  
**服务器环境**: 宝塔面板

---

## 📋 目录

1. [环境准备](#环境准备)
2. [数据库配置](#数据库配置)
3. [代码部署](#代码部署)
4. [环境配置](#环境配置)
5. [构建启动](#构建启动)
6. [域名配置](#域名配置)
7. [常见问题](#常见问题)

---

## 🔧 环境准备

### 1. 安装Node.js

**在宝塔面板中**:
```
软件商店 → 搜索 "Node" → 安装 "Node版本管理器"
→ 安装 Node.js 18.x 或 20.x
```

**或通过SSH命令行**:
```bash
# 使用nvm安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# 安装Node.js 20
nvm install 20
nvm use 20
nvm alias default 20
```

**验证安装**:
```bash
node -v  # 应该显示 v20.x.x
npm -v   # 应该显示 10.x.x
```

### 2. 安装PM2

```bash
npm install -g pm2
pm2 -v  # 验证安装
```

### 3. 安装Git（如果未安装）

```bash
yum install git -y  # CentOS/RHEL
# 或
apt install git -y  # Debian/Ubuntu
```

---

## 💾 数据库配置

### 1. 在宝塔创建数据库

**主数据库**:
```
宝塔面板 → 数据库 → 添加数据库
数据库名: cms
用户名: cms
密码: [自动生成或自定义]
访问权限: 本地服务器
```

**授权数据库**:
```
数据库名: cmslicense
用户名: cmslicense  
密码: [自动生成或自定义]
访问权限: 所有人（或指定IP）
```

### 2. 记录数据库信息

```
主数据库:
  Host: localhost (或 127.0.0.1)
  Port: 3306
  Database: cms
  Username: cms
  Password: xxxxxxxx

授权数据库:
  Host: localhost (或远程IP)
  Port: 3306
  Database: cmslicense
  Username: cmslicense
  Password: xxxxxxxx
```

---

## 📦 代码部署

### 方法1: Git克隆（推荐）

```bash
# 进入网站目录
cd /www/wwwroot

# 克隆代码
git clone https://github.com/your-repo/geocms.git
cd geocms

# 或者如果已有代码，上传压缩包后解压
# unzip geocms.zip
# cd geocms
```

### 方法2: 宝塔文件管理器上传

```
1. 在本地打包: zip -r geocms.zip .
2. 宝塔面板 → 文件 → 上传
3. 上传到 /www/wwwroot/
4. 解压
```

### 3. 设置目录权限

```bash
cd /www/wwwroot/geocms

# 设置所有者
chown -R www:www .

# 设置权限
chmod -R 755 .
chmod -R 777 .next  # 如果存在
chmod -R 777 uploads  # 上传目录
```

---

## ⚙️ 环境配置

### 1. 安装依赖

```bash
cd /www/wwwroot/geocms

# 安装依赖（可能需要10-20分钟）
npm install

# 如果遇到网络问题，使用国内镜像
npm config set registry https://registry.npmmirror.com
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
# 或使用宝塔文件管理器编辑
```

**.env 配置内容**:

```env
# 网站基础配置
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# 主数据库（CMS数据）
DATABASE_URL="mysql://cms:密码@localhost:3306/cms"

# 授权数据库
LICENSE_DATABASE_URL="mysql://cmslicense:密码@localhost:3306/cmslicense"

# NextAuth配置
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-random-secret-here  # 生成随机字符串

# AI配置（根据需要）
DEEPSEEK_API_KEY=your_key_here
VOLCANO_API_KEY=your_key_here
# ... 其他AI配置

# 文件上传配置
UPLOAD_DIR=/www/wwwroot/geocms/public/uploads
MAX_FILE_SIZE=10485760
```

**生成NEXTAUTH_SECRET**:
```bash
openssl rand -base64 32
```

### 3. 初始化数据库

```bash
# 生成Prisma Client
npx prisma generate

# 同步主数据库
npx prisma db push

# 同步授权数据库
npx prisma db push --schema=prisma/schema.license.prisma

# 创建初始管理员（如果有seed脚本）
npm run seed
```

---

## 🏗️ 构建启动

### 1. 构建项目

```bash
cd /www/wwwroot/geocms

# 构建生产版本
npm run build

# 如果构建失败，检查内存
# 在宝塔面板增加swap或临时增加内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 2. 使用PM2启动

**创建PM2配置文件**: `ecosystem.config.js`

```javascript
module.exports = {
  apps: [{
    name: 'geocms',
    script: 'npm',
    args: 'start',
    cwd: '/www/wwwroot/geocms',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

**启动应用**:

```bash
# 创建日志目录
mkdir -p logs

# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs geocms

# 设置开机自启
pm2 startup
pm2 save
```

**PM2常用命令**:
```bash
pm2 restart geocms   # 重启
pm2 stop geocms      # 停止
pm2 delete geocms    # 删除
pm2 logs geocms      # 查看日志
pm2 monit           # 监控
```

---

## 🌐 域名配置

### 1. 在宝塔创建网站

```
网站 → 添加站点
域名: your-domain.com
根目录: /www/wwwroot/geocms  
PHP版本: 纯静态
```

### 2. 配置反向代理

**在宝塔面板**:
```
网站设置 → 反向代理 → 添加反向代理

代理名称: geocms
目标URL: http://127.0.0.1:3000
发送域名: $host
```

**手动配置（可选）**:

编辑Nginx配置: `/www/server/panel/vhost/nginx/your-domain.conf`

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL证书
    ssl_certificate /www/server/panel/vhost/cert/your-domain/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain/privkey.pem;
    
    # 根目录（Next.js不需要，只是占位）
    root /www/wwwroot/geocms;
    
    # 反向代理到Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # 静态文件（可选优化）
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
    
    # 上传文件
    location /uploads {
        alias /www/wwwroot/geocms/public/uploads;
        expires 30d;
    }
}
```

**重载Nginx**:
```bash
nginx -t  # 测试配置
nginx -s reload  # 重载
```

### 3. 配置SSL证书

**方法1: 宝塔面板（推荐）**:
```
网站设置 → SSL → Let's Encrypt → 申请
```

**方法2: 手动上传证书**:
```
网站设置 → SSL → 其他证书 → 粘贴证书内容
```

---

## 🔄 更新部署

### 代码更新流程

```bash
cd /www/wwwroot/geocms

# 1. 拉取最新代码
git pull origin main

# 2. 安装新依赖
npm install

# 3. 数据库迁移（如果有）
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma

# 4. 重新构建
npm run build

# 5. 重启应用
pm2 restart geocms

# 6. 查看日志确认
pm2 logs geocms --lines 50
```

---

## 🐛 常见问题

### 1. 端口被占用

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决**:
```bash
# 查找占用端口的进程
lsof -i :3000

# 杀死进程
kill -9 [PID]

# 或更换端口
# 修改 ecosystem.config.js 中的 PORT
```

### 2. 数据库连接失败

**问题**: `Can't connect to MySQL server`

**解决**:
```bash
# 检查MySQL是否运行
systemctl status mysqld

# 测试连接
mysql -u cms -p -h localhost

# 检查.env中的连接字符串
# 确保密码、端口正确
```

### 3. 构建内存不足

**问题**: `JavaScript heap out of memory`

**解决**:
```bash
# 方法1: 增加内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# 方法2: 创建swap
dd if=/dev/zero of=/swapfile bs=1M count=2048
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
```

### 4. PM2无法启动

**问题**: 应用启动后立即退出

**解决**:
```bash
# 查看详细错误
pm2 logs geocms --err

# 直接运行查看错误
cd /www/wwwroot/geocms
npm start

# 检查环境变量
pm2 env geocms
```

### 5. 文件上传失败

**问题**: 上传文件403或500错误

**解决**:
```bash
# 创建上传目录
mkdir -p /www/wwwroot/geocms/public/uploads

# 设置权限
chmod -R 777 /www/wwwroot/geocms/public/uploads
chown -R www:www /www/wwwroot/geocms/public/uploads
```

### 6. Nginx 502错误

**问题**: Bad Gateway

**解决**:
```bash
# 检查Next.js是否运行
pm2 status

# 检查端口
netstat -tunlp | grep 3000

# 查看Nginx错误日志
tail -f /www/wwwlogs/your-domain.error.log
```

---

## 📊 性能优化

### 1. PM2集群模式

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'geocms',
    script: 'npm',
    args: 'start',
    instances: 'max',  // 使用所有CPU核心
    exec_mode: 'cluster',
    // ... 其他配置
  }]
};
```

### 2. Nginx缓存优化

```nginx
# 在http块中添加
proxy_cache_path /tmp/nginx_cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

# 在server块中使用
location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 10m;
    # ...
}
```

### 3. 数据库优化

```bash
# 宝塔面板 → 数据库 → 性能调整
# 或编辑 /etc/my.cnf

[mysqld]
innodb_buffer_pool_size = 256M
max_connections = 200
query_cache_size = 32M
```

---

## ✅ 部署检查清单

### 环境检查
- [ ] Node.js 18+ 已安装
- [ ] PM2 已安装
- [ ] MySQL 已运行
- [ ] 数据库已创建
- [ ] 权限已设置

### 配置检查
- [ ] .env 文件已配置
- [ ] 数据库连接正常
- [ ] NEXTAUTH_SECRET 已设置
- [ ] NEXT_PUBLIC_SITE_URL 正确

### 构建检查
- [ ] npm install 成功
- [ ] npm run build 成功
- [ ] Prisma 已生成

### 启动检查
- [ ] PM2 启动成功
- [ ] 应用运行在3000端口
- [ ] 可访问 http://localhost:3000

### 域名检查
- [ ] 域名已解析
- [ ] Nginx反向代理已配置
- [ ] SSL证书已安装
- [ ] HTTPS访问正常

---

## 🎯 快速部署脚本

创建 `deploy.sh`:

```bash
#!/bin/bash

echo "开始部署GeoCMS..."

# 进入项目目录
cd /www/wwwroot/geocms

# 拉取最新代码
echo "1. 拉取代码..."
git pull origin main

# 安装依赖
echo "2. 安装依赖..."
npm install

# 数据库同步
echo "3. 同步数据库..."
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma

# 构建
echo "4. 构建项目..."
npm run build

# 重启
echo "5. 重启应用..."
pm2 restart geocms

# 查看状态
echo "6. 检查状态..."
pm2 status

echo "部署完成！"
echo "访问: https://your-domain.com"
```

**使用**:
```bash
chmod +x deploy.sh
./deploy.sh
```

---

## 📞 获取帮助

**日志位置**:
- PM2日志: `/www/wwwroot/geocms/logs/`
- Nginx日志: `/www/wwwlogs/`
- MySQL日志: `/www/server/data/`

**调试命令**:
```bash
# 实时查看PM2日志
pm2 logs geocms --lines 100

# 查看Nginx错误
tail -f /www/wwwlogs/your-domain.error.log

# 测试数据库连接
mysql -u cms -p -h localhost cms
```

---

**GeoCMS宝塔部署指南完成！** 🎉

**下一步**: 访问您的域名，开始使用GeoCMS！
