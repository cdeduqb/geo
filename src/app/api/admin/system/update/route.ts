
import { spawn } from 'child_process';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import path from 'path';

export async function POST() {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const scriptPath = path.join(process.cwd(), 'scripts', 'update.sh');

        // Spawn the update script in detached mode
        // Pass the current PID so the script knows precisely which process to kill
        const subprocess = spawn('bash', [scriptPath, String(process.pid)], {
            detached: true,
            stdio: 'ignore', // Ignore stdio to allow unref
            cwd: process.cwd()
        });

        subprocess.unref();

        return NextResponse.json({
            success: true,
            message: 'Update started. The server will restart shortly.'
        });

    } catch (error) {
        console.error('[Update Trigger Error]', error);
        return NextResponse.json({ success: false, error: 'Failed to start update' }, { status: 500 });
    }
}
