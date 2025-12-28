# 🚀 GeoCMS 宝塔部署 - 快速参考

---

## ⚡ 快速步骤

### 1. 环境准备 (5分钟)
```bash
# 安装Node.js 20
宝塔面板 → 软件商店 → Node版本管理器 → 安装Node 20

# 安装PM2
npm install -g pm2
```

### 2. 数据库创建 (2分钟)
```
宝塔 → 数据库 → 添加
数据库1: cms (主数据)
数据库2: cmslicense (授权数据)
```

### 3. 上传代码 (5分钟)
```bash
cd /www/wwwroot
# 上传或克隆代码
git clone your-repo
# 或上传zip解压
```

### 4. 配置环境 (3分钟)
```bash
cd geocms
cp .env.example .env
nano .env  # 配置数据库等信息
```

### 5. 安装构建 (15-20分钟)
```bash
npm install
npm run build
```

### 6. 数据库初始化 (2分钟)
```bash
npx prisma db push
npx prisma db push --schema=prisma/schema.license.prisma
```

### 7. 启动应用 (1分钟)
```bash
pm2 start npm --name geocms -- start
pm2 save
pm2 startup
```

### 8. 配置域名 (5分钟)
```
宝塔 → 网站 → 添加
反向代理 → http://127.0.0.1:3000
SSL → 申请Let's Encrypt
```

---

## 📝 必需配置

### .env 必填项
```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
DATABASE_URL="mysql://user:pass@localhost:3306/cms"
LICENSE_DATABASE_URL="mysql://user:pass@localhost:3306/cmslicense"
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=生成的随机字符串
```

### 生成Secret
```bash
openssl rand -base64 32
```

---

## 🔧 常用命令

### PM2管理
```bash
pm2 status          # 查看状态
pm2 logs geocms     # 查看日志
pm2 restart geocms  # 重启
pm2 stop geocms     # 停止
```

### 更新部署
```bash
cd /www/wwwroot/geocms
git pull
npm install
npm run build
pm2 restart geocms
```

---

## ⚠️ 常见问题

### 端口占用
```bash
lsof -i :3000
kill -9 [PID]
```

### 数据库连接失败
```bash
# 检查用户名密码
# 检查.env配置
mysql -u cms -p -h localhost
```

### 构建内存不足
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 文件权限
```bash
chmod -R 755 /www/wwwroot/geocms
chmod -R 777 /www/wwwroot/geocms/public/uploads
chown -R www:www /www/wwwroot/geocms
```

---

## 📞 检查清单

部署前检查:
- [ ] Node.js 18+ 已安装
- [ ] MySQL 已运行
- [ ] 数据库已创建
- [ ] 域名已解析

部署后检查:
- [ ] PM2 状态正常 (pm2 status)
- [ ] 端口3000运行 (netstat -tunlp | grep 3000)
- [ ] 网站可访问 (https://your-domain.com)
- [ ] SSL证书有效

---

**详细文档**: `DEPLOYMENT_BAOTA.md`

**预计总时间**: 40-50分钟

**成功访问**: https://your-domain.com 🎉
