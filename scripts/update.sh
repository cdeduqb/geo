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
    # 注意：这里逻辑是，如果杀完了发现还有 Docker，且之前不是 PM2，那可能用户想用 Docker
    # 但由于我们之前优先杀 Node，这里只有在一种很边缘的情况下（用户既有 Docker 又手动跑了 Node）会走到这
    # 简化逻辑：只要没有运行中的 Node 进程了，且有 Docker 文件，就尝试 Docker。
    # 否则直接 nohup 启动。
    
    if [ -f "docker-compose.yml" ] || [ -f "docker-compose.yaml" ]; then
         # 检查是否还有残留 Node 进程
         if ! pgrep -f "next-server" > /dev/null && ! pgrep -f "next-start" > /dev/null; then
             # 只有确信没有 Node 进程在跑了，才去动 Docker，防止 Docker 和本地进程打架
             # 但为了稳妥，如果用户之前是手动跑的，我们还是优先手动启动
             # 只有当没有任何迹象表明用户在手动跑时（比如第一次），才去管 Docker?
             # 不，我们保持简单：之前已经在运行 Node 了（被我们杀掉了），那我们就继续用 Node 启动。
             : # Pass，继续往下走 nohup
         fi
    fi

    echo "Restarting with nohup..."
    nohup npm start > app.log 2>&1 &
fi

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
exit 0
