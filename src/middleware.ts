import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n';

// AI 爬虫特征字符串（小写，用于 User-Agent 匹配）
const AI_CRAWLER_KEYWORDS = [
    // 国际主流
    'gptbot', 'chatgpt-user', 'oai-searchbot', 'claudebot', 'claude-web', 'anthropic-ai',
    'google-extended', 'googlebot', 'perplexitybot', 'meta-externalagent', 'facebookexternalhit',
    'applebot', 'bingbot', 'amazonbot', 'ccbot',
    // 国内主流
    'bytespider', 'baiduspider', 'deepseekbot', 'moonshotbot', 'qwenbot', 'tongyibot',
    'tencentbot', 'zhipubot', '360spider', 'sogou-spider', 'yisouspider',
    'baichuanbot', 'minimaxbot', 'petalbot'
];



export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 0. 站点验证文件拦截 (Site Verification)
    // 如果是 .html 结尾的请求，尝试从数据库读取验证文件
    if (pathname.endsWith('.html') && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
        const url = request.nextUrl.clone();
        url.pathname = '/api/seo/verify';
        const filename = pathname.substring(1); // 去掉开头的 /
        url.searchParams.set('filename', filename);

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-verify-filename', filename);

        return NextResponse.rewrite(url, {
            request: {
                headers: requestHeaders
            }
        });
    }

    const userAgent = request.headers.get('user-agent') || '';

    // 0. 语言检测
    let locale = defaultLocale;
    const segments = pathname.split('/');
    if (segments.length > 1 && (locales as unknown as string[]).includes(segments[1])) {

        locale = segments[1] as any;
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-locale', locale);

    // 1. AI 爬虫日志记录 (仅针对非静态资源和非 admin 路由)
    if (!pathname.startsWith('/admin') &&
        !pathname.startsWith('/_next') &&
        !pathname.startsWith('/favicon.ico') &&
        !pathname.match(/\.(jpg|jpeg|png|gif|svg|css|js)$/)) {

        const lowerUA = userAgent.toLowerCase();
        const matchedCrawler = AI_CRAWLER_KEYWORDS.find(keyword => lowerUA.includes(keyword));

        if (matchedCrawler) {
            // 异步记录日志 - 发送请求到内部 API 以避免阻塞
            // 注意：在 Next.js Edge Middleware 中也可以直接调 DB，但为了性能通常建议通过 API
            // 这里我们使用 fetch 并在背景执行（不 await）
            const logData = {
                crawler: matchedCrawler,
                userAgent: userAgent.substring(0, 500), // 截断过长 UA
                path: pathname,
                ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
                referer: request.headers.get('referer') || '',
                statusCode: 200 // 默认记录 200，实际状态码难以在中间件响应后捕获
            };

            // 使用 waitUntil 确保异步请求完成
            /*
            // 注意：waitUntil 仅在 Vercel 等 Edge 环境有效。
            // 在 Node 环境中，我们直接 fetch 且不 await，依赖 Node 事件循环处理
            fetch(`${request.nextUrl.origin}/api/internal/log-crawler`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(logData)
            }).catch(err => console.error('Crawler log error', err));
            */

            // 直接调用内部 API (Edge compatible approach if needed, but for now simple fetch)
            // 注意：生产环境可能需要鉴权保护此内部 API
            // 异步记录日志
            fetch(`${request.nextUrl.origin}/api/internal/log-crawler`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(logData)
            }).catch(e => console.error('Crawler Log Error:', e.message));
        }
    }

    // 2. 鉴权保护
    // 保护 /admin 路由
    if (pathname.startsWith('/admin')) {
        // 使用自定义 session cookie 验证
        const sessionCookie = request.cookies.get('session')?.value;

        if (!sessionCookie) {
            const url = new URL('/login', request.url);
            url.searchParams.set('callbackUrl', encodeURI(request.url));
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders
        }
    });
}

export const config = {
    matcher: [
        // 匹配所有路径，但排除静态资源
        '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
    ],
};
