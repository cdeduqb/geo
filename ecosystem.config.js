/**
 * PM2 配置文件 - 适用于低内存服务器
 * 
 * 使用方法：
 * 1. 安装 PM2: npm install -g pm2
 * 2. 构建项目: npm run build
 * 3. 启动: pm2 start ecosystem.config.js
 * 4. 查看状态: pm2 status
 * 5. 查看日志: pm2 logs geocms
 * 6. 重启: pm2 restart geocms
 * 7. 停止: pm2 stop geocms
 * 8. 保存进程列表: pm2 save
 * 9. 设置开机自启: pm2 startup
 */

module.exports = {
    apps: [
        {
            name: 'geocms',
            // 使用 standalone 输出
            script: '.next/standalone/server.js',
            // 单实例模式（低内存推荐）
            instances: 1,
            // 如果服务器内存充足可以改为 'cluster' 模式
            exec_mode: 'fork',
            // 自动重启
            autorestart: true,
            // 监听文件变化（生产环境建议关闭）
            watch: false,
            // 最大内存限制 - 超过后自动重启（根据您的服务器内存调整）
            // 1GB 内存服务器建议设置 300-400M
            // 2GB 内存服务器建议设置 500-600M
            max_memory_restart: '400M',
            // 环境变量
            env: {
                NODE_ENV: 'production',
                PORT: 3000,
                // 限制 Node.js 堆内存（根据服务器内存调整）
                NODE_OPTIONS: '--max-old-space-size=384',
            },
            // 错误日志
            error_file: '/www/wwwlogs/geocms-error.log',
            // 输出日志
            out_file: '/www/wwwlogs/geocms-out.log',
            // 日志时间格式
            time: true,
            // 合并日志
            merge_logs: true,
            // 日志轮转 - 每个文件最大 10MB
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            // 重启延迟
            restart_delay: 1000,
            // 进程优雅退出等待时间
            kill_timeout: 5000,
            // 等待应用准备就绪
            wait_ready: true,
            // 监听端口超时
            listen_timeout: 10000,
        },
    ],
};
