import { generateFeed } from '@/lib/feed';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const feed = await generateFeed();
        
        return new NextResponse(feed.rss2(), {
            headers: {
                'Content-Type': 'application/xml; charset=utf-8',
                'Cache-Control': 's-maxage=1200, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('Error generating RSS feed:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
