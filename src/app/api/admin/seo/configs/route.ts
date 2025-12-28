import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/seo/configs - List all configs
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const configs = await db.sEOPushConfig.findMany({
            orderBy: { platform: 'asc' },
        });

        return NextResponse.json(configs);
    } catch (error) {
        console.error('Error fetching SEO configs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/seo/configs - Create new config
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { platform, apiUrl, token, siteId, isActive } = body;

        if (!platform || !apiUrl || !token) {
            return NextResponse.json({ error: 'Platform, API URL and token are required' }, { status: 400 });
        }

        const config = await db.sEOPushConfig.create({
            data: {
                platform,
                apiUrl,
                token,
                siteId,
                isActive: isActive ?? true,
            },
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error creating SEO config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/admin/seo/configs - Update config
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, platform, apiUrl, token, siteId, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const config = await db.sEOPushConfig.update({
            where: { id },
            data: {
                platform,
                apiUrl,
                token,
                siteId,
                isActive,
            },
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating SEO config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/seo/configs - Delete config
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await db.sEOPushConfig.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting SEO config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
