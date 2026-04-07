import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0; // The actual caching can happen at the fetch layer if needed, or we keep it dynamic

export async function GET() {
    try {
        const redirects = await db.redirectRoute.findMany({
            where: { isActive: true },
            select: { oldPath: true, newPath: true, type: true }
        });
        
        // Convert array to a keyed object for fast O(1) lookup in middleware
        const redirectMap: Record<string, { newPath: string, type: number }> = {};
        for (const item of redirects) {
            redirectMap[item.oldPath] = { newPath: item.newPath, type: item.type };
        }
        
        return NextResponse.json(redirectMap);
    } catch (error) {
        console.error('[Internal/Redirects] Error fetching redirects:', error);
        return NextResponse.json({}, { status: 500 });
    }
}
