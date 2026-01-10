
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

        // Spawn the update script in detached mode so it continues after this process dies (if it kills it)
        const subprocess = spawn('bash', [scriptPath], {
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
