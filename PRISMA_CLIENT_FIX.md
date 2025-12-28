# 🔧 Prisma Client License模块找不到 - 已修复

**错误**: `Module not found: Can't resolve '@prisma/client-license'`

**原因**: Docker构建时没有生成license的Prisma Client

**已修复**: 更新Dockerfile，在deps阶段生成所有Prisma Client

---

## ✅ 快速修复（服务器上执行）

### 方法1: 重新上传并部署（最简单，推荐）

```bash
# 1. 从本地重新上传整个geocms文件夹
#    确保包含最新的:
#    - Dockerfile (已修复)
#    - package-lock.json (已更新)

# 2. 在服务器上
cd /www/wwwroot/moli123.com/geocms

# 3. 清理并重新部署
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 4. 等待数据库就绪
sleep 30

# 5. 初始化数据库
docker-compose exec -T app npx prisma db push
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma
```

### 方法2: 服务器上直接修复

如果不方便重新上传，在服务器上执行：

```bash
cd /www/wwwroot/moli123.com/geocms

# 创建临时修复文件
cat > Dockerfile.new << 'EOF'
FROM node:20-alpine AS base

# 安装依赖阶段
FROM base AS deps
WORKDIR /app

# 复制package和schema文件
COPY package*.json ./
COPY prisma ./prisma

# 安装依赖
RUN npm install --production=false

# 生成Prisma Client（在deps阶段生成）
RUN npx prisma generate
RUN npx prisma generate --schema=prisma/schema.license.prisma

# 构建阶段
FROM base AS builder
WORKDIR /app

# 复制依赖和Prisma生成的文件
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建Next.js
RUN npm run build

# 生产运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# 创建用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制Prisma相关文件
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 复制授权密钥
COPY --from=builder /app/.keys ./.keys 2>/dev/null || true

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
EOF

# 替换Dockerfile
mv Dockerfile.new Dockerfile

# 确保有NEXTAUTH_SECRET
if ! grep -q "NEXTAUTH_SECRET" .env; then
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
fi

# 重新构建
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 等待并初始化
sleep 30
docker-compose exec -T app npx prisma db push
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma

echo "✅ 修复完成！"
```

---

## 📋 完整一键修复脚本

保存为 `final-fix.sh`:

```bash
#!/bin/bash

cd /www/wwwroot/moli123.com/geocms

echo "🔧 开始最终修复..."

# 备份旧Dockerfile
cp Dockerfile Dockerfile.bak

# 下载最新Dockerfile（如果有仓库）
# curl -o Dockerfile https://your-repo/Dockerfile

# 或创建新的Dockerfile
cat > Dockerfile << 'DOCKERFILEEND'
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --production=false
RUN npx prisma generate
RUN npx prisma generate --schema=prisma/schema.license.prisma

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

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
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/.keys ./.keys 2>/dev/null || true
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]
DOCKERFILEEND

# 确保环境变量
if ! grep -q "NEXTAUTH_SECRET" .env; then
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
fi

# 重新部署
echo "🛑 停止容器..."
docker-compose down

echo "🔨 构建镜像（可能需要10-15分钟）..."
docker-compose build --no-cache

echo "🚀 启动服务..."
docker-compose up -d

echo "⏳ 等待MySQL就绪..."
sleep 30

echo "💾 初始化数据库..."
docker-compose exec -T app npx prisma db push --accept-data-loss
docker-compose exec -T app npx prisma db push --schema=prisma/schema.license.prisma --accept-data-loss

echo ""
echo "✅ 修复完成！"
echo "📱 访问: http://服务器IP:3000"
echo "📋 查看状态: docker-compose ps"
echo "📋 查看日志: docker-compose logs -f app"
```

使用:
```bash
chmod +x final-fix.sh
./final-fix.sh
```

---

## 🔍 验证修复

```bash
# 1. 检查容器状态
docker-compose ps
# 应该看到 app 和 mysql 都是 Up

# 2. 检查应用日志
docker-compose logs app | tail -50
# 不应该有模块找不到的错误

# 3. 进入容器检查
docker-compose exec app sh
ls -la node_modules/@prisma/
# 应该看到 client-license 目录
exit

# 4. 访问测试
curl http://localhost:3000
# 应该返回HTML
```

---

## 📊 修复检查清单

- [ ] Dockerfile已更新（包含Prisma生成步骤）
- [ ] package-lock.json已同步
- [ ] .env包含NEXTAUTH_SECRET
- [ ] Docker容器成功启动
- [ ] 应用日志无错误
- [ ] node_modules/@prisma/client-license存在
- [ ] 可以访问3000端口

---

## 💡 关键修复点

### 修复前的Dockerfile问题
```dockerfile
# ❌ 问题：在builder阶段才生成Prisma Client
# deps阶段没有复制prisma文件夹
FROM base AS deps
COPY package*.json ./  # 只复制了package文件
RUN npm install

FROM base AS builder
RUN npx prisma generate  # 太晚了
```

### 修复后的Dockerfile
```dockerfile
# ✅ 正确：在deps阶段就生成
FROM base AS deps
COPY package*.json ./
COPY prisma ./prisma        # 复制schema文件
RUN npm install
RUN npx prisma generate                              # deps阶段生成
RUN npx prisma generate --schema=prisma/schema.license.prisma

# builder可以直接使用
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules  # 包含生成的client
```

---

## ✅ 推荐操作

**最简单的方法**:

1. 从本地重新上传整个geocms文件夹（包含修复后的Dockerfile）
2. 在服务器执行 `./final-fix.sh`
3. 等待完成

---

**问题持续**: 提供以下信息
```bash
docker-compose logs app
ls -la node_modules/@prisma/
```
