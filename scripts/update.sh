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

# 4. Build
echo "[4/5] Building application..."

# 重要：清除 Next.js 构建缓存，确保完全重新构建
echo "Clearing Next.js cache..."
rm -rf .next
rm -rf node_modules/.cache

npm run build

if [ $? -ne 0 ]; then
    echo "Error: Build failed."
    exit 1
fi

# 5. Restart Service
echo "[5/5] Restarting service..."

# 接收父进程 PID (可选参数，由 API 传入)
PARENT_PID=$1

if command -v pm2 &> /dev/null && pm2 list | grep -q "geocms"; then
    echo "Detected PM2 environment (geocms process found)."
    pm2 reload geocms || pm2 restart geocms
else
    # 非 PM2 环境，尝试通过 PID 或进程名终止
    echo "Stopping existing process..."
    
    if [ ! -z "$PARENT_PID" ]; then
        echo "Killing parent process PID: $PARENT_PID"
        kill -9 "$PARENT_PID" 2>/dev/null
    fi

    # 兜底：杀掉可能存在的其他同名进程
    pkill -f "next-start" || pkill -f "next-server"
    sleep 3
    
    # 再次检查是否有 Docker 配置且无 Node 进程，作为最后的兜底
    if [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ]; then
         # 检查是否还有残留 Node 进程
         if ! pgrep -f "next-server" > /dev/null && ! pgrep -f "next-start" > /dev/null; then
             : # Pass
         fi
    fi

    echo "Restarting with nohup..."
    nohup npm start > app.log 2>&1 &
fi

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
exit 0
