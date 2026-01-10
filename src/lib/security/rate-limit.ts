import { NextRequest, NextResponse } from 'next/server';

/**
 * 简单的内存型速率限制器
 * 生产环境建议使用 Redis
 */

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

// 存储每个 IP 的请求次数
const requestCounts = new Map<string, RateLimitEntry>();

// 清理过期记录（每小时执行一次）
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of requestCounts.entries()) {
        if (now > entry.resetTime) {
            requestCounts.delete(ip);
        }
    }
}, 60 * 60 * 1000);

export interface RateLimitOptions {
    /**
     * 时间窗口（秒）
     */
    windowSeconds: number;

    /**
     * 时间窗口内允许的最大请求数
     */
    maxRequests: number;

    /**
     * 自定义错误消息
     */
    message?: string;
}

/**
 * 获取客户端 IP 地址
 */
export function getClientIP(request: NextRequest): string {
    // 优先从反向代理头获取真实 IP
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp;
    }

    // 从 socket 获取（开发环境）
    return '127.0.0.1';
}

/**
 * 速率限制检查
 * @returns 如果超过限制返回 NextResponse（429），否则返回 null
 */
export function checkRateLimit(
    request: NextRequest,
    options: RateLimitOptions
): NextResponse | null {
    const ip = getClientIP(request);
    const now = Date.now();
    const windowMs = options.windowSeconds * 1000;

    let entry = requestCounts.get(ip);

    if (!entry || now > entry.resetTime) {
        // 第一次请求或窗口已过期，创建新记录
        entry = {
            count: 1,
            resetTime: now + windowMs,
        };
        requestCounts.set(ip, entry);
        return null;
    }

    // 检查是否超过限制
    if (entry.count >= options.maxRequests) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        return NextResponse.json(
            {
                error: options.message || '请求过于频繁，请稍后再试',
                retryAfter: retryAfter,
            },
            {
                status: 429,
                headers: {
                    'Retry-After': retryAfter.toString(),
                    'X-RateLimit-Limit': options.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': Math.ceil(entry.resetTime / 1000).toString(),
                },
            }
        );
    }

    // 增加计数
    entry.count++;
    requestCounts.set(ip, entry);

    return null;
}

/**
 * 预设的速率限制配置
 */
export const RateLimitPresets = {
    /** 登录接口：5 次/分钟 */
    LOGIN: {
        windowSeconds: 60,
        maxRequests: 5,
        message: '登录尝试次数过多，请 1 分钟后再试',
    },

    /** 文件上传：10 次/分钟 */
    UPLOAD: {
        windowSeconds: 60,
        maxRequests: 10,
        message: '上传频率过高，请稍后再试',
    },

    /** AI API：20 次/分钟 */
    AI_API: {
        windowSeconds: 60,
        maxRequests: 20,
        message: 'AI 请求过于频繁，请稍后再试',
    },

    /** 一般 API：100 次/分钟 */
    GENERAL_API: {
        windowSeconds: 60,
        maxRequests: 100,
        message: 'API 请求过于频繁，请稍后再试',
    },

    /** 邮件发送：3 次/小时 */
    EMAIL: {
        windowSeconds: 3600,
        maxRequests: 3,
        message: '邮件发送次数已达上限，请稍后再试',
    },
} as const;

/**
 * 辅助函数：在 API 路由中使用速率限制
 */
export function withRateLimit(
    handler: (request: NextRequest) => Promise<NextResponse>,
    options: RateLimitOptions
) {
    return async (request: NextRequest) => {
        const rateLimitResponse = checkRateLimit(request, options);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }
        return handler(request);
    };
}
