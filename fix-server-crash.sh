#!/bin/bash

# 服务器崩溃快速修复脚本
# 用途：检测和修复导致 Molicms 服务器崩溃的常见问题

echo "=================================="
echo "Molicms 服务器崩溃诊断和修复工具"
echo "=================================="
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. 检查 Node.js 进程
echo "1. 检查 Node.js 进程..."
NODE_COUNT=$(ps aux | grep node | grep -v grep | wc -l)
if [ $NODE_COUNT -gt 5 ]; then
    echo -e "${YELLOW}警告: 检测到 $NODE_COUNT 个 Node.js 进程（可能有泄漏）${NC}"
    echo "   建议重启服务"
else
    echo -e "${GREEN}✓ Node.js 进程数正常 ($NODE_COUNT)${NC}"
fi
echo ""

# 2. 检查内存使用
echo "2. 检查内存使用..."
FREE_MEM=$(free -m | awk 'NR==2{printf "%.0f", $7}')
TOTAL_MEM=$(free -m | awk 'NR==2{printf "%.0f", $2}')
MEM_PERCENT=$(awk "BEGIN {printf \"%.0f\", ($FREE_MEM/$TOTAL_MEM)*100}")

if [ $MEM_PERCENT -lt 10 ]; then
    echo -e "${RED}✗ 可用内存不足 ($MEM_PERCENT%)${NC}"
    echo "   建议立即重启服务"
elif [ $MEM_PERCENT -lt 20 ]; then
    echo -e "${YELLOW}警告: 可用内存较低 ($MEM_PERCENT%)${NC}"
else
    echo -e "${GREEN}✓ 内存充足 ($MEM_PERCENT% 可用)${NC}"
fi
echo ""

# 3. 检查数据库连接
echo "3. 检查数据库连接..."
if command -v mysql &> /dev/null; then
    DB_HOST="101.126.137.112"
    DB_USER="cms"
    DB_PASS="S73wCYE5xn5FKwaN"
    DB_NAME="cms"
    
    if mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "USE $DB_NAME; SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✓ 数据库连接正常${NC}"
    else
        echo -e "${RED}✗ 数据库连接失败${NC}"
        echo "   请检查数据库服务和网络连接"
    fi
else
    echo -e "${YELLOW}警告: 未安装 mysql 客户端，跳过数据库检查${NC}"
fi
echo ""

# 4. 检查 .env 配置
echo "4. 检查环境变量配置..."
if [ -f ".env" ]; then
    if grep -q "connection_limit" .env; then
        echo -e "${GREEN}✓ 数据库连接池已配置${NC}"
    else
        echo -e "${YELLOW}警告: 未配置数据库连接池${NC}"
        echo "   建议在 DATABASE_URL 中添加: ?connection_limit=10&pool_timeout=20"
    fi
    
    if grep -q "DISABLE_LICENSE_HEARTBEAT=true" .env; then
        echo -e "${GREEN}✓ 心跳服务已禁用（推荐）${NC}"
    else
        echo -e "${YELLOW}提示: 可以禁用心跳服务以减少资源消耗${NC}"
        echo "   添加到 .env: DISABLE_LICENSE_HEARTBEAT=true"
    fi
else
    echo -e "${RED}✗ 未找到 .env 文件${NC}"
fi
echo ""

# 5. 检查磁盘空间
echo "5. 检查磁盘空间..."
DISK_USAGE=$(df -h . | awk 'NR==2{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 90 ]; then
    echo -e "${RED}✗ 磁盘空间不足 ($DISK_USAGE%)${NC}"
elif [ $DISK_USAGE -gt 80 ]; then
    echo -e "${YELLOW}警告: 磁盘空间较少 ($DISK_USAGE%)${NC}"
else
    echo -e "${GREEN}✓ 磁盘空间充足 ($DISK_USAGE%)${NC}"
fi
echo ""

# 6. 提供修复建议
echo "=================================="
echo "修复建议："
echo "=================================="
echo ""

if [ $NODE_COUNT -gt 5 ] || [ $MEM_PERCENT -lt 20 ]; then
    echo -e "${YELLOW}推荐操作：${NC}"
    echo "1. 立即重启服务："
    echo "   pm2 restart all"
    echo ""
    echo "2. 清理僵尸进程（如果有）："
    echo "   pkill -9 node"
    echo ""
fi

echo -e "${GREEN}预防措施：${NC}"
echo "1. 更新数据库连接字符串（在 .env 中）："
echo "   DATABASE_URL=\"mysql://cms:S73wCYE5xn5FKwaN@101.126.137.112:3306/cms?connection_limit=10&pool_timeout=20\""
echo ""
echo "2. 禁用心跳服务（在 .env 中添加）："
echo "   DISABLE_LICENSE_HEARTBEAT=true"
echo ""
echo "3. 设置内存限制："
echo "   pm2 start npm --name molicms -- start --max-memory-restart 500M"
echo ""
echo "详细文档请查看: SERVER_CRASH_FIX.md"
echo ""
