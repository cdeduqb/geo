import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: 'Missing or invalid ids' }, { status: 400 });
        }

        // Delete article related records first if necessary (though cascade delete might handle it)
        // Prisma schema should handle relations (SEO, etc) if configured, otherwise we might need to delete manually.
        // Assuming relation setup handles cascades or we just delete main article.

        const deleteResult = await db.article.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        return NextResponse.json({ count: deleteResult.count });

    } catch (error) {
        console.error('Batch delete error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
