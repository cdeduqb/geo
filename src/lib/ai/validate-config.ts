/**
 * AI Configuration Validation Library
 * Tests API connectivity for different AI providers
 */

export interface ValidationResult {
    success: boolean;
    message: string;
    details?: string;
}

/**
 * Validate OpenAI-compatible API
 */
async function validateOpenAICompatible(
    baseUrl: string,
    apiKey: string,
    modelName?: string
): Promise<ValidationResult> {
    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName || 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 5
            })
        });

        if (response.ok) {
            return {
                success: true,
                message: '配置验证成功！API 连接正常。'
            };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
            success: false,
            message: '配置验证失败',
            details: errorData.error?.message || `HTTP ${response.status}`
        };
    } catch (error: any) {
        return {
            success: false,
            message: '网络请求失败',
            details: error.message
        };
    }
}

/**
 * Validate OpenAI-compatible Image Generation API
 */
async function validateImageGeneration(
    baseUrl: string,
    apiKey: string,
    modelName?: string
): Promise<ValidationResult> {
    try {
        const response = await fetch(`${baseUrl}/images/generations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: modelName,
                prompt: 'A simple test image',
                n: 1,
                size: '1024x1024'
            })
        });

        if (response.ok) {
            return {
                success: true,
                message: '图片生成配置验证成功！API 连接正常。'
            };
        }

        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error?.message || '';
        if (errorMsg.includes('quota') || errorMsg.includes('balance') || errorMsg.includes('exceeded')) {
            return {
                success: true,
                message: '配置验证成功（账户可能余额不足）',
                details: errorMsg
            };
        }

        return {
            success: false,
            message: '图片生成配置验证失败',
            details: errorData.error?.message || `HTTP ${response.status}`
        };
    } catch (error: any) {
        return {
            success: false,
            message: '网络请求失败',
            details: error.message
        };
    }
}

/**
 * Validate Gemini API
 */
async function validateGemini(
    baseUrl: string,
    apiKey: string,
    modelName?: string
): Promise<ValidationResult> {
    try {
        const model = modelName || 'gemini-pro';
        const url = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: 'Hello' }]
                }]
            })
        });

        if (response.ok) {
            return {
                success: true,
                message: 'Gemini 配置验证成功！'
            };
        }

        const errorData = await response.json().catch(() => ({}));
        return {
            success: false,
            message: 'Gemini 配置验证失败',
            details: errorData.error?.message || `HTTP ${response.status}`
        };
    } catch (error: any) {
        return {
            success: false,
            message: '网络请求失败',
            details: error.message
        };
    }
}

/**
 * Validate Baidu Wenxin API
 */
async function validateBaidu(
    apiKey: string,
    secretKey: string
): Promise<ValidationResult> {
    try {
        const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.access_token) {
                return {
                    success: true,
                    message: '百度文心配置验证成功！'
                };
            }
        }

        const errorData = await response.json().catch(() => ({}));
        return {
            success: false,
            message: '百度文心配置验证失败',
            details: errorData.error_description || errorData.error || `HTTP ${response.status}`
        };
    } catch (error: any) {
        return {
            success: false,
            message: '网络请求失败',
            details: error.message
        };
    }
}

/**
 * Main validation function
 */
export async function validateAIConfig(
    provider: string,
    baseUrl: string,
    apiKey: string,
    modelName?: string,
    secretKey?: string,
    useCase?: string
): Promise<ValidationResult> {
    if (!baseUrl || !apiKey) {
        return {
            success: false,
            message: '请提供完整的 Base URL 和 API Key'
        };
    }

    // 如果用途是图片生成，使用图片 API 验证
    if (useCase === 'IMAGE') {
        return validateImageGeneration(baseUrl.replace(/\/$/, ''), apiKey, modelName);
    }

    // Remove trailing slashes
    baseUrl = baseUrl.replace(/\/$/, '');

    switch (provider) {
        case 'gemini':
            return validateGemini(baseUrl, apiKey, modelName);

        case 'baidu':
            if (!secretKey) {
                return {
                    success: false,
                    message: '百度文心需要 Secret Key'
                };
            }
            return validateBaidu(apiKey, secretKey);

        case 'deepseek':
        case 'openai':
        case 'volcano':
        case 'qwen':
        case 'minimax':
        case 'kimi':
        case 'zhipu':
        case 'custom':
        default:
            // These all use OpenAI-compatible API
            return validateOpenAICompatible(baseUrl, apiKey, modelName);
    }
}
