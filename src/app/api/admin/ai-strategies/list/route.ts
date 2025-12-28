import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const strategies = await db.aIStrategy.findMany({
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                targetType: true,
                prompt: true,
            }
        });

        return NextResponse.json(strategies);
    } catch (error: any) {
        console.error('Error fetching strategies:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
