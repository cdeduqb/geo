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
                }, 4000); // 缩短至 4 秒一次，更激进地维持连接

                try {
                    // 立即发送一个空格建立连接
                    controller.enqueue(encoder.encode(' '));

                    // 执行耗时的 AI 任务
                    const cleanContent = await ContentPipelineService.optimizeGeo(title, content, keywords, lang);

                    clearInterval(heartbeat);

                    // 发送最终结果
                    // 浏览器端的 response.json() 会自动忽略前导空格
                    controller.enqueue(encoder.encode(JSON.stringify({ content: cleanContent })));
                    controller.close();
                } catch (error: any) {
                    clearInterval(heartbeat);
                    console.error('[Optimize API] Stream Error:', error);
                    controller.enqueue(encoder.encode(JSON.stringify({
                        error: error.message || '优化过程中出现错误'
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
                'X-Accel-Buffering': 'no', // 强制禁用 Nginx 缓冲区，确保心跳即时到达
            }
        });

    } catch (error: any) {
        console.error('[Optimize API] Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
