// SEO Push Service - 改进版，包含重试机制和详细错误处理

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

// Baidu Push Service - 改进版
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

// 360 Push Service - 改进版
export class So360PushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        return this.pushWithRetry(
            () => fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    site_id: this.siteId,
                    token: this.token,
                    urls: urls,
                }),
            }),
            urls
        );
    }

    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        const data = await response.json();

        if (data.code === 0 || data.errno === 0) {
            return {
                success: true,
                message: data.message || data.errmsg || `成功推送 ${urlCount} 条URL`,
                response: data
            };
        } else {
            return {
                success: false,
                message: data.message || data.errmsg || '推送失败',
                response: data,
                details: {
                    errorType: '360返回错误',
                    suggestion: '请检查站点ID和Token是否正确'
                }
            };
        }
    }
}

// Sogou Push Service - 改进版
export class SogouPushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        return this.pushWithRetry(
            () => fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    token: this.token,
                    urls: urls.join(','),
                }).toString(),
            }),
            urls
        );
    }

    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        const data = await response.json();

        if (data.status === 'success' || data.code === 200) {
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
                    errorType: '搜狗返回错误',
                    suggestion: '请检查Token是否正确'
                }
            };
        }
    }
}

// Toutiao Push Service - 改进版
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

// IndexNow Push Service - 支持 Bing, Yandex 等
export class IndexNowPushService extends SEOPushService {
    async push(urls: string[]): Promise<PushResult> {
        return this.pushWithRetry(
            () => fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify({
                    host: this.siteId, // 域名
                    key: this.token,   // API Key
                    keyLocation: `https://${this.siteId}/${this.token}.txt`, // 验证文件路径
                    urlList: urls,
                }),
            }),
            urls
        );
    }

    protected async parseSuccessResponse(response: Response, urlCount: number): Promise<PushResult> {
        // IndexNow returns 200/202 with empty body or metadata
        let data = {};
        try {
            const text = await response.text();
            data = text ? JSON.parse(text) : { success: true };
        } catch (e) {
            // 忽略解析错误
        }

        return {
            success: true,
            message: `IndexNow推送成功：${urlCount} 条URL`,
            response: data
        };
    }
}

// Factory function
export function createPushService(
    platform: string,
    apiUrl: string,
    token: string,
    siteId?: string
): SEOPushService {
    switch (platform) {
        case 'baidu':
            return new BaiduPushService(apiUrl, token, siteId);
        case '360':
            return new So360PushService(apiUrl, token, siteId);
        case 'sogou':
            return new SogouPushService(apiUrl, token, siteId);
        case 'toutiao':
            return new ToutiaoPushService(apiUrl, token, siteId);
        case 'indexnow':
            return new IndexNowPushService(apiUrl, token, siteId);
        default:
            throw new Error(`Unknown platform: ${platform}`);
    }
}
