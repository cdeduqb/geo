#!/bin/bash

# ============================================================
# GeoCMS Nginx 配置自动修复脚本 (完全自动化版本)
# 功能：自动检测并添加 /uploads/ 静态资源配置
# 用法：sudo bash scripts/fix-nginx.sh [域名]
# 自动化：从 .env 读取 SITE_DOMAIN 配置，无需交互
# ============================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 获取项目根目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo ""
echo "============================================"
echo -e "${BLUE}🔧 GeoCMS Nginx 配置修复工具 v4.0${NC}"
echo "    (完全自动化版本)"
echo "============================================"

# 获取上传目录路径
UPLOADS_PATH="$PROJECT_ROOT/public/uploads"

# 确保上传目录存在
if [ ! -d "$UPLOADS_PATH" ]; then
    mkdir -p "$UPLOADS_PATH"
fi

# ============================================
# 1. 自动检测域名（多种方式）
# ============================================
DOMAIN=""

# 方法1: 从命令行参数获取
if [ -n "$1" ]; then
    DOMAIN="$1"
    echo -e "${GREEN}✓ 使用命令行指定的域名：$DOMAIN${NC}"
fi

# 方法2: 从 .env 的 SITE_DOMAIN 获取（推荐配置）
if [ -z "$DOMAIN" ] && [ -f "$PROJECT_ROOT/.env" ]; then
    SITE_DOMAIN=$(grep -E "^SITE_DOMAIN=" "$PROJECT_ROOT/.env" | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    if [ -n "$SITE_DOMAIN" ]; then
        DOMAIN="$SITE_DOMAIN"
        echo -e "${GREEN}✓ 从 SITE_DOMAIN 配置读取域名：$DOMAIN${NC}"
    fi
fi

# 方法3: 从 NEXT_PUBLIC_SITE_URL 提取域名
if [ -z "$DOMAIN" ] && [ -f "$PROJECT_ROOT/.env" ]; then
    SITE_URL=$(grep -E "^NEXT_PUBLIC_SITE_URL=" "$PROJECT_ROOT/.env" | head -1 | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    if [ -n "$SITE_URL" ]; then
        # 提取域名部分（去除协议和路径）
        EXTRACTED_DOMAIN=$(echo "$SITE_URL" | sed 's|https\?://||' | sed 's|/.*||' | sed 's|www\.||')
        if [ -n "$EXTRACTED_DOMAIN" ] && [ "$EXTRACTED_DOMAIN" != "localhost" ] && [ "$EXTRACTED_DOMAIN" != "localhost:3000" ]; then
            DOMAIN="$EXTRACTED_DOMAIN"
            echo -e "${GREEN}✓ 从 NEXT_PUBLIC_SITE_URL 提取域名：$DOMAIN${NC}"
        fi
    fi
fi

# 方法4: 自动扫描宝塔配置目录
if [ -z "$DOMAIN" ]; then
    BT_NGINX_DIR="/www/server/panel/vhost/nginx"
    if [ -d "$BT_NGINX_DIR" ]; then
        # 尝试找到一个与项目相关的配置
        for conf in "$BT_NGINX_DIR"/*.conf; do
            if [ -f "$conf" ]; then
                conf_name=$(basename "$conf" .conf)
                # 跳过默认配置
                if [[ "$conf_name" == "0.default" ]] || [[ "$conf_name" == "default" ]]; then
                    continue
                fi
                # 检查配置是否代理到 3000 端口（Next.js 默认端口）
                if grep -q "proxy_pass.*:3000" "$conf" 2>/dev/null; then
                    DOMAIN="$conf_name"
                    echo -e "${GREEN}✓ 自动检测到代理配置：$DOMAIN${NC}"
                    break
                fi
            fi
        done
    fi
fi

# 如果还是没有域名
if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}⚠️  无法自动检测域名${NC}"
    echo ""
    echo "请在 .env 文件中添加以下配置："
    echo -e "  ${BLUE}SITE_DOMAIN=您的域名${NC}"
    echo ""
    echo "或者手动运行："
    echo "  sudo bash scripts/fix-nginx.sh 您的域名"
    echo ""
    
    # 如果是宝塔面板，列出可用的站点
    if [ -d "/www/server/panel/vhost/nginx" ]; then
        echo "检测到的站点配置："
        ls -1 /www/server/panel/vhost/nginx/*.conf 2>/dev/null | while read f; do
            name=$(basename "$f" .conf)
            if [[ "$name" != "0.default" ]] && [[ "$name" != "default" ]]; then
                echo "  - $name"
            fi
        done
    fi
    exit 0  # 静默退出，不影响其他流程
fi

# ============================================
# 2. 定位 Nginx 配置文件
# ============================================
echo ""
echo -e "${BLUE}🔍 正在定位配置文件...${NC}"

# 尝试多种路径
NGINX_CONF=""
POSSIBLE_PATHS=(
    "/www/server/panel/vhost/nginx/${DOMAIN}.conf"
    "/www/server/panel/vhost/nginx/www.${DOMAIN}.conf"
    "/etc/nginx/sites-enabled/${DOMAIN}.conf"
    "/etc/nginx/sites-enabled/${DOMAIN}"
    "/etc/nginx/conf.d/${DOMAIN}.conf"
)

for path in "${POSSIBLE_PATHS[@]}"; do
    if [ -f "$path" ]; then
        NGINX_CONF="$path"
        break
    fi
done

if [ -z "$NGINX_CONF" ]; then
    echo -e "${YELLOW}⚠️  未找到 $DOMAIN 的 Nginx 配置文件${NC}"
    echo "尝试过的路径："
    for path in "${POSSIBLE_PATHS[@]}"; do
        echo "  - $path"
    done
    exit 0  # 静默退出
fi

echo -e "${GREEN}✓ 找到配置文件：$NGINX_CONF${NC}"

# ============================================
# 3. 检查是否已配置
# ============================================
if grep -q "location /uploads/" "$NGINX_CONF"; then
    echo -e "${GREEN}✅ /uploads/ 配置已存在，无需修复${NC}"
    exit 0
fi

# ============================================
# 4. 检查权限
# ============================================
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  需要 root 权限修改 Nginx 配置${NC}"
    echo "请运行：sudo bash scripts/fix-nginx.sh"
    exit 0
fi

# ============================================
# 5. 备份并修改配置
# ============================================
echo -e "${YELLOW}⚠️  检测到 /uploads/ 配置缺失，正在添加...${NC}"

# 备份
BACKUP_FILE="${NGINX_CONF}.bak.$(date +%Y%m%d%H%M%S)"
cp "$NGINX_CONF" "$BACKUP_FILE"
echo -e "   📦 已备份：$BACKUP_FILE"

# 生成配置块（使用 cat 避免特殊字符问题）
TEMP_CONFIG=$(mktemp)
cat > "$TEMP_CONFIG" << EOF

    # >>> GeoCMS 静态文件配置 (自动添加于 $(date +%Y-%m-%d)) <<<
    location /uploads/ {
        alias ${UPLOADS_PATH}/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin *;
        autoindex off;
    }
    # <<< GeoCMS 配置结束 <<<

EOF

# 找到插入点并插入
INSERTED=false

# 方法1: 在 #PHP-INFO-START 之前插入
if grep -q "#PHP-INFO-START" "$NGINX_CONF"; then
    # 获取行号
    LINE_NUM=$(grep -n "#PHP-INFO-START" "$NGINX_CONF" | head -1 | cut -d: -f1)
    if [ -n "$LINE_NUM" ]; then
        head -n $((LINE_NUM - 1)) "$NGINX_CONF" > "${NGINX_CONF}.new"
        cat "$TEMP_CONFIG" >> "${NGINX_CONF}.new"
        tail -n +$LINE_NUM "$NGINX_CONF" >> "${NGINX_CONF}.new"
        mv "${NGINX_CONF}.new" "$NGINX_CONF"
        INSERTED=true
        echo -e "   ${GREEN}✓ 配置已插入（在 #PHP-INFO-START 之前）${NC}"
    fi
fi

# 方法2: 在 #ERROR-PAGE-END 之后插入
if [ "$INSERTED" = false ] && grep -q "#ERROR-PAGE-END" "$NGINX_CONF"; then
    LINE_NUM=$(grep -n "#ERROR-PAGE-END" "$NGINX_CONF" | head -1 | cut -d: -f1)
    if [ -n "$LINE_NUM" ]; then
        head -n $LINE_NUM "$NGINX_CONF" > "${NGINX_CONF}.new"
        cat "$TEMP_CONFIG" >> "${NGINX_CONF}.new"
        tail -n +$((LINE_NUM + 1)) "$NGINX_CONF" >> "${NGINX_CONF}.new"
        mv "${NGINX_CONF}.new" "$NGINX_CONF"
        INSERTED=true
        echo -e "   ${GREEN}✓ 配置已插入（在 #ERROR-PAGE-END 之后）${NC}"
    fi
fi

# 方法3: 在第一个 location 之前插入
if [ "$INSERTED" = false ]; then
    LINE_NUM=$(grep -n "location" "$NGINX_CONF" | head -1 | cut -d: -f1)
    if [ -n "$LINE_NUM" ]; then
        head -n $((LINE_NUM - 1)) "$NGINX_CONF" > "${NGINX_CONF}.new"
        cat "$TEMP_CONFIG" >> "${NGINX_CONF}.new"
        tail -n +$LINE_NUM "$NGINX_CONF" >> "${NGINX_CONF}.new"
        mv "${NGINX_CONF}.new" "$NGINX_CONF"
        INSERTED=true
        echo -e "   ${GREEN}✓ 配置已插入（在第一个 location 之前）${NC}"
    fi
fi

rm -f "$TEMP_CONFIG"

if [ "$INSERTED" = false ]; then
    echo -e "${RED}❌ 无法自动插入配置${NC}"
    cp "$BACKUP_FILE" "$NGINX_CONF"
    exit 1
fi

# ============================================
# 6. 测试并重载
# ============================================
echo ""
echo -e "${BLUE}🧪 测试 Nginx 配置...${NC}"
nginx -t 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 配置测试通过${NC}"
    
    echo -e "${BLUE}🔄 重载 Nginx...${NC}"
    nginx -s reload
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "============================================"
        echo -e "${GREEN}🎉 Nginx 配置修复完成！${NC}"
        echo "============================================"
        echo ""
        echo "上传的图片现在可以正常预览了。"
    else
        echo -e "${YELLOW}⚠️  Nginx 重载失败${NC}"
    fi
else
    echo -e "${RED}❌ 配置测试失败，正在恢复备份...${NC}"
    cp "$BACKUP_FILE" "$NGINX_CONF"
    echo "已恢复原配置"
    exit 1
fi
