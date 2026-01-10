export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // 允许通过环境变量禁用 Cron（低配服务器）
        if (process.env.DISABLE_CRON === 'true') {
            console.log('[Instrumentation] Cron jobs disabled via DISABLE_CRON=true');
            return;
        }

        const { initCronJobs } = await import('./lib/cron/ai-tasks');

        // Only initialize cron if enabled or in production
        if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true' || process.env.NODE_ENV === 'development') {
            console.log('[Instrumentation] Starting AI task cron job...');
            initCronJobs();
        }
    }
}
