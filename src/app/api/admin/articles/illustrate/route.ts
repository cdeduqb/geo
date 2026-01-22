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

        // 使用 ReadableStream 发送空格心跳，防止 504 超时
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                // 每 5 秒发送一个空格作为心跳
                const heartbeat = setInterval(() => {
                    try {
                        controller.enqueue(encoder.encode(' '));
                    } catch (e) {
                        clearInterval(heartbeat);
                    }
                }, 4000);

                try {
                    // 立即发送一个空格建立连接
                    controller.enqueue(encoder.encode(' '));

                    // 执行耗时的 AI 任务
                    const newContent = await ContentPipelineService.illustrate(title, content, user.id, lang);

                    clearInterval(heartbeat);

                    // 发送最终结果
                    controller.enqueue(encoder.encode(JSON.stringify({
                        content: newContent,
                        message: '配图强化处理完成'
                    })));
                    controller.close();
                } catch (error: any) {
                    clearInterval(heartbeat);
                    console.error('[Illustrate API] Stream Error:', error);
                    controller.enqueue(encoder.encode(JSON.stringify({
                        error: error.message || '配图处理过程中出现错误'
                    })));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            }
        });

    } catch (error: any) {
        console.error('[Illustrate API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
