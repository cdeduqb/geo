
import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

const execAsync = promisify(exec);
const REPO_URL = "https://moligeo:8f7c9427cb009da1ab7a4229fad6212b@gitee.com/yang1-tao22222/moligeocms.git";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await getCurrentUser();
        // Assuming 'ADMIN' role check or similar is needed, but user just asked for "admin backend" context
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Configure remote and fetch
        // Note: We ignore SSL verification if needed, but standard https should work.
        // We use the Repo URL directly.
        
        // 1. Set remote (idempotent-ish)
        // Ignoring errors to proceed to fetch
        try {
           await execAsync(`git remote set-url origin "${REPO_URL}"`);
        } catch (e) {
           await execAsync(`git remote add origin "${REPO_URL}"`); 
        }

        // 2. Fetch
        await execAsync('git fetch origin master');

        // 3. Compare
        const { stdout: localHash } = await execAsync('git rev-parse HEAD');
        const { stdout: remoteHash } = await execAsync('git rev-parse origin/master');
        
        const hasUpdate = localHash.trim() !== remoteHash.trim();

        return NextResponse.json({ 
            hasUpdate,
            localVersion: localHash.trim().substring(0, 7),
            remoteVersion: remoteHash.trim().substring(0, 7)
        });

    } catch (error) {
        console.error('[Update Check Error]', error);
        return NextResponse.json({ hasUpdate: false, error: 'Failed to check for updates' }, { status: 500 });
    }
}
