#!/bin/bash

# ============================================================
# GeoCMS Nginx 配置自动修复脚本 (宝塔面板专用版)
# 功能：自动检测并添加 /uploads/ 静态资源配置
# 用法：sudo bash scripts/fix-nginx.sh [域名]
# 示例：sudo bash scripts/fix-nginx.sh 113ai.com
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
echo -e "${BLUE}🔧 GeoCMS Nginx 配置修复工具 v3.0${NC}"
echo "    (宝塔面板自动适配版)"
echo "============================================"
echo ""

# 检查是否为 root 权限
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  请使用 sudo 运行此脚本${NC}"
    echo "   命令：sudo bash scripts/fix-nginx.sh"
    exit 1
fi

# 获取上传目录路径
UPLOADS_PATH="$PROJECT_ROOT/public/uploads"
echo -e "${BLUE}📂 项目路径：${NC}$PROJECT_ROOT"
echo -e "${BLUE}📁 上传目录：${NC}$UPLOADS_PATH"

# 确保上传目录存在
if [ ! -d "$UPLOADS_PATH" ]; then
    mkdir -p "$UPLOADS_PATH"
    echo -e "   ${GREEN}✓ 已创建上传目录${NC}"
fi

# ============================================
# 1. 自动检测域名
# ============================================
DOMAIN=""

# 方法1: 从命令行参数获取
if [ -n "$1" ]; then
    DOMAIN="$1"
    echo -e "${GREEN}✓ 使用指定域名：$DOMAIN${NC}"
fi

# 方法2: 从 .env 获取
if [ -z "$DOMAIN" ] && [ -f "$PROJECT_ROOT/.env" ]; then
    ENV_DOMAIN=$(grep -E "NEXT_PUBLIC_SITE_URL" "$PROJECT_ROOT/.env" | head -1 | sed 's/.*=["]*https\?:\/\/\(www\.\)\?\([^/"]*\).*/\2/')
    if [ -n "$ENV_DOMAIN" ] && [ "$ENV_DOMAIN" != "localhost" ]; then
        DOMAIN="$ENV_DOMAIN"
        echo -e "${GREEN}✓ 从 .env 检测到域名：$DOMAIN${NC}"
    fi
fi

# 方法3: 从宝塔配置文件列表中选择
if [ -z "$DOMAIN" ]; then
    BT_NGINX_DIR="/www/server/panel/vhost/nginx"
    if [ -d "$BT_NGINX_DIR" ]; then
        echo ""
        echo -e "${BLUE}📋 检测到以下网站配置：${NC}"
        CONF_LIST=$(ls -1 "$BT_NGINX_DIR"/*.conf 2>/dev/null | grep -v "0.default" | head -10)
        i=1
        declare -a DOMAINS
        for conf in $CONF_LIST; do
            domain_name=$(basename "$conf" .conf)
            DOMAINS[$i]="$domain_name"
            echo "   [$i] $domain_name"
            ((i++))
        done
        
        if [ $i -gt 1 ]; then
            echo ""
            read -p "请选择网站编号 (1-$((i-1))): " choice
            if [ -n "${DOMAINS[$choice]}" ]; then
                DOMAIN="${DOMAINS[$choice]}"
                echo -e "${GREEN}✓ 已选择：$DOMAIN${NC}"
            fi
        fi
    fi
fi

# 如果还是没有域名，退出
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ 无法确定域名，请手动指定${NC}"
    echo "用法：sudo bash scripts/fix-nginx.sh 您的域名"
    echo "示例：sudo bash scripts/fix-nginx.sh 113ai.com"
    exit 1
fi

# ============================================
# 2. 定位 Nginx 配置文件
# ============================================
echo ""
echo -e "${BLUE}🔍 正在定位配置文件...${NC}"

# 宝塔面板路径
BT_CONF="/www/server/panel/vhost/nginx/${DOMAIN}.conf"
# 常规路径
STD_CONF="/etc/nginx/sites-enabled/${DOMAIN}.conf"
ALT_CONF="/etc/nginx/conf.d/${DOMAIN}.conf"

NGINX_CONF=""
if [ -f "$BT_CONF" ]; then
    NGINX_CONF="$BT_CONF"
elif [ -f "$STD_CONF" ]; then
    NGINX_CONF="$STD_CONF"
elif [ -f "$ALT_CONF" ]; then
    NGINX_CONF="$ALT_CONF"
fi

if [ -z "$NGINX_CONF" ]; then
    echo -e "${RED}❌ 未找到 $DOMAIN 的 Nginx 配置文件${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 找到配置文件：$NGINX_CONF${NC}"

# ============================================
# 3. 检查是否已配置
# ============================================
if grep -q "location /uploads/" "$NGINX_CONF"; then
    echo ""
    echo -e "${GREEN}✅ /uploads/ 配置已存在，无需修复${NC}"
    echo "当前配置："
    grep -A5 "location /uploads/" "$NGINX_CONF" | head -8
    exit 0
fi

# ============================================
# 4. 备份并修改配置
# ============================================
echo ""
echo -e "${YELLOW}⚠️  检测到 /uploads/ 配置缺失，正在添加...${NC}"

# 备份
BACKUP_FILE="${NGINX_CONF}.bak.$(date +%Y%m%d%H%M%S)"
cp "$NGINX_CONF" "$BACKUP_FILE"
echo -e "   📦 已备份：$BACKUP_FILE"

# 生成配置块
read -r -d '' UPLOAD_CONFIG << EOF

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

# 找到合适的插入点
# 优先在 #PHP-INFO-START 之前插入，这样位置比较靠前
if grep -q "#PHP-INFO-START" "$NGINX_CONF"; then
    # 在 #PHP-INFO-START 之前插入
    sed -i "/#PHP-INFO-START/i\\${UPLOAD_CONFIG}" "$NGINX_CONF"
    INSERT_POINT="#PHP-INFO-START"
elif grep -q "location ~ /purge" "$NGINX_CONF"; then
    # 在 purge 之前插入
    sed -i "/location ~ \/purge/i\\${UPLOAD_CONFIG}" "$NGINX_CONF"
    INSERT_POINT="purge location"
elif grep -q "#ERROR-PAGE-START" "$NGINX_CONF"; then
    # 在错误页配置之后插入
    sed -i "/#ERROR-PAGE-END/a\\${UPLOAD_CONFIG}" "$NGINX_CONF"
    INSERT_POINT="#ERROR-PAGE-END"
else
    # 在最后一个 } 之前插入
    sed -i "/^}/i\\${UPLOAD_CONFIG}" "$NGINX_CONF"
    INSERT_POINT="server block end"
fi

echo -e "   ${GREEN}✓ 配置已插入（位置：$INSERT_POINT 之前）${NC}"

# ============================================
# 5. 测试并重载
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
        echo "现在上传的图片应该可以正常预览了。"
        echo ""
        echo "验证命令："
        echo "  curl -I https://${DOMAIN}/uploads/"
    else
        echo -e "${YELLOW}⚠️  Nginx 重载失败，请手动执行：nginx -s reload${NC}"
    fi
else
    echo -e "${RED}❌ 配置测试失败，正在恢复备份...${NC}"
    cp "$BACKUP_FILE" "$NGINX_CONF"
    echo "已恢复原配置"
    echo ""
    echo "请检查配置文件语法是否正确"
    exit 1
fi
