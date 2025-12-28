module.exports = {
    apps: [{
        name: 'geocms',
        script: 'npm',
        args: 'start',
        cwd: './', // 确保在项目根目录运行
        instances: 1, // 根据 CPU 核心数可以设置为 'max'，但 1 比较稳妥
        autorestart: true,
        watch: false,
        max_memory_restart: '1G', // 如果内存占用超过 1G 则重启
        env: {
            NODE_ENV: 'production',
            PORT: 3000
        },
        error_file: './logs/err.log',
        out_file: './logs/out.log',
        log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }]
};
