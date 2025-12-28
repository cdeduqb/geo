# 🚀 GeoCMS - 超简单3步部署

**无需配置Node.js、无需PM2、无需手动安装！**

---

## ⚡ 只需3步，5分钟部署！

### 步骤1: 安装Docker（宝塔面板）
```
1. 打开宝塔面板
2. 软件商店 → 搜索 "Docker"
3. 安装 "Docker管理器"
```

### 步骤2: 上传代码
```
1. 上传整个geocms文件夹到服务器 /www/wwwroot/
2. 或使用Git: git clone your-repo /www/wwwroot/geocms
```

### 步骤3: 一键部署
```bash
cd /www/wwwroot/geocms
chmod +x deploy-docker.sh
./deploy-docker.sh
```

**完成！** 访问 `http://服务器IP:3000`

---

## 📝 配置域名（可选）

部署后访问 `.env` 文件，修改：
```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXTAUTH_URL=https://your-domain.com
```

然后重启：
```bash
docker-compose restart app
```

---

## 🔧 常用命令

```bash
# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启
docker-compose restart

# 停止
docker-compose down

# 更新代码后重新部署
./deploy-docker.sh
```

---

## ✅ 检查清单

- [ ] Docker已安装
- [ ] 代码已上传
- [ ] 运行了deploy-docker.sh
- [ ] 可以访问 http://服务器IP:3000

---

## 📊 vs 传统部署

| 项目 | 传统部署 | Docker部署 |
|------|---------|-----------|
| Node.js安装 | ✓ 需要 | ❌ 不需要 |
| PM2配置 | ✓ 需要 | ❌ 不需要 |
| Nginx配置 | ✓ 需要 | ❌ 不需要 |
| 数据库配置 | ✓ 手动 | ✅ 自动 |
| 环境变量 | ✓ 复杂 | ✅ 简单 |
| 总步骤 | ~20步 | 3步 |
| 总时间 | 40-50分钟 | 5-10分钟 |

---

## 🎉 就这么简单！

**详细文档**: `DEPLOYMENT_DOCKER_SIMPLE.md`

**有问题**: 查看日志 `docker-compose logs -f`
