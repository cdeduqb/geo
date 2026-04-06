import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const kb = await db.knowledgeBase.findUnique({
            where: { id: params.id }
        });

        if (!kb) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(kb);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const data = {
            name: body.name,
            productServices: body.productServices || null,
            productFeatures: body.productFeatures || null,
            brandStory: body.brandStory || null,
            userPainPoints: body.userPainPoints || null,
            trustEndorsement: body.trustEndorsement || null,
            customerCases: body.customerCases || null,
            otherInfo: body.otherInfo || null,
            lang: body.lang || 'zh',
            isActive: body.isActive !== undefined ? body.isActive : true,
        };

        const kb = await db.knowledgeBase.update({
            where: { id: params.id },
            data
        });
        return NextResponse.json(kb);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await db.knowledgeBase.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
