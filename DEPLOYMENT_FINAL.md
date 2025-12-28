# 🚀 GeoCMS 服务器部署最终可靠指南 (2025版)

针对您在部署过程中遇到的 **Node版本、权限、Puppeteer下载、502错误** 等问题，这份指南提供了最稳妥的解决方案。

---

## 🛠️ 第一步：环境基准线 (Node 20)

GeoCMS 使用 Next.js 16，必须使用 **Node.js 20** 或更高版本。

1. **升级 Node**:
   ```bash
   # 使用 n 模块升级 (最快)
   npm install -g n --registry=https://registry.npmmirror.com
   NODE_MIRROR=https://npmmirror.com/mirrors/node n 20
   hash -r
   node -v # 必须显示 v20.x
   ```

2. **全局跳过驱动下载** (解决 Puppeteer 报错):
   ```bash
   echo 'export PUPPETEER_SKIP_DOWNLOAD=true' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## 📦 第二步：代码与依赖修复

1. **进入项目目录**:
   ```bash
   cd /www/wwwroot/geocms
   ```

2. **强力修复权限** (彻底解决 Permission Denied):
   ```bash
   chown -R root:root .
   chmod -R 755 .
   # 确保二进制执行文件有权限
   chmod +x node_modules/.bin/*
   ```

3. **重新安装依赖** (使用镜像源):
   ```bash
   npm config set registry https://registry.npmmirror.com
   npm install
   ```

---

## 💾 第三步：数据库与配置

1. **检查 .env**:
   确保 `DATABASE_URL` 正确（如果是本地数据库，优先使用 `127.0.0.1` 而非 `localhost`）。

2. **同步数据库结构**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

---

## 🏗️ 第四步：生产构建 (核心环节)

由于 Next.js 构建很吃内存，建议在构建前确保服务器有足够的 Swap 空间，并使用以下命令：

```bash
# 增加 Node 内存限制并开始构建
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

**⚠️ 检查点**: 必须看到 `✓ Compiled successfully`。如果这一步报错，网站永远会出现 502。

---

## 🚀 第五步：使用 PM2 启动服务

使用我为您创建的 `ecosystem.config.js` 进行管理。

```bash
# 1. 彻底删除旧任务
pm2 delete geocms || true

# 2. 启动新任务
pm2 start ecosystem.config.js

# 3. 设置开机自启
pm2 save
pm2 startup
```

---

## 🌐 第六步：Nginx 反向代理 (宝塔配置)

既然 `nginx -t` 是成功的，请确保您的网站“反向代理”设置如下：

1. **代理名称**: `geocms`
2. **目标 URL**: `http://127.0.0.1:3000`
3. **内容替换**: 
   在 Nginx 配置中确保有以下头信息（宝塔默认会加）：
   ```nginx
   proxy_set_header Host $host;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   ```

---

## 🔍 重大故障排查清单

| 症状 | 检查项目 |
| :--- | :--- |
| **502 Bad Gateway** | 执行 `netstat -tunlp \| grep 3000`。如果没有输出，说明 PM2 挂了，请看 `pm2 logs`。 |
| **构建报错** | 检查 Node 版本是否为 20，并确保执行了 `chmod +x node_modules/.bin/*`。 |
| **页面空白** | 检查 `.env` 中的数据库连接是否被防火墙拦截。建议在服务器执行 `mysql -h 101.126.137.112 -u 用户名 -p` 测试。 |

---

**按照此流程操作，可以解决 99% 的部署问题。**
