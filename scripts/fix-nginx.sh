#!/bin/bash

# ============================================================
# GeoCMS Nginx 配置自动修复脚本 (增强版)
# 功能：自动检测并添加 /uploads/ 静态资源配置
# 用法：sudo bash scripts/fix-nginx.sh
# ============================================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 获取项目根目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo ""
echo "============================================"
echo -e "${BLUE}🔧 GeoCMS Nginx 配置自动修复工具 v2.0${NC}"
echo "============================================"
echo ""

# 检查是否为 root 权限
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}⚠️  建议使用 sudo 运行此脚本以获得修改权限${NC}"
    echo "   命令：sudo bash scripts/fix-nginx.sh"
    echo ""
fi

# 检测项目路径
echo -e "${BLUE}📂 项目路径：${NC}$PROJECT_ROOT"
UPLOADS_PATH="$PROJECT_ROOT/public/uploads"
echo -e "${BLUE}📁 上传目录：${NC}$UPLOADS_PATH"

if [ ! -d "$UPLOADS_PATH" ]; then
    echo -e "${YELLOW}⚠️  上传目录不存在，正在创建...${NC}"
    mkdir -p "$UPLOADS_PATH"
fi

# 1. 检测 Nginx 配置路径（支持多种场景）
echo ""
echo -e "${BLUE}🔍 正在检测 Nginx 配置...${NC}"

NGINX_CONF_PATHS=(
    "/www/server/panel/vhost/nginx"           # 宝塔面板
    "/www/server/nginx/conf/vhost"            # 宝塔自编译
    "/etc/nginx/sites-enabled"                 # Ubuntu/Debian
    "/etc/nginx/conf.d"                        # CentOS/RHEL/AlmaLinux
    "/usr/local/nginx/conf/vhost"              # 自编译 Nginx
    "/etc/nginx/vhost"                         # 某些VPS
)

FOUND_CONF=""
NGINX_DIR=""
DOMAIN_NAME=""

# 尝试从环境变量或常见方式获取域名
if [ -f "$PROJECT_ROOT/.env" ]; then
    DOMAIN_FROM_ENV=$(grep -E "NEXT_PUBLIC_SITE_URL|site_url" "$PROJECT_ROOT/.env" | head -1 | sed 's/.*=["]*\(https\?:\/\/\)\?\(www\.\)\?\([^/"]*\).*/\3/')
    if [ -n "$DOMAIN_FROM_ENV" ]; then
        DOMAIN_NAME="$DOMAIN_FROM_ENV"
        echo -e "   从 .env 检测到域名：${GREEN}$DOMAIN_NAME${NC}"
    fi
fi

# 搜索配置文件
for path in "${NGINX_CONF_PATHS[@]}"; do
    if [ -d "$path" ]; then
        echo -e "   检查目录：$path"
        for conf in "$path"/*.conf; do
            if [ -f "$conf" ]; then
                # 检查配置文件是否包含项目路径或代理到 3000 端口
                if grep -q "moligeocms\|geocms\|:3000\|$DOMAIN_NAME" "$conf" 2>/dev/null; then
                    FOUND_CONF="$conf"
                    NGINX_DIR="$path"
                    echo -e "   ${GREEN}✓ 找到匹配的配置文件${NC}"
                    break 2
                fi
            fi
        done
    fi
done

# 如果没找到，尝试通配符搜索
if [ -z "$FOUND_CONF" ]; then
    echo -e "   ${YELLOW}尝试扩展搜索...${NC}"
    for path in "${NGINX_CONF_PATHS[@]}"; do
        if [ -d "$path" ]; then
            # 列出所有 .conf 文件供用户选择
            CONF_COUNT=$(ls -1 "$path"/*.conf 2>/dev/null | wc -l)
            if [ "$CONF_COUNT" -gt 0 ]; then
                echo -e "   在 $path 发现 ${CONF_COUNT} 个配置文件："
                ls -1 "$path"/*.conf 2>/dev/null | head -5 | while read f; do
                    echo -e "      - $(basename $f)"
                done
                if [ "$CONF_COUNT" -gt 5 ]; then
                    echo "      ... 还有更多"
                fi
            fi
        fi
    done
fi

# 2. 如果找到配置文件，检查并修复
if [ -n "$FOUND_CONF" ]; then
    echo ""
    echo -e "${GREEN}✅ 找到 Nginx 配置文件：${NC}$FOUND_CONF"
    
    # 检查是否已配置 /uploads/
    if grep -q "location /uploads/" "$FOUND_CONF"; then
        echo -e "${GREEN}✅ /uploads/ 配置已存在，无需修复${NC}"
        echo ""
        echo "当前配置："
        grep -A5 "location /uploads/" "$FOUND_CONF" | head -8
        exit 0
    fi
    
    echo -e "${YELLOW}⚠️  检测到 /uploads/ 配置缺失，准备添加...${NC}"
    
    # 备份原配置
    BACKUP_FILE="${FOUND_CONF}.bak.$(date +%Y%m%d%H%M%S)"
    cp "$FOUND_CONF" "$BACKUP_FILE"
    echo -e "   📦 已备份：$BACKUP_FILE"
    
    # 生成配置块
    UPLOAD_CONFIG="
    # >>> GeoCMS 自动添加 - 静态上传文件配置 ($(date +%Y-%m-%d)) <<<
    location /uploads/ {
        alias ${UPLOADS_PATH}/;
        expires 30d;
        add_header Cache-Control \"public, immutable\";
        add_header Access-Control-Allow-Origin *;
        autoindex off;
    }
    # <<< GeoCMS 配置结束 <<<"

    # 使用 sed 在 "location /" 或 "location / {" 之前插入
    # 先尝试在 "location / {" 前插入
    if grep -qE "location\s+/\s*\{" "$FOUND_CONF"; then
        # 使用 awk 进行更可靠的插入
        awk -v config="$UPLOAD_CONFIG" '
            /location\s+\/\s*\{/ && !inserted {
                print config
                inserted = 1
            }
            { print }
        ' "$FOUND_CONF" > "${FOUND_CONF}.tmp" && mv "${FOUND_CONF}.tmp" "$FOUND_CONF"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ 配置已自动添加${NC}"
        else
            echo -e "${RED}❌ 自动插入失败${NC}"
            cp "$BACKUP_FILE" "$FOUND_CONF"
            echo "已恢复备份"
            exit 1
        fi
    else
        echo -e "${YELLOW}⚠️  无法自动定位插入点，请手动添加配置${NC}"
        echo ""
        echo "请将以下配置添加到 $FOUND_CONF 的 server { } 块中："
        echo "============================================"
        echo "$UPLOAD_CONFIG"
        echo "============================================"
        exit 1
    fi
    
    # 测试 Nginx 配置
    echo ""
    echo -e "${BLUE}🧪 测试 Nginx 配置...${NC}"
    nginx -t 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Nginx 配置测试通过${NC}"
        
        # 重载 Nginx
        echo -e "${BLUE}🔄 重载 Nginx...${NC}"
        nginx -s reload 2>&1
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "============================================"
            echo -e "${GREEN}🎉 Nginx 配置修复完成！${NC}"
            echo "============================================"
            echo ""
            echo "现在上传的图片应该可以正常预览了。"
        else
            echo -e "${YELLOW}⚠️  Nginx 重载失败，请手动执行：nginx -s reload${NC}"
        fi
    else
        echo -e "${RED}❌ Nginx 配置测试失败，正在恢复备份...${NC}"
        cp "$BACKUP_FILE" "$FOUND_CONF"
        echo "已恢复原配置"
        exit 1
    fi
    
else
    # 未找到配置文件，输出手动配置指南
    echo ""
    echo -e "${YELLOW}⚠️  未能自动找到 Nginx 配置文件${NC}"
    echo ""
    echo "请手动添加以下配置到您的 Nginx 站点配置中："
    echo ""
    echo "============================================"
    echo "# 添加到 server { } 块中，location / 之前"
    echo ""
    echo "location /uploads/ {"
    echo "    alias ${UPLOADS_PATH}/;"
    echo "    expires 30d;"
    echo "    add_header Cache-Control \"public, immutable\";"
    echo "    add_header Access-Control-Allow-Origin *;"
    echo "    autoindex off;"
    echo "}"
    echo "============================================"
    echo ""
    echo "步骤："
    echo "1. 找到您网站的 Nginx 配置文件"
    echo "2. 在 server { } 块中添加上述配置"
    echo "3. 运行 'nginx -t' 测试配置"
    echo "4. 运行 'nginx -s reload' 重载配置"
    echo ""
    
    # 如果是宝塔面板，给出更具体的提示
    if [ -d "/www/server/panel" ]; then
        echo -e "${BLUE}💡 检测到宝塔面板，您可以：${NC}"
        echo "   1. 打开宝塔面板 → 网站 → 您的站点 → 设置 → 配置文件"
        echo "   2. 在 server { } 块中添加上述配置"
        echo "   3. 保存并重载 Nginx"
    fi
    
    exit 1
fi
