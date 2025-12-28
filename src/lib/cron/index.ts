import { initCronJobs } from '@/lib/cron/ai-tasks';

// Initialize cron jobs when the server starts
// This file should be imported in the root layout or middleware
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_CRON === 'true') {
    initCronJobs();
}

export { };
