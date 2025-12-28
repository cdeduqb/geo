import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ContentPipelineService } from '@/lib/ai/pipeline';

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, content, lang = 'zh' } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        console.log(`[Illustrate API] Processing via Service (lang: ${lang})...`);
        const newContent = await ContentPipelineService.illustrate(title, content, user.id, lang);

        return NextResponse.json({
            content: newContent,
            message: '配图强化处理完成'
        });

    } catch (error: any) {
        console.error('[Illustrate API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
