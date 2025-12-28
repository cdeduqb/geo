import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const result = await db.page.deleteMany({
            where: {
                OR: [
                    { slug: { startsWith: 'temp-' } },
                    { title: { startsWith: 'temp-' } }
                ]
            }
        });

        return NextResponse.json({
            success: true,
            deletedCount: result.count
        });
    } catch (error: any) {
        console.error('Cleanup error:', error);
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
