#!/bin/bash

# 定义日志文件
LOG_FILE="update.log"

# 重定向标准输出和错误输出到日志文件
exec > >(tee -a "$LOG_FILE") 2>&1

echo "============================================"
echo "Update started at $(date)"
echo "============================================"

REPO_URL="https://moligeo:8f7c9427cb009da1ab7a4229fad6212b@gitee.com/yang1-tao22222/moligeocms.git"

# 0. Ensure git remote is correct (redundancy)
git remote set-url origin "$REPO_URL" || git remote add origin "$REPO_URL"

# 1. Fetch latest code
echo "[1/5] Fetching latest code..."
git config --global --add safe.directory $(pwd)
git fetch --all
git reset --hard origin/master

if [ $? -ne 0 ]; then
    echo "Error: Failed to pull code."
    exit 1
fi

# =========================================================
# Standard (Host/PM2) Update Flow - PRIORITIZED
# =========================================================

# 2. Install Dependencies
echo "[2/5] Installing dependencies..."

# 清除缓存强制更新依赖
rm -rf package-lock.json
# 强制安装 typescript 以解决 Module not found 问题 (防止生产环境 NODE_ENV=production 导致 dev依赖丢失)
npm install typescript @types/node --no-save

# 再次强制安装 bcryptjs，确保它肯定存在
npm install bcryptjs
# 显式安装 typescript 和相关依赖，确保 build 时能正确解析 next.config.ts
npm install
# 强制安装 typescript 以解决 Module not found 问题 (防止生产环境 NODE_ENV=production 导致 dev依赖丢失)
npm install typescript @types/node --no-save

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies."
    exit 1
fi

# 3. Database Update
echo "[3/5] Updating database schema..."
npx prisma generate
npx prisma db push

# ⚠️ 0. 环境准备：强制设置 PATH 和内存限制
export PATH=$PATH:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
# 尝试查找并添加 npm/node 路径（兼容 nmm/nvm）
if [ -d "/www/server/nodejs" ]; then
    export PATH=$PATH:$(find /www/server/nodejs -name bin -type d | head -n 1)
fi
# 解锁 V8 内存限制，防止构建 OOM
export NODE_OPTIONS="--max-old-space-size=4096"

# 3.5 Stop & Delete service (完全复刻手动成功步骤)
echo "[3.5/5] Stopping and deleting service to free up memory..."
# 不再隐藏输出，以便调试
pm2 delete geocms || echo "Service not running or delete failed (ignoring)"

# 重要：清除 Next.js 构建缓存
echo "Clearing Next.js cache..."
rm -rf .next

# 4. Build
echo "[4/5] Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed."
    exit 1
fi


# 5. Start Service (全新启动)
echo "[5/5] Starting service..."
pm2 start ecosystem.config.js
pm2 save

echo "Update completed successfully!"

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
exit 0
