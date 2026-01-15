#!/bin/bash

# ============================================================
# GeoCMS Nginx 配置自动修复脚本
# 功能：检测并自动添加 /uploads/ 静态资源配置
# 用法：bash scripts/fix-nginx.sh
# ============================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取项目根目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "============================================"
echo "🔧 GeoCMS Nginx 配置修复工具"
echo "============================================"

# 1. 检测常见的 Nginx 配置路径
NGINX_CONF_PATHS=(
    "/www/server/panel/vhost/nginx"           # 宝塔面板
    "/etc/nginx/sites-enabled"                 # Ubuntu/Debian
    "/etc/nginx/conf.d"                        # CentOS/RHEL
    "/usr/local/nginx/conf/vhost"              # 自编译 Nginx
)

FOUND_CONF=""
NGINX_DIR=""

for path in "${NGINX_CONF_PATHS[@]}"; do
    if [ -d "$path" ]; then
        # 在该目录下查找包含项目路径的配置文件
        for conf in "$path"/*.conf; do
            if [ -f "$conf" ] && grep -q "moligeocms\|moli123" "$conf" 2>/dev/null; then
                FOUND_CONF="$conf"
                NGINX_DIR="$path"
                break 2
            fi
        done
    fi
done

if [ -z "$FOUND_CONF" ]; then
    echo -e "${YELLOW}⚠️  未自动找到 Nginx 配置文件${NC}"
    echo "请手动指定配置文件路径，或参考 nginx/geocms-uploads.conf 手动添加配置"
    echo ""
    echo "📋 需要添加到 Nginx server {} 块中的配置："
    echo "----------------------------------------"
    cat "$PROJECT_ROOT/nginx/geocms-uploads.conf"
    echo "----------------------------------------"
    exit 1
fi

echo -e "${GREEN}✅ 找到 Nginx 配置文件: $FOUND_CONF${NC}"

# 2. 检查是否已配置 /uploads/
if grep -q "location /uploads/" "$FOUND_CONF"; then
    echo -e "${GREEN}✅ /uploads/ 配置已存在，无需修复${NC}"
    exit 0
fi

echo -e "${YELLOW}⚠️  检测到 /uploads/ 配置缺失，准备自动添加...${NC}"

# 3. 备份原配置
BACKUP_FILE="${FOUND_CONF}.bak.$(date +%Y%m%d%H%M%S)"
cp "$FOUND_CONF" "$BACKUP_FILE"
echo "📦 已备份原配置: $BACKUP_FILE"

# 4. 生成需要插入的配置块
UPLOAD_CONFIG="
    # >>> GeoCMS 自动添加 - 静态上传文件配置 <<<
    location /uploads/ {
        alias ${PROJECT_ROOT}/public/uploads/;
        expires 30d;
        add_header Cache-Control \"public, immutable\";
        add_header Access-Control-Allow-Origin *;
        autoindex off;
    }
    # <<< GeoCMS 配置结束 <<<
"

# 5. 使用 sed 在 "location /" 之前插入配置
# 先尝试在 "location /" 前插入
if grep -q "location /" "$FOUND_CONF"; then
    # 在第一个 location / 之前插入
    sed -i "/location \/ {/i\\$UPLOAD_CONFIG" "$FOUND_CONF" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ 配置已自动添加${NC}"
    else
        echo -e "${RED}❌ 自动插入失败，请手动添加配置${NC}"
        echo "需要添加的配置内容："
        echo "$UPLOAD_CONFIG"
        # 恢复备份
        cp "$BACKUP_FILE" "$FOUND_CONF"
        exit 1
    fi
else
    echo -e "${RED}❌ 无法定位插入点，请手动添加配置${NC}"
    exit 1
fi

# 6. 测试 Nginx 配置
echo "🧪 测试 Nginx 配置..."
nginx -t 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Nginx 配置测试通过${NC}"
    
    # 7. 重载 Nginx
    echo "🔄 重载 Nginx..."
    nginx -s reload
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Nginx 已成功重载${NC}"
        echo ""
        echo "============================================"
        echo -e "${GREEN}🎉 Nginx 配置修复完成！${NC}"
        echo "============================================"
    else
        echo -e "${RED}❌ Nginx 重载失败${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Nginx 配置测试失败，正在恢复备份...${NC}"
    cp "$BACKUP_FILE" "$FOUND_CONF"
    echo "已恢复原配置"
    exit 1
fi
