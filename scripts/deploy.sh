#!/bin/bash

# ========================================================
# Molicms 一键部署脚本
# 功能：自动定位目录、拉取代码、构建、重启服务
# 用法：bash scripts/deploy.sh
# ========================================================

# 1. 动态获取项目根目录
# 获取脚本文件所在的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# 项目根目录是脚本目录的上一级
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "📍 脚本位置: $SCRIPT_DIR"
echo "📂 项目根目录: $PROJECT_ROOT"

# 2. 进入项目目录
cd "$PROJECT_ROOT" || { echo "❌ 无法进入目录 $PROJECT_ROOT"; exit 1; }

# 3. 赋予脚本执行权限 (防呆设计)
if [ -f "scripts/update.sh" ]; then
    chmod +x scripts/update.sh
else
    echo "❌ 错误：未找到核心脚本 scripts/update.sh"
    exit 1
fi

# 4. 执行核心更新脚本
echo "🚀 开始执行核心部署流程..."
# 传递参数给 update.sh (如果有的话)
bash scripts/update.sh "$@"

# 5. 结果汇总
EXIT_CODE=$?
if [ $EXIT_CODE -eq 0 ]; then
    echo ""
    echo "✅ ==================================="
    echo "✅  部署成功！(Exit Code: 0)"
    echo "✅ ==================================="
    # 尝试显示端口监听状态
    if command -v netstat &> /dev/null; then
        echo "🌐 端口监听状态:"
        netstat -tlnp | grep 3000
    fi
else
    echo ""
    echo "❌ ==================================="
    echo "❌  部署失败！(Exit Code: $EXIT_CODE)"
    echo "❌ ==================================="
fi

exit $EXIT_CODE
