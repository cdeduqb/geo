#!/bin/bash

# ============================================
# Molicms 一键部署脚本（适用于宝塔面板）
# ============================================

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/www/wwwroot/molicms"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Molicms 部署脚本 v1.0${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录运行此脚本${NC}"
    exit 1
fi

# 菜单
echo ""
echo "请选择操作:"
echo "1) 首次部署（完整安装）"
echo "2) 更新部署（拉取代码并重启）"
echo "3) 仅重启服务"
echo "4) 查看日志"
echo "5) 查看状态"
echo "0) 退出"
echo ""

read -p "请输入选项 [0-5]: " choice

case $choice in
    1)
        echo -e "\n${YELLOW}开始首次部署...${NC}\n"
        
        # 安装依赖
        echo -e "${GREEN}[1/6] 安装依赖...${NC}"
        npm install
        
        # 生成 Prisma 客户端
        echo -e "${GREEN}[2/6] 生成 Prisma 客户端...${NC}"
        npx prisma generate
        
        # 推送数据库结构
        echo -e "${GREEN}[3/6] 同步数据库...${NC}"
        npx prisma db push
        
        # 构建项目
        echo -e "${GREEN}[4/6] 构建项目...${NC}"
        npm run build
        
        # 复制静态文件
        echo -e "${GREEN}[5/6] 复制静态文件...${NC}"
        cp -r public .next/standalone/
        cp -r .next/static .next/standalone/.next/
        
        # 启动 PM2
        echo -e "${GREEN}[6/6] 启动服务...${NC}"
        pm2 delete molicms 2>/dev/null
        pm2 start ecosystem.config.js
        pm2 save
        
        echo -e "\n${GREEN}✅ 首次部署完成!${NC}"
        pm2 status
        ;;
    
    2)
        echo -e "\n${YELLOW}开始更新部署...${NC}\n"
        
        # 拉取代码（如果是 git 项目）
        if [ -d ".git" ]; then
            echo -e "${GREEN}[1/5] 拉取最新代码...${NC}"
            git pull
        fi
        
        # 安装依赖
        echo -e "${GREEN}[2/5] 检查依赖...${NC}"
        npm install
        
        # 构建项目
        echo -e "${GREEN}[3/5] 重新构建...${NC}"
        npm run build
        
        # 复制静态文件
        echo -e "${GREEN}[4/5] 复制静态文件...${NC}"
        cp -r public .next/standalone/
        cp -r .next/static .next/standalone/.next/
        
        # 重启 PM2
        echo -e "${GREEN}[5/5] 重启服务...${NC}"
        pm2 restart molicms
        
        echo -e "\n${GREEN}✅ 更新部署完成!${NC}"
        pm2 status
        ;;
    
    3)
        echo -e "\n${YELLOW}重启服务...${NC}"
        pm2 restart molicms
        echo -e "${GREEN}✅ 服务已重启${NC}"
        pm2 status
        ;;
    
    4)
        echo -e "\n${YELLOW}显示日志（按 Ctrl+C 退出）...${NC}\n"
        pm2 logs molicms
        ;;
    
    5)
        echo -e "\n${YELLOW}服务状态:${NC}\n"
        pm2 status
        echo ""
        pm2 monit
        ;;
    
    0)
        echo "退出"
        exit 0
        ;;
    
    *)
        echo -e "${RED}无效选项${NC}"
        exit 1
        ;;
esac
