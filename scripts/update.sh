#!/bin/bash
# scripts/update.sh

# 确保脚本发生错误时停止
set -e

# 日志颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}[Update] Starting update process...${NC}"
echo "Current directory: $(pwd)"

# 1. 检查是否为 Docker 环境
IS_DOCKER=0
if [ -f /.dockerenv ]; then
    IS_DOCKER=1
    echo -e "${GREEN}[Update] Docker environment detected.${NC}"
fi

# 2. 设置 Git 远程 URL (含认证信息) 并拉取代码
# 注意：这里硬编码了凭证，请确保此脚本权限正确 (700)
GIT_REPO="https://moligeo:8f7c9427cb009da1ab7a4229fad6212b@gitee.com/yang1-tao22222/moligeocms.git"

echo -e "${GREEN}[Update] Fetching latest code...${NC}"
# 防止 git 目录所有权问题
git config --global --add safe.directory $(pwd) || true

# 设置 remote (如果已存在则覆盖，如果不存在则添加)
if git remote | grep -q "^origin$"; then
    git remote set-url origin "$GIT_REPO"
else
    git remote add origin "$GIT_REPO"
fi

git fetch --all
git reset --hard origin/master

# 3. 安装依赖和数据库同步
echo -e "${GREEN}[Update] Installing dependencies...${NC}"
npm install

echo -e "${GREEN}[Update] Updating database schema...${NC}"
npx prisma generate
npx prisma db push

# 4. 构建项目
echo -e "${GREEN}[Update] Building project...${NC}"
npm run build

# 5. 重启服务
echo -e "${GREEN}[Update] Restarting service...${NC}"

if [ "$IS_DOCKER" -eq 1 ]; then
    # Docker 环境
    if command -v pm2 &> /dev/null; then
        echo "PM2 found in Docker, reloading..."
        pm2 reload geocms || pm2 start ecosystem.config.js
    else
        # 如果没有 PM2，尝试退出进程 (前提是 Docker 设置了 restart: always)
        echo -e "${GREEN}[Update] No PM2 found in Docker. Exiting process to trigger Docker restart...${NC}"
        # 尝试杀掉 Node 进程 (通常 PID 1 是入口脚本)
        kill 1 || exit 0
    fi
else
    # 常规 PM2 环境
    if command -v pm2 &> /dev/null; then
        pm2 reload geocms || pm2 start ecosystem.config.js
    else
        echo -e "${RED}[Error] PM2 not found. Cannot auto-restart.${NC}"
        # 尝试直接使用 npm start (不推荐，但作为 fallback)
        # nohup npm start &
        exit 1
    fi
fi

echo -e "${GREEN}[Update] Update completed successfully!${NC}"
