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

# 2. Install dependencies
echo "[2/5] Installing dependencies..."
npm install

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

# Check for Docker
if [ -f "/.dockerenv" ] || [ -f "docker-compose.yml" ]; then
    echo "Detected Docker environment."
    # Try docker compose first
    if docker compose version &> /dev/null; then
        docker compose restart
    elif docker-compose version &> /dev/null; then
        docker-compose restart
    else
        echo "Warning: Docker detected but compose command not found. Trying to kill node process..."
        pkill -f "next-server"
    fi
# Check for PM2
elif command -v pm2 &> /dev/null; then
    echo "Detected PM2 environment."
    # 优先尝试 reload 以零停机，失败则 restart
    pm2 reload geocms || pm2 restart geocms || pm2 restart all
else
    echo "No process manager (PM2/Docker) found."
    echo "Attempting to find and kill existing Next.js logic..."
    # Warning: This is risky in shared environments
    pkill -f "next-start" || pkill -f "next-server" || echo "No running node process found to kill."
    
    echo "Starting in background..."
    nohup npm start > app.log 2>&1 &
fi

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
