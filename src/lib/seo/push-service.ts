// SEO Push Service - 精简版，仅保留百度、头条、IndexNow、Google 四个平台

export interface PushResult {
    success: boolean;
    message: string;
    response?: any;
    details?: {
        errorType?: string;
        suggestion?: string;
        statusCode?: number;
    };
}

export abstract class SEOPushService {
    protected apiUrl: string;
    protected token: string;
    protected siteId?: string;
    protected maxRetries: number = 3;
    protected retryDelay: number = 1000; // 1秒

    constructor(apiUrl: string, token: string, siteId?: string) {
        this.apiUrl = apiUrl;
        this.token = token;
        this.siteId = siteId;
    }

    abstract push(urls: string[]): Promise<PushResult>;

    /**
     * 带重试的推送方法
     */
    protected async pushWithRetry(
        pushFn: () => Promise<Response>,
        urls: string[]
    ): Promise<PushResult> {
        let lastError: any;

        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
            try {
                const response = await pushFn();

                // 检查HTTP状态码
                if (!response.ok) {
                    const errorResult = await this.handleHttpError(response);

                    // 如果是服务器错误（5xx），重试
                    if (response.status >= 500 && attempt < this.maxRetries) {
                        await this.delay(this.retryDelay * attempt);
                        continue;
                    }

                    return errorResult;
                }

                return await this.parseSuccessResponse(response, urls.length);
            } catch (error: any) {
                lastError = error;

                // 网络错误，重试
                if (attempt < this.maxRetries) {
                    await this.delay(this.retryDelay * attempt);
                    continue;
                }
            }
        }

        // 所有重试都失败
        return this.handleNetworkError(lastError);
    }

    /**
     * 处理HTTP错误响应
     */
    protected async handleHttpError(response: Response): Promise<PushResult> {
        const statusCode = response.status;
        let errorType = '未知错误';
        let suggestion = '请联系管理员';

        switch (true) {
            case statusCode === 400:
                errorType = '请求参数错误';
                suggestion = '请检查URL格式是否正确，或者推送数量是否超过限制';
                break;
            case statusCode === 401:
                errorType = 'Token无效';
                suggestion = '请检查Token是否正确，或者是否已过期';
                break;
            case statusCode === 403:
                errorType = '权限不足';
                suggestion = '请检查Token权限，或者站点ID是否正确';
                break;
            case statusCode === 404:
                errorType = 'API地址错误';
                suggestion = '请检查API地址是否正确';
                break;
            case statusCode === 422:
                errorType = '参数验证失败';
                suggestion = '请检查站点域名是否与推送URL的域名一致';
                break;
            case statusCode === 429:
                errorType = '请求过于频繁';
                suggestion = '已达到速率限制，请稍后再试';
                break;
            case statusCode >= 500:
                errorType = '服务器错误';
                suggestion = '搜索引擎服务器暂时不可用，请稍后重试';
                break;
        }

        let responseText = '';
        try {
            responseText = await response.text();
        } catch (e) {
            // 忽略解析错误
        }

        return {
            success: false,
            message: `推送失败 (HTTP ${statusCode})`,
            details: {
                errorType,
                suggestion,
                statusCode
            },
            response: responseText
        };
    }

    /**
     * 处理网络错误
     */
    protected handleNetworkError(error: any): PushResult {
        let errorType = '网络错误';
        let suggestion = '请检查网络连接';

        if (error.message.includes('timeout')) {
            errorType = '请求超时';
            suggestion = '网络连接超时，请检查网络或稍后重试';
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('DNS')) {
            errorType = 'DNS解析失败';
            suggestion = '无法解析API地址，请检查API地址是否正确';
        } else if (error.message.includes('ECONNREFUSED')) {
            errorType = '连接被拒绝';
            suggestion = '无法连接到API服务器，请检查API地址';
        }

        return {
            success: false,
            message: `网络错误：${error.message}`,
            details: {
                errorType,
                suggestion
            }
        };
    }

    /**
     * 解析成功响应（子类可以覆盖）
     */
    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        const data = await response.json();
        return {
            success: true,
            message: `成功推送 ${urlCount} 条URL`,
            response: data
        };
    }

    /**
     * 延迟函数
     */
    protected delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ========== 百度推送服务 ==========
export class BaiduPushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        return this.pushWithRetry(
            () => fetch(
                `${this.apiUrl}?site=${this.siteId}&token=${this.token}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: urls.join('\n'),
                }
            ),
            urls
        );
    }

    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        const data = await response.json();

        if (data.success || data.remain !== undefined) {
            return {
                success: true,
                message: `成功推送 ${data.success || urlCount} 条URL，今日剩余配额：${data.remain || '未知'}`,
                response: data
            };
        } else {
            return {
                success: false,
                message: data.message || '推送失败',
                response: data,
                details: {
                    errorType: '百度返回错误',
                    suggestion: '请检查站点ID和Token是否正确'
                }
            };
        }
    }
}

// ========== 头条推送服务 ==========
export class ToutiaoPushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        return this.pushWithRetry(
            () => fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: this.token,
                    urls: urls,
                }),
            }),
            urls
        );
    }

    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        const data = await response.json();

        if (data.code === 0) {
            return {
                success: true,
                message: data.message || `成功推送 ${urlCount} 条URL`,
                response: data
            };
        } else {
            return {
                success: false,
                message: data.message || '推送失败',
                response: data,
                details: {
                    errorType: '头条返回错误',
                    suggestion: '请检查Token是否正确'
                }
            };
        }
    }
}

// ========== IndexNow 推送服务 (支持 Bing, Yandex, Seznam 等) ==========
export class IndexNowPushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        if (!urls || urls.length === 0) {
            return { success: false, message: '没有发现待推送的 URL' };
        }

        // 从待推送的 URL 中提取 Host，确保与 IndexNow 要求完全匹配
        let host = '';
        let keyLocationBase = '';

        try {
            const firstUrl = new URL(urls[0]);
            host = firstUrl.hostname;
            keyLocationBase = firstUrl.origin;
        } catch (e) {
            // 如果 URL 解析失败，则回退到 siteId 配置
            host = this.siteId || '';
            if (host.startsWith('http')) {
                try {
                    const u = new URL(host);
                    host = u.hostname;
                    keyLocationBase = u.origin;
                } catch {
                    host = host.replace(/^https?:\/\//, '').split('/')[0];
                    keyLocationBase = (this.siteId?.startsWith('https') ? 'https://' : 'http://') + host;
                }
            } else {
                host = host.split('/')[0];
                keyLocationBase = `https://${host}`;
            }
        }

        const payload = JSON.stringify({
            host: host,
            key: this.token,
            keyLocation: `${keyLocationBase}/${this.token}.txt`,
            urlList: urls,
        });

        // 核心：在 push 到 IndexNow 全网 API 的同时，专门向 Bing 和 Yandex 原生端点猛推一次，提升收录速度
        const endpoints = [
            this.apiUrl,
            'https://www.bing.com/indexnow',
            'https://yandex.com/indexnow'
        ];

        // 仅返回主要 API 的结果
        let mainResult: PushResult | null = null;

        for (const endpoint of endpoints) {
            if (endpoint === this.apiUrl) {
                mainResult = await this.pushWithRetry(
                    () => fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json; charset=utf-8' },
                        body: payload,
                    }),
                    urls
                );
            } else {
                fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json; charset=utf-8' },
                    body: payload,
                }).catch(() => { }); // 忽略辅端点的失败
            }
        }

        return mainResult || { success: false, message: '未执行推送' };
    }

    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        let data: any = { status: response.status };
        try {
            const text = await response.text();
            if (text) data = { ...data, ...JSON.parse(text) };
        } catch (e) {
            // IndexNow 成功时可能返回空 body
        }

        return {
            success: true,
            message: `IndexNow 推送成功：${urlCount} 条URL (HTTP ${response.status})`,
            response: data
        };
    }
}

// ========== Google Indexing API 服务 ==========
export class GooglePushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        if (!urls || urls.length === 0) {
            return { success: false, message: '没有待推送的 URL' };
        }

        // Google Indexing API 每次只能推送一个 URL
        const results: { url: string; success: boolean; error?: string }[] = [];
        let successCount = 0;

        for (const url of urls) {
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`,
                    },
                    body: JSON.stringify({
                        url: url,
                        type: 'URL_UPDATED',
                    }),
                });

                if (response.ok) {
                    successCount++;
                    results.push({ url, success: true });
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    results.push({
                        url,
                        success: false,
                        error: errorData.error?.message || `HTTP ${response.status}`
                    });
                }
            } catch (err: any) {
                results.push({ url, success: false, error: err.message });
            }
        }

        const allSuccess = successCount === urls.length;
        return {
            success: successCount > 0,
            message: allSuccess
                ? `Google Indexing 推送成功：${successCount} 条URL`
                : `Google Indexing 推送完成：成功 ${successCount}/${urls.length}`,
            response: results,
            details: successCount === 0 ? {
                errorType: '全部失败',
                suggestion: '请确保 Token 是有效的 Google OAuth Access Token，且已授予 Indexing API 权限'
            } : undefined
        };
    }
}

// ========== 推送服务工厂函数 ==========
export function createPushService(
    platform: string,
    apiUrl: string,
    token: string,
    siteId?: string
): SEOPushService {
    switch (platform) {
        case 'baidu':
            return new BaiduPushService(apiUrl, token, siteId);
        case 'toutiao':
            return new ToutiaoPushService(apiUrl, token, siteId);
        case 'indexnow':
            return new IndexNowPushService(apiUrl, token, siteId);
        case 'google':
            return new GooglePushService(apiUrl, token, siteId);
        default:
            throw new Error(`不支持的平台: ${platform}。当前支持: baidu, toutiao, indexnow, google`);
    }
}
