import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ContentPipelineService } from '@/lib/ai/pipeline';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, keywords, lang = 'zh' } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        console.log(`[Optimize API] Generating optimized content via Service (lang: ${lang})...`);
        const cleanContent = await ContentPipelineService.optimizeGeo(title, content, keywords, lang);

        return NextResponse.json({ content: cleanContent });

    } catch (error: any) {
        console.error('[Optimize API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
