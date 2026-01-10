
import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

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

        // 4. 获取本地版本号
        let localVersion = localHash.trim().substring(0, 7);
        try {
            const packagePath = path.join(process.cwd(), 'package.json');
            const packageContent = fs.readFileSync(packagePath, 'utf-8');
            const pkg = JSON.parse(packageContent);
            if (pkg.version) {
                localVersion = `v${pkg.version}`;
            }
        } catch (e) {
            console.error('Failed to read local package.json version:', e);
        }

        // 5. 获取远程版本号
        let remoteVersion = remoteHash.trim().substring(0, 7);
        try {
            // 使用 git show 读取远程 package.json 内容
            const { stdout: remotePkgContent } = await execAsync('git show origin/master:package.json');
            const remotePkg = JSON.parse(remotePkgContent);
            if (remotePkg.version) {
                remoteVersion = `v${remotePkg.version}`;
            }
        } catch (e) {
            // console.error('Failed to read remote package.json version:', e);
            // 这里不抛出错误，而是保留 hash 作为 fallback
        }

        return NextResponse.json({
            hasUpdate,
            localVersion,
            remoteVersion
        });

    } catch (error) {
        console.error('[Update Check Error]', error);
        return NextResponse.json({ hasUpdate: false, error: 'Failed to check for updates' }, { status: 500 });
    }
}
