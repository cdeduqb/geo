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

# 重要：清除 Next.js 构建缓存
echo "Clearing Next.js cache..."
rm -rf .next

# 4. Build
echo "[4/5] Building application..."
# 此时服务仍在运行，构建可能会占用大量内存。
# 如果此处再次 OOM，唯一的办法是增加物理内存或Swap，因为停止服务会杀掉本脚本。
npm run build
if [ $? -ne 0 ]; then
    echo "Error: Build failed! Service was NOT stopped, so site is still online."
    exit 1
fi

# 5. Reload Service (平滑重载)
echo "[5/5] Reloading service..."

# 授权处理：如果存在旧的 geocms 进程，先将其停止以释放资源
if pm2 list | grep -q "geocms"; then
    echo "Found old process 'geocms', stopping it..."
    pm2 stop geocms 2>/dev/null
    pm2 delete geocms 2>/dev/null
fi

# 尝试重启 molicms，如果不存在则从配置文件启动
pm2 reload molicms --update-env || pm2 start ecosystem.config.js --update-env
pm2 save

# 6. 自动检查并修复 Nginx 配置（需要 root 权限）
echo "[6/6] Checking Nginx configuration..."
if [ -f "scripts/fix-nginx.sh" ]; then
    chmod +x scripts/fix-nginx.sh
    # 尝试以 root 权限运行（如果当前用户是 root 或可以 sudo）
    if [ "$EUID" -eq 0 ]; then
        bash scripts/fix-nginx.sh
    elif command -v sudo &> /dev/null; then
        echo "尝试以 sudo 权限修复 Nginx 配置..."
        sudo bash scripts/fix-nginx.sh
    else
        echo "⚠️ 需要 root 权限配置 Nginx，请手动运行："
        echo "   sudo bash scripts/fix-nginx.sh"
    fi
else
    echo "⚠️ Nginx 修复脚本不存在，跳过"
fi

echo "Update completed successfully!"

echo "============================================"
echo "Update completed successfully at $(date)"
echo "============================================"
exit 0

