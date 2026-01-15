import { db } from '@/lib/db';
import { logger } from '@/lib/logger';

export interface AICompletionRequest {
    topic: string;
    keywords?: string;
    length?: 'short' | 'medium' | 'long';
    model?: string;
    customPrompt?: string;
}

export interface AICompletionResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface AIService {
    generateContent(prompt: string, options?: { response_format?: { type: 'text' | 'json_object' } }): Promise<string>;
    generateArticle(request: AICompletionRequest): Promise<AICompletionResponse>;
    generateImage(prompt: string, size?: string): Promise<{ url: string; alt: string; description: string }>;
}

export class MockAIService implements AIService {
    async generateContent(prompt: string, options?: { response_format?: { type: 'text' | 'json_object' } }): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if the prompt is asking for an outline (contains "JSON" or "outline")
        if (prompt.includes('大纲') || prompt.includes('JSON') || options?.response_format?.type === 'json_object') {
            return JSON.stringify({
                title: "Mock AI 生成的大纲示例",
                sections: [
                    {
                        title: "第一章：Mock 服务简介",
                        subsections: ["什么是 Mock 服务", "为什么需要 Mock"],
                        points: ["模拟真实 API", "用于开发和测试"]
                    },
                    {
                        title: "第二章：数据库连接问题",
                        subsections: ["连接失败的原因", "如何解决"],
                        points: ["检查配置", "检查网络"]
                    },
                    {
                        title: "第三章：AI 生成流程",
                        subsections: ["大纲生成", "初稿生成"],
                        points: ["结构化数据", "内容填充"]
                    }
                ]
            });
        }

        return `Mock AI Response for: ${prompt.substring(0, 20)}...`;
    }

    async generateImage(prompt: string, size: string = '1024x1024'): Promise<{ url: string; alt: string; description: string }> {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
            url: `https://placehold.co/${size.replace('x', 'x')}/EEE/31343C?text=${encodeURIComponent(prompt.substring(0, 10))}`,
            alt: `Mock generated image for: ${prompt}`,
            description: `A mock image generated for the prompt: ${prompt}`
        };
    }

    async generateArticle(request: AICompletionRequest): Promise<AICompletionResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (request.customPrompt) {
            return {
                content: `
                    <h1>${request.topic}</h1>
                    <p>这是一篇基于自定义 Prompt 生成的文章草稿。</p>
                    <div class="custom-prompt-result">
                        <p>Mock AI 根据以下 Prompt 生成了内容：</p>
                        <pre>${request.customPrompt.substring(0, 50)}...</pre>
                    </div>
                `,
                usage: {
                    promptTokens: 50,
                    completionTokens: 200,
                    totalTokens: 250
                }
            };
        }

        return {
            content: `
                <h1>${request.topic}</h1>
                <p>这是一篇由 AI 自动生成的关于 <strong>${request.topic}</strong> 的文章草稿。</p>

                    <h2>什么是 ${request.topic}？</h2>
                    <p><strong>${request.topic}</strong> 是一个...</p>
                </div>
                <h2>主要特点</h2>
                <ul>
                    <li><strong>特点一</strong>：...</li>
                    <li><strong>特点二</strong>：...</li>
                </ul>
                <h2>详细分析</h2>
                <h3>核心优势</h3>
                <p>...</p>
                <h3>应用场景</h3>
                <p>...</p>
                <h2>常见问题 (FAQ)</h2>
                <dl>
                    <dt>Q1: ...?</dt>
                    <dd>A1: ...</dd>
                </dl>
                <blockquote>
                    <p>这是一个模拟的 AI 生成结果（GEO 优化版）。</p>
                </blockquote>
            `,
            usage: {
                promptTokens: 50,
                completionTokens: 200,
                totalTokens: 250
            }
        };
    }
}

export class OpenAIService implements AIService {
    private apiKey: string;
    private baseUrl: string;
    private model: string;

    constructor(apiKey: string, baseUrl: string, model: string = 'gpt-3.5-turbo') {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async generateContent(prompt: string, options?: { response_format?: { type: 'text' | 'json_object' } }): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000); // 300s timeout

        try {
            logger.info(`[AIService] Calling ${this.model} at ${this.baseUrl} for generateContent`);
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    response_format: options?.response_format
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`AI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content || '';
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('AI Service Error:', error);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('AI request timed out after 300s');
            }
            throw error;
        }
    }

    async generateArticle(request: AICompletionRequest): Promise<AICompletionResponse> {
        const prompt = request.customPrompt || this.buildPrompt(request);

        try {
            logger.info(`[AIService] Calling ${this.model} at ${this.baseUrl} for generateArticle`);
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的文章写作助手，擅长撰写高质量、SEO友好的技术和商业文章。请直接输出HTML格式的内容 (h2, h3, p, ul, li, table) 等。核心要求：1. **自然去AI化**：使用通俗、流畅、“人话”的表达方式，避免机械僵硬的翻译腔，让读者感觉是由真实专家撰写。2. **合规性约束**：严禁出现任何违反中国法律法规的内容，严禁包含色情、暴力、赌博、政治敏感等违禁信息。3. **广告法合规**：严禁使用最高级形容词（如“第一”、“最强”、“完美”、“顶级”、“首选”等），除非引用客观事实数据。请保持客观、中立、专业的语气。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`AI API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)} `);
            }

            const data = await response.json();

            const content = data.choices[0]?.message?.content || '';
            const usage = data.usage ? {
                promptTokens: data.usage.prompt_tokens,
                completionTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
            } : undefined;

            return { content, usage };
        } catch (error) {
            console.error('AI Service Error:', error);
            throw error;
        }
    }

    private buildPrompt(request: AICompletionRequest): string {
        const lengthMap = {
            short: '500字左右',
            medium: '1000字左右',
            long: '2000字以上'
        };
        const lengthText = lengthMap[request.length || 'medium'];

        return `
            请以"${request.topic}"为主题写一篇文章，需严格遵循 GEO (Generative Engine Optimization) 优化标准。
            ${request.keywords ? `核心关键词：${request.keywords}` : ''}
            篇幅要求：${lengthText}

            文章结构与内容要求：
            1.  **直接回答 (Direct Answer)**：文章开头必须包含一段简明扼要的定义或核心结论（约50-80字），便于 AI 搜索引擎提取为 Featured Snippet。
            2.  **权威语气**：使用客观、专业、权威的语气，避免空洞的形容词，多用数据和事实支撑。
            3.  **结构化数据**：必须包含至少一个列表 (<ul>/ol) 或表格 (<table>) 来展示关键数据、对比或步骤。
            4.  **语义化标签**：
                *   使用 <h2> 作为主要章节标题。
                *   使用 <h3> 作为子章节标题。
                *   使用 <strong> 或 <b> 标签强调重要的实体名词和关键概念。
            5.  **Q&A 模块**：文章末尾必须包含一个“常见问题 (FAQ)”章节，列出 3-5 个用户最关心的问题并给出简短准确的回答。

            输出格式要求：
            *   仅输出 HTML \`<body>\` 内部的内容。
            *   **不要**包含 \`\`\`html 或 \`\`\` 标记。
            *   **不要**包含 <html>, <head>, <body> 标签。
            *   段落使用 <h> 标签。
        `;
    }

    async generateImage(prompt: string, size: string = '1024x1024'): Promise<{ url: string; alt: string; description: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model || 'dall-e-3',
                    prompt: prompt,
                    n: 1,
                    size: size,
                    quality: 'standard',
                    response_format: 'url'
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`OpenAI Image API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const url = data.data?.[0]?.url;
            const revisedPrompt = data.data?.[0]?.revised_prompt;

            if (!url) throw new Error('No image URL returned from OpenAI');

            return {
                url,
                alt: revisedPrompt || prompt,
                description: revisedPrompt || prompt
            };
        } catch (error) {
            console.error('OpenAI Image Generation Error:', error);
            throw error;
        }
    }
}

export class GeminiService implements AIService {
    private apiKey: string;
    private model: string;
    private baseUrl: string;

    constructor(apiKey: string, model: string = 'gemini-pro') {
        this.apiKey = apiKey;
        this.model = model;
        this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    }

    async generateContent(prompt: string, options?: { response_format?: { type: 'text' | 'json_object' } }): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000);

        try {
            const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                    }
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)} `);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Gemini Service Error:', error);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Gemini request timed out after 300s');
            }
            throw error;
        }
    }

    async generateArticle(request: AICompletionRequest): Promise<AICompletionResponse> {
        try {
            const prompt = request.customPrompt || this.buildPrompt(request);

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }],
                    generationConfig: {
                        temperature: 0.7,
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

            // Gemini doesn't always return token usage in the same format, but we can try to extract if available
            // For now, we'll omit usage or estimate it
            return { content };
        } catch (error) {
            console.error('Gemini Service Error:', error);
            throw error;
        }
    }

    async generateImage(prompt: string, size?: string): Promise<{ url: string; alt: string; description: string }> {
        // Gemini Pro Vision is mostly for input, standard Gemini doesn't do image gen via this API yet (Imagen is separate)
        // For now, we'll return a Mock response or throw
        throw new Error("Gemini Image Generation not fully implemented yet");
    }

    private buildPrompt(request: AICompletionRequest): string {
        const lengthMap = {
            short: '500字左右',
            medium: '1000字左右',
            long: '2000字以上'
        };
        const lengthText = lengthMap[request.length || 'medium'];

        return `
            请以"${request.topic}"为主题写一篇文章，需严格遵循 GEO (Generative Engine Optimization) 优化标准。
            ${request.keywords ? `核心关键词：${request.keywords}` : ''}
            篇幅要求：${lengthText}

            文章结构与内容要求：
            1.  **直接回答 (Direct Answer)**：文章开头必须包含一段简明扼要的定义或核心结论（约50-80字），便于 AI 搜索引擎提取为 Featured Snippet。
            2.  **权威语气**：使用客观、专业、权威的语气，避免空洞的形容词，多用数据和事实支撑。
            3.  **结构化数据**：必须包含至少一个列表 (<ul>/ol) 或表格 (<table>) 来展示关键数据、对比或步骤。
            4.  **语义化标签**：
                *   使用 <h2> 作为主要章节标题。
                *   使用 <h3> 作为子章节标题。
                *   使用 <strong> 或 <b> 标签强调重要的实体名词和关键概念。
            5.  **Q&A 模块**：文章末尾必须包含一个“常见问题 (FAQ)”章节，列出 3-5 个用户最关心的问题并给出简短准确的回答。

            输出格式要求：
            *   仅输出 HTML \`<body>\` 内部的内容。
            *   **不要**包含 \`\`\`html 或 \`\`\` 标记。
            *   **不要**包含 <html>, <head>, <body> 标签。
            *   段落使用 <p> 标签。
        `;
    }
}

export class BaiduAIService implements AIService {
    private apiKey: string;
    private secretKey: string;
    private model: string;
    private accessToken: string | null = null;
    private tokenExpiresAt: number = 0;

    constructor(apiKey: string, secretKey: string, model: string = 'completions_pro') {
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.model = model;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }

        const url = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.secretKey}`;
        const response = await fetch(url, { method: 'POST' });
        const data = await response.json();

        if (data.access_token) {
            this.accessToken = data.access_token;
            this.tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000; // Refresh 1 minute before expiry
            return this.accessToken!;
        }

        throw new Error(`Failed to get Baidu access token: ${JSON.stringify(data)}`);
    }

    async generateArticle(request: AICompletionRequest): Promise<AICompletionResponse> {
        try {
            const token = await this.getAccessToken();
            // Baidu API URL depends on the model, but for now we use a generic one or map it
            // Standard ERNIE-Bot-4.0 is 'completions_pro'
            // ERNIE-Bot-turbo is 'eb-instant'
            // We'll use the model name from config or default to completions_pro (ERNIE-4.0)

            // Mapping model names to endpoints if necessary, or just appending to base URL
            // For simplicity, we assume the user provides the correct endpoint suffix or we default to a common one
            // Actually, Baidu has different endpoints for different models.
            // Let's assume 'completions_pro' (ERNIE 4.0) as default.

            let endpoint = 'completions_pro';
            if (this.model.includes('turbo')) endpoint = 'eb-instant';
            if (this.model.includes('3.5')) endpoint = 'completions';

            // If the user provided a full model name that matches a known endpoint, use it
            if (['completions_pro', 'eb-instant', 'completions', 'ernie_bot_8k'].includes(this.model)) {
                endpoint = this.model;
            }

            const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${endpoint}?access_token=${token}`;

            const prompt = request.customPrompt || this.buildPrompt(request);

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    stream: false
                })
            });

            const data = await response.json();

            if (data.error_code) {
                throw new Error(`Baidu API Error: ${data.error_code} - ${data.error_msg}`);
            }

            return {
                content: data.result,
                usage: data.usage ? {
                    promptTokens: data.usage.prompt_tokens,
                    completionTokens: data.usage.completion_tokens,
                    totalTokens: data.usage.total_tokens
                } : undefined
            };

        } catch (error) {
            console.error('Baidu Service Error:', error);
            throw error;
        }
    }

    async generateContent(prompt: string): Promise<string> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 300000);

        try {
            const token = await this.getAccessToken();

            let endpoint = 'completions_pro';
            if (this.model.includes('turbo')) endpoint = 'eb-instant';
            if (this.model.includes('3.5')) endpoint = 'completions';
            if (['completions_pro', 'eb-instant', 'completions', 'ernie_bot_8k'].includes(this.model)) {
                endpoint = this.model;
            }

            const url = `https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/${endpoint}?access_token=${token}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'user', content: prompt }],
                    temperature: 0.7,
                    stream: false
                }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            const data = await response.json();

            if (data.error_code) {
                throw new Error(`Baidu API Error: ${data.error_code} - ${data.error_msg}`);
            }

            return data.result;

        } catch (error) {
            clearTimeout(timeoutId);
            console.error('Baidu Service Error:', error);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('Baidu request timed out after 300s');
            }
            throw error;
        }
    }


    async generateImage(prompt: string, size?: string): Promise<{ url: string; alt: string; description: string }> {
        throw new Error("Baidu Image Generation not implemented yet");
    }

    private buildPrompt(request: AICompletionRequest): string {
        const lengthMap = {
            short: '500字左右',
            medium: '1000字左右',
            long: '2000字以上'
        };
        const lengthText = lengthMap[request.length || 'medium'];

        return `
            请以"${request.topic}"为主题写一篇文章，需严格遵循 GEO (Generative Engine Optimization) 优化标准。
            ${request.keywords ? `核心关键词：${request.keywords}` : ''}
            篇幅要求：${lengthText}

            文章结构与内容要求：
            1.  **直接回答 (Direct Answer)**：文章开头必须包含一段简明扼要的定义或核心结论（约50-80字），便于 AI 搜索引擎提取为 Featured Snippet。
            2.  **权威语气**：使用客观、专业、权威的语气，避免空洞的形容词，多用数据和事实支撑。
            3.  **结构化数据**：必须包含至少一个列表 (<ul>/ol) 或表格 (<table>) 来展示关键数据、对比或步骤。
            4.  **语义化标签**：
                *   使用 <h2> 作为主要章节标题。
                *   使用 <h3> 作为子章节标题。
                *   使用 <strong> 或 <b> 标签强调重要的实体名词和关键概念。
            5.  **Q&A 模块**：文章末尾必须包含一个“常见问题 (FAQ)”章节，列出 3-5 个用户最关心的问题并给出简短准确的回答。

            输出格式要求：
            *   仅输出 HTML \`<body>\` 内部的内容。
            *   **不要**包含 \`\`\`html 或 \`\`\` 标记。
            *   **不要**包含 <html>, <head>, <body> 标签。
            *   段落使用 <p> 标签。
        `;
    }
}

export class VolcengineService implements AIService {
    private apiKey: string;
    private baseUrl: string;
    private model: string;

    constructor(apiKey: string, baseUrl: string, model: string) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
        this.model = model;
    }

    async generateContent(prompt: string, options?: { response_format?: { type: 'text' | 'json_object' } }): Promise<string> {
        return new OpenAIService(this.apiKey, this.baseUrl, this.model).generateContent(prompt, options);
    }

    async generateArticle(request: AICompletionRequest): Promise<AICompletionResponse> {
        return new OpenAIService(this.apiKey, this.baseUrl, this.model).generateArticle(request);
    }

    async generateImage(prompt: string, size: string = '1024x1024'): Promise<{ url: string; alt: string; description: string }> {
        try {
            const response = await fetch(`${this.baseUrl}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model, // Must be the Endpoint ID
                    prompt: prompt,
                    // n: 1, // Volcengine technically defaults to 1 but explicit is fine? Strictness check.
                    // size: size, // Volcengine supports specific sizes. '1024x1024' is standard.
                    // quality: 'standard', // Volcengine does NOT support 'quality' param for OpenAI interfaced images usually.
                    // response_format: 'url' // Volcengine supports this.
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Volcengine Image API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const url = data.data?.[0]?.url;

            if (!url) throw new Error('No image URL returned from Volcengine');

            return {
                url,
                alt: prompt,
                description: prompt
            };
        } catch (error) {
            console.error('Volcengine Image Generation Error:', error);
            throw error;
        }
    }
}

// ============================================================================
// Image Model Detection (to prevent using image models for text generation)
// ============================================================================

/**
 * 图像生成模型关键词列表（这些模型不支持文本对话 API）
 */
const IMAGE_MODEL_KEYWORDS = [
    'seedream',      // 豆包图像模型
    'dall-e',        // OpenAI 图像模型
    'midjourney',    // Midjourney
    'stable-diffusion', // Stable Diffusion
    'cogview',       // 智谱图像模型
    'wanx',          // 阿里万象图像模型
    'flux',          // Flux 图像模型
    'sd-',           // Stable Diffusion 变体
    'sdxl',          // SDXL
    'imagen'         // Google Imagen
];

/**
 * 检查模型是否为图像生成模型
 */
export function isImageGenerationModel(modelName: string | null): boolean {
    if (!modelName) return false;
    const lowerName = modelName.toLowerCase();
    return IMAGE_MODEL_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

/**
 * 从配置列表中过滤出文本模型（排除图像模型）
 */
export function filterTextModels<T extends { modelName: string | null }>(configs: T[]): T[] {
    return configs.filter(config => !isImageGenerationModel(config.modelName));
}

// ============================================================================
// Token Usage Tracking and Use-Case Based Service Selection
// ============================================================================

/**
 * 记录 AI API 调用的 Token 使用量
 */
export async function recordTokenUsage(configId: string, tokens: number): Promise<void> {
    if (!tokens || tokens <= 0) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    try {
        await db.aITokenUsage.upsert({
            where: {
                configId_date: { configId, date: today }
            },
            update: {
                tokensUsed: { increment: tokens }
            },
            create: {
                configId,
                date: today,
                tokensUsed: tokens
            }
        });
        console.log(`[TokenUsage] Recorded ${tokens} tokens for config ${configId} on ${today}`);
    } catch (error) {
        console.error('[TokenUsage] Failed to record usage:', error);
    }
}

/**
 * 获取指定模型当日和当月的 Token 使用量
 */
async function getTokenUsage(configId: string): Promise<{ daily: number; monthly: number }> {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

    try {
        // 获取今日使用量
        const dailyUsage = await db.aITokenUsage.findUnique({
            where: { configId_date: { configId, date: todayStr } }
        });

        // 获取本月使用量
        const monthlyUsages = await db.aITokenUsage.findMany({
            where: {
                configId,
                date: { gte: monthStart }
            }
        });

        const monthlyTotal = monthlyUsages.reduce((sum, u) => sum + u.tokensUsed, 0);

        return {
            daily: dailyUsage?.tokensUsed || 0,
            monthly: monthlyTotal
        };
    } catch (error) {
        console.error('[TokenUsage] Failed to get usage:', error);
        return { daily: 0, monthly: 0 };
    }
}

/**
 * 检查模型是否超过 Token 限额
 */
async function isOverLimit(config: {
    id: string;
    dailyTokenLimit: number | null;
    monthlyTokenLimit: number | null;
}): Promise<boolean> {
    const usage = await getTokenUsage(config.id);

    if (config.dailyTokenLimit && usage.daily >= config.dailyTokenLimit) {
        console.log(`[TokenLimit] ${config.id} exceeded daily limit: ${usage.daily}/${config.dailyTokenLimit}`);
        return true;
    }

    if (config.monthlyTokenLimit && usage.monthly >= config.monthlyTokenLimit) {
        console.log(`[TokenLimit] ${config.id} exceeded monthly limit: ${usage.monthly}/${config.monthlyTokenLimit}`);
        return true;
    }

    return false;
}

export type AIUseCaseType = 'GENERAL' | 'WRITING' | 'CODE' | 'IMAGE';

export interface AIServiceWithTracking extends AIService {
    configId: string;
}

/**
 * 根据用途获取 AI 服务（带 Token 限额检查和自动降级）
 */
export async function getAIServiceForUseCase(useCase: AIUseCaseType = 'GENERAL'): Promise<AIServiceWithTracking> {
    try {
        // Special handling for IMAGE generation
        if (useCase === 'IMAGE') {
            // Find an active config that supports image generation (OpenAI for now)
            const imageConfigs = await db.aIConfig.findMany({
                where: {
                    isActive: true,
                    provider: { in: ['openai', 'dall-e-3', 'volcengine'] } // Removed deepseek/zhipu as they might not support /images/generations checks
                },
                orderBy: { priority: 'desc' }
            });

            if (imageConfigs.length > 0) {
                const selectedConfig = imageConfigs[0];
                console.log(`[AIService] Selected ${selectedConfig.provider} for IMAGE generation`);
                const service = createAIServiceFromConfig(selectedConfig);
                (service as any).configId = selectedConfig.id;
                return service as AIServiceWithTracking;
            }

            // Fallback: Check if we are in development, use Mock
            if (process.env.NODE_ENV === 'development') {
                console.log('[AIService] No image provider found, using Mock for IMAGE');
                const mockService = new MockAIService();
                return {
                    generateContent: mockService.generateContent.bind(mockService),
                    generateArticle: mockService.generateArticle.bind(mockService),
                    generateImage: mockService.generateImage.bind(mockService),
                    configId: 'mock'
                };
            }

            console.error('[AIService] FAILED to find image provider. Checked active configs with provider in [openai, dall-e-3, volcengine].');
            // 尝试查找一次所有活跃配置并打印，以便调试
            const allConfigs = await db.aIConfig.findMany({ where: { isActive: true }, select: { id: true, provider: true, useCase: true } });
            console.error('[AIService] Available active configs in DB:', JSON.stringify(allConfigs));

            throw new Error('No active AI provider found that supports Image Generation (e.g., OpenAI)');
        }

        // Standard Text Generation Logic
        const dbUseCase = useCase;

        // 获取所有符合用途的活跃模型，按优先级排序
        const configs = await db.aIConfig.findMany({
            where: {
                isActive: true,
                useCase: dbUseCase as any // Cast to match Prisma Enum if needed
            },
            orderBy: { priority: 'desc' }
        });

        // 如果没有指定用途的模型，回退到 GENERAL
        let candidateConfigs = configs.length > 0 ? configs : await db.aIConfig.findMany({
            where: {
                isActive: true,
                useCase: 'GENERAL'
            },
            orderBy: { priority: 'desc' }
        });

        // 如果仍然没有，获取所有活跃模型（排除图像模型）
        if (candidateConfigs.length === 0) {
            candidateConfigs = await db.aIConfig.findMany({
                where: {
                    isActive: true,
                    NOT: { useCase: 'IMAGE' }
                },
                orderBy: { priority: 'desc' }
            });
        }

        // 🔧 过滤掉图像生成模型（它们不支持文本对话 API）
        const textOnlyConfigs = filterTextModels(candidateConfigs);
        const skippedImageModels = candidateConfigs
            .filter(c => isImageGenerationModel(c.modelName))
            .map(c => c.modelName);

        if (skippedImageModels.length > 0) {
            console.log(`[AIService] 已跳过图像模型: ${skippedImageModels.join(', ')}`);
        }

        if (textOnlyConfigs.length === 0) {
            if (candidateConfigs.length > 0) {
                // 有配置但都是图像模型
                console.error(`[AIService] 没有可用的文本模型，所有配置都是图像模型: ${skippedImageModels.join(', ')}`);
                throw new Error(`没有可用的文本对话模型。已配置的模型都是图像生成模型 (${skippedImageModels.join(', ')})，请添加文本模型如 doubao-pro-32k, deepseek-chat, gpt-3.5-turbo`);
            }

            console.log('[AIService] No active configs found, using Mock');
            const mockService = new MockAIService();
            return {
                generateContent: mockService.generateContent.bind(mockService),
                generateArticle: mockService.generateArticle.bind(mockService),
                generateImage: mockService.generateImage.bind(mockService),
                configId: 'mock'
            };
        }

        // 遍历候选模型（仅文本模型），找到第一个未超限的
        let selectedConfig = textOnlyConfigs[0]; // 默认使用优先级最高的

        for (const config of textOnlyConfigs) {
            const overLimit = await isOverLimit(config);
            if (!overLimit) {
                selectedConfig = config;
                console.log(`[AIService] Selected ${config.provider}/${config.modelName} for ${useCase} (within limits)`);
                break;
            }
        }

        // 如果所有模型都超限，使用优先级最高的（已经是 selectedConfig）
        if (selectedConfig === textOnlyConfigs[0]) {
            const allOverLimit = await Promise.all(textOnlyConfigs.map(c => isOverLimit(c)));
            if (allOverLimit.every(Boolean)) {
                console.warn(`[AIService] All models for ${useCase} are over limit, using highest priority: ${selectedConfig.provider}`);
            }
        }

        const service = createAIServiceFromConfig(selectedConfig);
        (service as any).configId = selectedConfig.id;
        return service as AIServiceWithTracking;

    } catch (error) {
        console.error('[AIService] Error in getAIServiceForUseCase:', error);

        // Return Mock service on error to prevent crashing, but log it
        const mockService = new MockAIService();
        return {
            generateContent: mockService.generateContent.bind(mockService),
            generateArticle: mockService.generateArticle.bind(mockService),
            generateImage:
                // If it was an IMAGE request and failed, the Mock will work. 
                // However, the user might see a placeholder image.
                mockService.generateImage.bind(mockService),
            configId: 'mock'
        };
    }
}

/**
 * 从配置创建 AI 服务实例
 */
function createAIServiceFromConfig(config: {
    id: string;
    provider: string;
    apiKey: string;
    baseUrl: string | null;
    modelName: string | null;
    secretKey: string | null;
}): AIService {
    if (config.provider === 'gemini') {
        return new GeminiService(config.apiKey, config.modelName || 'gemini-pro');
    }

    if (config.provider === 'baidu') {
        return new BaiduAIService(config.apiKey, config.secretKey || '', config.modelName || 'completions_pro');
    }

    if (config.provider === 'volcengine') {
        return new VolcengineService(config.apiKey, config.baseUrl || 'https://ark.cn-beijing.volces.com/api/v3', config.modelName || 'ep-xxxxx-xxxxx');
    }

    // OpenAI Compatible Providers
    const openaiCompatibleProviders = [
        'openai', 'deepseek', 'custom', 'qwen', 'minimax',
        'moonshot', 'zhipu', 'grok', 'hunyuan', 'nanoai', 'claude'
    ];

    if (openaiCompatibleProviders.includes(config.provider)) {
        let baseUrl = config.baseUrl;
        let modelName = config.modelName;

        if (!baseUrl) {
            switch (config.provider) {
                case 'deepseek': baseUrl = 'https://api.deepseek.com'; break;
                case 'openai': baseUrl = 'https://api.openai.com/v1'; break;
                case 'qwen': baseUrl = 'https://dashscope.aliyuncs.com/compatible-mode/v1'; break;
                case 'minimax': baseUrl = 'https://api.minimax.chat/v1'; break;
                case 'moonshot': baseUrl = 'https://api.moonshot.cn/v1'; break;
                case 'zhipu': baseUrl = 'https://open.bigmodel.cn/api/paas/v4'; break;
                case 'grok': baseUrl = 'https://api.grok.x.ai/v1'; break;
                case 'hunyuan': baseUrl = 'https://api.hunyuan.cloud.tencent.com/v1'; break;
            }
        }

        if (!modelName) {
            switch (config.provider) {
                case 'deepseek': modelName = 'deepseek-chat'; break;
                case 'openai': modelName = 'gpt-3.5-turbo'; break;
                case 'qwen': modelName = 'qwen-turbo'; break;
                case 'moonshot': modelName = 'moonshot-v1-8k'; break;
                case 'zhipu': modelName = 'glm-4'; break;
                case 'grok': modelName = 'grok-1'; break;
                case 'hunyuan': modelName = 'hunyuan-lite'; break;
                case 'claude': modelName = 'claude-3-opus-20240229'; break;
            }
        }

        logger.info(`[AIService] Created OpenAIService for ${config.provider} (Model: ${modelName || 'gpt-3.5-turbo'})`);
        return new OpenAIService(config.apiKey, baseUrl || 'https://api.openai.com/v1', modelName || 'gpt-3.5-turbo');
    }

    return new MockAIService();
}

/**
 * 获取 AI 服务（优化版：支持用途过滤和自动降级）
 */
// 旧版 getAIService 已被 getAIServiceWithFallback 替代
export async function getAIService(): Promise<AIService> {
    return getAIServiceWithFallback('GENERAL');
}


/**
 * 检查错误是否应该触发自动降级
 * 包括：账户欠费、API限流、认证失败等
 */
function shouldFallback(error: any): boolean {
    const errorMessage = error?.message || '';

    // 403 错误（欠费、权限不足）
    if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) return true;
    // 429 错误（限流）
    if (errorMessage.includes('429') || errorMessage.includes('rate limit') || errorMessage.includes('Too Many Requests')) return true;
    // 401 错误（认证失败）
    if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) return true;
    // 账户欠费
    if (errorMessage.includes('AccountOverdueError') || errorMessage.includes('overdue')) return true;
    // 余额不足
    if (errorMessage.includes('insufficient') || errorMessage.includes('balance')) return true;
    // 配额超限
    if (errorMessage.includes('quota') || errorMessage.includes('exceeded')) return true;

    return false;
}

/**
 * 获取所有可用的 AI 配置（按优先级排序）
 */

/**
 * 带自动降级的 AI 服务包装器
 * 当某个平台返回错误（欠费、限流等）时，自动尝试下一个优先级的平台
 */
export class AIServiceWithFallback implements AIService {
    private configs: any[];
    private currentIndex: number = 0;
    public configId: string = '';

    constructor(configs: any[]) {
        this.configs = configs;
        if (configs.length > 0) {
            this.configId = configs[0].id;
        }
    }

    private getCurrentService(): AIService {
        if (this.currentIndex >= this.configs.length) {
            throw new Error('All AI providers have failed');
        }
        return createAIServiceFromConfig(this.configs[this.currentIndex]);
    }

    private moveToNextProvider(): boolean {
        this.currentIndex++;
        if (this.currentIndex < this.configs.length) {
            this.configId = this.configs[this.currentIndex].id;
            logger.warn(`[AIService] ⚠️ Falling back to next provider: ${this.configs[this.currentIndex].provider} (Priority: ${this.configs[this.currentIndex].priority})`);
            return true;
        }
        return false;
    }

    async generateContent(prompt: string, options?: { response_format?: { type: 'text' | 'json_object' } }): Promise<string> {
        while (this.currentIndex < this.configs.length) {
            try {
                const service = this.getCurrentService();
                const currentProvider = this.configs[this.currentIndex].provider;
                logger.info(`[AIService] Trying ${currentProvider} for generateContent`);
                return await service.generateContent(prompt, options);
            } catch (error: any) {
                const currentProvider = this.configs[this.currentIndex].provider;
                logger.error(`[AIService] ${currentProvider} failed: ${error.message}`);

                if (shouldFallback(error)) {
                    if (!this.moveToNextProvider()) {
                        throw new Error(`All AI providers failed. Last error from ${currentProvider}: ${error.message}`);
                    }
                } else {
                    throw error;
                }
            }
        }
        throw new Error('All AI providers have been exhausted');
    }

    async generateArticle(request: AICompletionRequest): Promise<AICompletionResponse> {
        while (this.currentIndex < this.configs.length) {
            try {
                const service = this.getCurrentService();
                const currentProvider = this.configs[this.currentIndex].provider;
                logger.info(`[AIService] Trying ${currentProvider} for generateArticle`);
                return await service.generateArticle(request);
            } catch (error: any) {
                const currentProvider = this.configs[this.currentIndex].provider;
                logger.error(`[AIService] ${currentProvider} failed: ${error.message}`);

                if (shouldFallback(error)) {
                    if (!this.moveToNextProvider()) {
                        throw new Error(`All AI providers failed. Last error from ${currentProvider}: ${error.message}`);
                    }
                } else {
                    throw error;
                }
            }
        }
        throw new Error('All AI providers have been exhausted');
    }

    async generateImage(prompt: string, size?: string): Promise<{ url: string; alt: string; description: string }> {
        while (this.currentIndex < this.configs.length) {
            try {
                const service = this.getCurrentService();
                const currentProvider = this.configs[this.currentIndex].provider;
                logger.info(`[AIService] Trying ${currentProvider} for generateImage`);
                return await service.generateImage(prompt, size);
            } catch (error: any) {
                const currentProvider = this.configs[this.currentIndex].provider;
                logger.error(`[AIService] ${currentProvider} failed: ${error.message}`);

                if (shouldFallback(error)) {
                    if (!this.moveToNextProvider()) {
                        throw new Error(`All AI providers failed. Last error from ${currentProvider}: ${error.message}`);
                    }
                } else {
                    throw error;
                }
            }
        }
        throw new Error('All AI providers have been exhausted');
    }
}

/**
 * 获取带自动降级功能的 AI 服务
 * 当某个平台欠费/限流时，自动切换到下一个优先级的平台
 */
export async function getAIServiceWithFallback(useCase: AIUseCaseType = 'GENERAL'): Promise<AIServiceWithFallback> {
    const configs = await getAllActiveConfigs(useCase);

    if (configs.length === 0) {
        logger.warn('[AIService] No active configs found, using Mock service');
        return new AIServiceWithFallback([{
            id: 'mock',
            provider: 'mock',
            apiKey: '',
            baseUrl: null,
            modelName: null,
            secretKey: null
        }]);
    }

    // 过滤掉超过 Token 限额的配置（但保留它们作为最后的备选）
    const withinLimitConfigs: any[] = [];
    const overLimitConfigs: any[] = [];

    for (const config of configs) {
        const overLimit = await isOverLimit(config);
        if (overLimit) {
            overLimitConfigs.push(config);
        } else {
            withinLimitConfigs.push(config);
        }
    }

    const orderedConfigs = [...withinLimitConfigs, ...overLimitConfigs];

    if (orderedConfigs.length > 0) {
        logger.info(`[AIService] Initialized fallback chain: ${orderedConfigs.map(c => c.provider + '(P' + c.priority + ')').join(' -> ')}`);
    }

    return new AIServiceWithFallback(orderedConfigs);
}
/**
 * 获取所有可用的 AI 配置（按优先级排序）
 * 策略：优先使用指定用途的配置，其次使用通用配置
 */
async function getAllActiveConfigs(useCase: AIUseCaseType = 'GENERAL'): Promise<any[]> {
    // 1. 获取指定用途的配置
    const specificConfigs = await db.aIConfig.findMany({
        where: {
            isActive: true,
            useCase: useCase as any
        },
        orderBy: { priority: 'desc' }
    });

    // 如果用途本身就是 GENERAL，直接返回
    if (useCase === 'GENERAL') {
        return specificConfigs;
    }

    // 2. 获取通用配置
    const generalConfigs = await db.aIConfig.findMany({
        where: {
            isActive: true,
            useCase: 'GENERAL'
        },
        orderBy: { priority: 'desc' }
    });

    // 3. 合并配置：特定用途优先 -> 通用配置
    // 由于是两个独立的查询，ID不会重复（除非数据库数据异常），直接连接即可
    const allConfigs = [...specificConfigs, ...generalConfigs];

    // 如果还是没有配置，尝试获取所有激活的配置作为最后兜底（排除图像模型）
    if (allConfigs.length === 0) {
        return await db.aIConfig.findMany({
            where: {
                isActive: true,
                NOT: { useCase: 'IMAGE' }
            },
            orderBy: { priority: 'desc' }
        });
    }

    return allConfigs;
}
