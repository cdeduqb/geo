# 🔧 Docker部署错误修复

**错误**: `npm ci` package文件不同步

**已修复**: 使用 `npm install` 代替 `npm ci`

---

## ✅ 解决方案1: 重新部署（推荐）

在服务器上重新上传文件并部署：

```bash
# 1. 从本地重新上传整个geocms文件夹
# 确保包含更新后的:
#   - Dockerfile (已修复)
#   - package-lock.json (已更新)

# 2. 在服务器上重新部署
cd /www/wwwroot/moli123.com/geocms
./deploy-docker.sh
```

---

## ✅ 解决方案2: 服务器上直接修复

如果不想重新上传，在服务器上直接修改：

```bash
cd /www/wwwroot/moli123.com/geocms

# 1. 修改Dockerfile第12行
# 将 RUN npm ci
# 改为 RUN npm install --production=false

# 使用sed命令快速修改:
sed -i 's/RUN npm ci/RUN npm install --production=false/g' Dockerfile

# 2. 添加NEXTAUTH_SECRET
echo 'NEXTAUTH_SECRET='$(openssl rand -base64 32) >> .env

# 3. 重新构建
docker-compose build --no-cache

# 4. 启动
docker-compose up -d

# 5. 等待数据库就绪
sleep 15

# 6. 初始化数据库
docker-compose exec -T app npx prisma db push
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma
```

---

## ⚡ 快速修复命令（复制粘贴）

```bash
cd /www/wwwroot/moli123.com/geocms

# 修复Dockerfile
sed -i 's/RUN npm ci/RUN npm install --production=false/g' Dockerfile

# 添加Secret
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env

# 清理并重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 等待并初始化数据库
sleep 15
docker-compose exec -T app npx prisma db push
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma

echo "✅ 修复完成！访问 http://服务器IP:3000"
```

---

## 📋 检查修复

```bash
# 查看容器状态
docker-compose ps

# 查看应用日志
docker-compose logs -f app

# 访问测试
curl http://localhost:3000
```

---

## 🔍 其他可能的问题

### 问题1: 仍然提示NEXTAUTH_SECRET

**解决**:
```bash
# 查看.env文件
cat .env

# 如果没有NEXTAUTH_SECRET，添加:
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env

# 重启
docker-compose restart app
```

### 问题2: 数据库连接失败

**解决**:
```bash
# 检查MySQL容器
docker-compose ps mysql

# 查看MySQL日志
docker-compose logs mysql

# 等待更长时间让MySQL完全启动
sleep 30

# 重新初始化
docker-compose exec -T app npx prisma db push
```

### 问题3: 端口被占用

**解决**:
```bash
# 查看3000端口使用
lsof -i :3306
lsof -i :3000

# 修改docker-compose.yml中的端口
# ports:
#   - "8080:3000"  # 改用8080
```

---

## ✅ 成功标志

部署成功后应该看到:

```bash
$ docker-compose ps
NAME                IMAGE              STATUS
geocms-app          geocms-app         Up
geocms-mysql        mysql:8.0          Up (healthy)

$ curl http://localhost:3000
# 返回HTML内容
```

---

**建议**: 重新从本地上传完整的geocms文件夹，然后运行 `./deploy-docker.sh`

**问题**: 查看 `docker-compose logs -f app`
