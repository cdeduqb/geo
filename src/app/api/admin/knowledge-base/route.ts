import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { LicenseManager } from '@/lib/license';

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!LicenseManager.hasFeature('ai')) {
            return NextResponse.json({ error: 'Forbidden', message: '需要购买AI商业授权才能使用此功能。' }, { status: 403 });
        }

        const list = await db.knowledgeBase.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(list);
    } catch (error) {
        console.error('Error fetching knowledge bases:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!LicenseManager.hasFeature('ai')) {
            return NextResponse.json({ error: 'Forbidden', message: '需要购买AI商业授权才能使用此功能。' }, { status: 403 });
        }

        const body = await request.json();
        const data = {
            name: body.name,
            productServices: body.productServices || '',
            productFeatures: body.productFeatures || '',
            brandStory: body.brandStory || '',
            userPainPoints: body.userPainPoints || '',
            trustEndorsement: body.trustEndorsement || '',
            customerCases: body.customerCases || '',
            otherInfo: body.otherInfo || '',
            lang: body.lang || 'zh',
            isActive: body.isActive !== undefined ? body.isActive : true,
        };

        const kb = await db.knowledgeBase.create({ data });
        return NextResponse.json(kb);
    } catch (error: any) {
        console.error('Error creating knowledge base:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
