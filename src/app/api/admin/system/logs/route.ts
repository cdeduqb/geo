
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();
        // Only allow admin access
        if (!user || user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const logPath = path.join(process.cwd(), 'update.log');

        if (!fs.existsSync(logPath)) {
            return NextResponse.json({ content: '暂无更新日志 (Log file not found)' });
        }

        const stats = fs.statSync(logPath);
        // Read the last 20KB of logs to avoid huge payloads
        const start = Math.max(0, stats.size - 20480);
        const stream = fs.createReadStream(logPath, { start, encoding: 'utf-8' });

        let content = '';
        for await (const chunk of stream) {
            content += chunk;
        }

        return NextResponse.json({ content });
    } catch (error) {
        console.error('Failed to read logs:', error);
        return NextResponse.json({ error: 'Failed to read logs' }, { status: 500 });
    }
}
