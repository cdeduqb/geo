import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

/**
 * 按需重新验证静态页面
 * 格式: /api/revalidate?path=/articles/xxx
 */
export async function POST(request: NextRequest) {
    try {
        // 验证管理员权限
        await requireAdmin();

        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');

        if (!path) {
            return NextResponse.json({ error: 'Path is required' }, { status: 400 });
        }

        console.log(`[Revalidate] Revalidating path: ${path}`);

        // 执行重新验证
        revalidatePath(path);

        // 如果是文章路径，同时也尝试重新验证多语言路径
        if (path.startsWith('/articles/')) {
            const slug = path.replace('/articles/', '');
            // 这里可以根据实际支持的语言列表来循环
            // 简单起见，重新验证核心路径和常见的语言前缀
            revalidatePath(`/en/articles/${slug}`);
            revalidatePath(`/zh/articles/${slug}`);
        }

        return NextResponse.json({
            success: true,
            revalidated: true,
            now: Date.now(),
            path
        });
    } catch (error) {
        console.error('Revalidation error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
