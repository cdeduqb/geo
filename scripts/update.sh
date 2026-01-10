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
# 显式安装 typescript 和相关依赖，确保 build 时能正确解析 next.config.ts
npm install
# 强制安装 typescript 以解决 Module not found 问题
# npm install typescript @types/node ts-node --save-dev

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
npm run build

if [ $? -ne 0 ]; then
    echo "Error: Build failed."
    exit 1
fi

# 5. Restart Service
echo "[5/5] Restarting service..."

# 优先级逻辑：
# 1. 如果检测到 PM2 且有 geocms 进程，优先使用 PM2
# 2. 如果检测到有 node 进程运行，使用 pkill + nohup 重启
# 3. 最后才检查是否有 Docker 配置文件作为兜底

if command -v pm2 &> /dev/null && pm2 list | grep -q "geocms"; then
    echo "Detected PM2 environment (geocms process found)."
    pm2 reload geocms || pm2 restart geocms
elif pgrep -f "next-server" > /dev/null || pgrep -f "next-start" > /dev/null; then
    echo "Detected raw Node.js process."
    pkill -f "next-start" || pkill -f "next-server"
    echo "Restarting with nohup..."
    nohup npm start > app.log 2>&1 &
elif [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ]; then
    # Only try Docker if we didn't find a running Node process
    echo "No running Node process found. Detected Docker configuration."
    if docker compose version &> /dev/null; then
        docker compose up -d --build
    elif docker-compose version &> /dev/null; then
        docker-compose up -d --build
    fi
else
    echo "No process manager found. Starting fresh..."
    nohup npm start > app.log 2>&1 &
fi

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
exit 0
