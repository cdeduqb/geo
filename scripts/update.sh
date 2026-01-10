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

# 2. Strategy Selection (Docker vs Host)
if [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ]; then
    echo "Detected Docker Compose environment."
    echo "[Docker] Skipping host-side npm install/build (will be handled by Docker build)..."
    
    # Database Update (Attempting on host, but might fail if no node/env. Should run inside container ideally, but trying host first is common pattern if node exists)
    # If node is not on host, this will fail. Let's assume if they ran this script, they have bash.
    # Safe to skip db push here? Usually docker entrypoint handles migrations or we run it via docker compose exec.
    # Let's run it via docker compose to be safe.
    
    echo "[Docker] Rebuilding and restarting containers..."
    if docker compose version &> /dev/null; then
        docker compose up -d --build
    elif docker-compose version &> /dev/null; then
        docker-compose up -d --build
    else
        echo "Error: Docker detected but compose command not found."
        exit 1
    fi
    
    echo "============================================"
    echo "Update completed successfully at $(date)"
    echo "============================================"
    exit 0
fi

# =========================================================
# Standard (Host/PM2) Update Flow
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

if command -v pm2 &> /dev/null; then
    echo "Detected PM2 environment."
    # 优先尝试 reload 以零停机，失败则 restart
    pm2 reload geocms || pm2 restart geocms || pm2 restart all
else
    echo "No process manager (PM2) found."
    echo "Attempting to find and kill existing Next.js logic..."
    pkill -f "next-start" || pkill -f "next-server" || echo "No running node process found to kill."
    
    echo "Starting in background..."
    nohup npm start > app.log 2>&1 &
fi

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
