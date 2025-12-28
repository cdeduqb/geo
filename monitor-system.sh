#!/bin/bash

# GeoCMS 系统健康监控脚本
# 用途：定时检查系统健康状态

LOG_FILE="/tmp/geocms-health.log"

echo "=== GeoCMS Health Check - $(date) ===" >> $LOG_FILE

# 检查进程
if pm2 list 2>/dev/null | grep -q "online"; then
    echo "[OK] Application is running" >> $LOG_FILE
else
    echo "[ERROR] Application is not running!" >> $LOG_FILE
    # 可以在这里添加重启逻辑
fi

# 检查内存
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ $MEMORY_USAGE -gt 90 ]; then
    echo "[WARNING] High memory usage: ${MEMORY_USAGE}%" >> $LOG_FILE
else
    echo "[OK] Memory usage: ${MEMORY_USAGE}%" >> $LOG_FILE
fi

# 检查磁盘
DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "[WARNING] High disk usage: ${DISK_USAGE}%" >> $LOG_FILE
else
    echo "[OK] Disk usage: ${DISK_USAGE}%" >> $LOG_FILE
fi

echo "" >> $LOG_FILE
