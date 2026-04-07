'use server';

import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getRedirects() {
    await requireAdmin();
    return db.redirectRoute.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function createRedirect(data: { oldPath: string, newPath: string, type: string }) {
    await requireAdmin();
    
    // Ensure oldPath starts with /
    let oldP = data.oldPath.trim();
    if (!oldP.startsWith('/')) oldP = '/' + oldP;
    
    let newP = data.newPath.trim();
    if (!newP.startsWith('/') && !newP.startsWith('http')) newP = '/' + newP;

    await db.redirectRoute.create({
        data: {
            oldPath: oldP,
            newPath: newP,
            type: parseInt(data.type) || 301,
            isActive: true
        }
    });
    
    revalidatePath('/admin/seo/redirects');
    return { success: true };
}

export async function toggleRedirectStatus(id: string, isActive: boolean) {
    await requireAdmin();
    await db.redirectRoute.update({
        where: { id },
        data: { isActive }
    });
    revalidatePath('/admin/seo/redirects');
    return { success: true };
}

export async function deleteRedirect(id: string) {
    await requireAdmin();
    await db.redirectRoute.delete({
        where: { id }
    });
    revalidatePath('/admin/seo/redirects');
    return { success: true };
}
