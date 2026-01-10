# GeoCMS 宝塔面板部署指南（低内存服务器优化版）

## 服务器要求

- **最低配置**: 1核 1GB 内存
- **推荐配置**: 2核 2GB 内存
- **操作系统**: CentOS 7+ / Ubuntu 18.04+
- **Node.js**: 18.x 或 20.x

---

## 一、服务器环境准备

### 1.1 在宝塔面板安装软件

进入宝塔面板 → 软件商店，安装以下软件：

- **Nginx** (推荐 1.24+) - 用于反向代理
- **MySQL** (5.7+ 或 8.0) - 数据库
- **PM2 管理器** - Node.js 进程管理

### 1.2 安装 Node.js

宝塔面板 → 软件商店 → 搜索 "Node.js版本管理器" → 安装

安装完成后：
1. 打开 Node.js 版本管理器
2. 安装 Node.js 20.x 版本
3. 设置为默认版本

或者通过命令行安装：
```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20
```

### 1.3 配置 Swap 交换空间（重要！低内存必做）

如果服务器内存小于 2GB，强烈建议配置 Swap：

```bash
# 检查是否已有 swap
free -h

# 如果没有 swap，创建 2GB swap 文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 持久化 swap（重启后生效）
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 调整 swappiness（建议值 10-30）
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 二、项目部署

### 2.1 上传项目代码

方法一：使用宝塔文件管理器上传 zip 压缩包

方法二：使用 Git 克隆
```bash
cd /www/wwwroot
git clone <你的仓库地址> geocms
```

### 2.2 安装依赖

```bash
cd /www/wwwroot/geocms

# 安装依赖
npm install --production=false

# 生成 Prisma 客户端
npx prisma generate
```

### 2.3 配置环境变量

创建 `.env` 文件：

```bash
nano /www/wwwroot/geocms/.env
```

内容示例：
```env
# 数据库配置
DATABASE_URL="mysql://用户名:密码@localhost:3306/geocms"

# 站点 URL（必须配置正确）
NEXT_PUBLIC_SITE_URL="https://your-domain.com"

# 允许的来源域名
ALLOWED_ORIGINS="your-domain.com,www.your-domain.com"

# Session 密钥（随机字符串）
SESSION_SECRET="your-random-secret-key-here"

# Node 环境
NODE_ENV="production"
```

### 2.4 初始化数据库

```bash
cd /www/wwwroot/geocms

# 推送数据库结构
npx prisma db push

# 可选：运行种子数据
npx prisma db seed
```

### 2.5 构建项目（重要）

```bash
cd /www/wwwroot/geocms

# 构建生产版本
npm run build
```

> ⚠️ **注意**: 构建过程内存占用较大，如果构建失败，可以：
> 1. 在本地构建后上传 `.next` 目录
> 2. 或临时增加 swap 空间

### 2.6 复制静态资源到 standalone

```bash
# 复制 public 目录
cp -r public .next/standalone/

# 复制静态文件
cp -r .next/static .next/standalone/.next/
```

---

## 三、PM2 启动服务

### 3.1 全局安装 PM2

```bash
npm install -g pm2
```

### 3.2 使用配置文件启动

```bash
cd /www/wwwroot/geocms

# 启动服务
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs geocms

# 保存进程列表（开机自启）
pm2 save
pm2 startup
```

### 3.3 常用 PM2 命令

```bash
# 查看状态
pm2 status

# 查看日志
pm2 logs geocms

# 重启服务
pm2 restart geocms

# 停止服务
pm2 stop geocms

# 删除服务
pm2 delete geocms

# 监控资源
pm2 monit
```

---

## 四、Nginx 反向代理配置

### 4.1 在宝塔面板创建网站

1. 进入 网站 → 添加站点
2. 填写域名
3. PHP版本选择 "纯静态"
4. 创建站点

### 4.2 配置 Nginx 反向代理

点击站点 → 设置 → 配置文件，替换为：

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 配置（使用宝塔申请的证书）
    ssl_certificate /www/server/panel/vhost/cert/your-domain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;
    
    # 强制 HTTPS
    if ($scheme = http) {
        return 301 https://$host$request_uri;
    }
    
    # 日志
    access_log /www/wwwlogs/your-domain.com.log;
    error_log /www/wwwlogs/your-domain.com.error.log;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;
    gzip_comp_level 6;
    
    # 静态文件缓存
    location /_next/static {
        alias /www/wwwroot/geocms/.next/static;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
    
    location /public {
        alias /www/wwwroot/geocms/public;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }
    
    # 反向代理到 Node.js
    location / {
        proxy_pass http://127.0.0.1:3000;
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
}
```

### 4.3 测试并重载 Nginx

```bash
# 测试配置
nginx -t

# 重载配置
nginx -s reload
```

---

## 五、低内存优化建议

### 5.1 Node.js 内存限制

在 `ecosystem.config.js` 中已配置：
- `max_memory_restart: '400M'` - 超过 400MB 自动重启
- `NODE_OPTIONS: '--max-old-space-size=384'` - 限制堆内存

根据您的服务器内存调整：

| 服务器内存 | max_memory_restart | max-old-space-size |
|-----------|-------------------|-------------------|
| 1 GB      | 300M              | 256               |
| 2 GB      | 500M              | 384               |
| 4 GB      | 1000M             | 768               |

### 5.2 MySQL 内存优化

在宝塔面板 → MySQL → 配置修改：

```ini
[mysqld]
# 1GB 内存服务器推荐配置
innodb_buffer_pool_size = 128M
innodb_log_buffer_size = 8M
key_buffer_size = 16M
max_connections = 50
table_open_cache = 200
```

### 5.3 Nginx 优化

```nginx
# 减少 worker 进程数
worker_processes 1;

# 减少每个 worker 的连接数
events {
    worker_connections 512;
}
```

---

## 六、常见问题

### Q1: 构建时内存不足

**解决方案**:
1. 在本地电脑构建，然后上传 `.next` 目录
2. 或临时增加 swap 空间（构建完成后可删除）

### Q2: 服务启动后自动重启

**检查方法**:
```bash
pm2 logs geocms
```

常见原因：
- 内存超限 → 调低 `max_memory_restart`
- 数据库连接失败 → 检查 `.env` 中的 `DATABASE_URL`
- 端口被占用 → 更换端口或 kill 占用进程

### Q3: 502 Bad Gateway

**解决方案**:
1. 检查 PM2 服务是否正常运行：`pm2 status`
2. 检查 Node.js 是否监听 3000 端口：`netstat -tlnp | grep 3000`
3. 检查 Nginx 配置中的 proxy_pass 地址

### Q4: 访问很慢

**优化建议**:
1. 开启 Nginx Gzip 压缩
2. 配置静态文件缓存
3. 使用 CDN 加速静态资源

---

## 七、更新部署

```bash
cd /www/wwwroot/geocms

# 拉取最新代码（如果使用 Git）
git pull

# 安装依赖
npm install

# 重新构建
npm run build

# 复制静态资源
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

# 重启服务
pm2 restart geocms
```

---

## 八、部署检查清单

- [ ] Node.js 20.x 已安装
- [ ] Swap 已配置（1GB 内存必须）
- [ ] MySQL 数据库已创建
- [ ] `.env` 配置正确
- [ ] `npm run build` 成功
- [ ] 静态资源已复制到 standalone
- [ ] PM2 服务已启动
- [ ] Nginx 反向代理已配置
- [ ] SSL 证书已配置
- [ ] 开机自启已设置 (`pm2 save && pm2 startup`)
