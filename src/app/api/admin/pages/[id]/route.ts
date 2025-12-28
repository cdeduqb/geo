import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const params = await props.params;
        const id = params.id;

        const body = await request.json();
        const { title, slug, content, status, type, editorMode } = body;

        // Check if page exists
        const existingPage = await db.page.findUnique({
            where: { id },
        });

        if (!existingPage) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        // Update page
        const page = await db.page.update({
            where: { id },
            data: {
                title,
                slug,
                content,
                status,
                type,
                editorMode,
            },
        });

        return NextResponse.json({ success: true, page });
    } catch (error) {
        console.error('Error updating page:', error);
        return NextResponse.json(
            { error: 'Failed to update page', details: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const params = await props.params;
        const id = params.id;

        const page = await db.page.findUnique({
            where: { id },
            include: {
                seo: true,
            },
        });

        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, page });
    } catch (error) {
        console.error('Error fetching page:', error);
        return NextResponse.json(
            { error: 'Failed to fetch page' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        await requireAuth();
        const params = await props.params;
        const id = params.id;

        await db.page.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting page:', error);
        return NextResponse.json(
            { error: 'Failed to delete page' },
            { status: 500 }
        );
    }
}
