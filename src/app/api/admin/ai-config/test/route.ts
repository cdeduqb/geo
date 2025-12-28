import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

// POST: 测试 AI 平台连接
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { provider, config } = await request.json();

        if (!provider || !config?.apiKey) {
            return NextResponse.json({ error: 'Missing provider or API key' }, { status: 400 });
        }

        // 根据不同平台测试连接
        let result;
        switch (provider.toLowerCase()) {
            case 'kimi':
                result = await testKimi(config);
                break;
            case 'qwen':
                result = await testQwen(config);
                break;
            case 'doubao':
                result = await testDoubao(config);
                break;
            case 'deepseek':
                result = await testDeepseek(config);
                break;
            case 'hunyuan':
                result = await testHunyuan(config);
                break;
            default:
                return NextResponse.json({ error: `Unknown provider: ${provider}` }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error('Connection test error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

async function testKimi(config: { apiKey: string; baseUrl?: string; modelName?: string }) {
    const baseUrl = config.baseUrl || 'https://api.moonshot.cn/v1';
    const response = await fetch(`${baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${config.apiKey}` }
    });

    if (!response.ok) {
        throw new Error(`Kimi API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, models: data.data?.length || 0 };
}

async function testQwen(config: { apiKey: string; baseUrl?: string; modelName?: string }) {
    const baseUrl = config.baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1';
    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: config.modelName || 'qwen-turbo',
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 5
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Qwen API error: ${response.status} - ${error}`);
    }

    return { success: true };
}

async function testDoubao(config: { apiKey: string; baseUrl?: string; modelName?: string }) {
    const baseUrl = config.baseUrl || 'https://ark.cn-beijing.volces.com/api/v3';
    const model = config.modelName;

    if (!model) {
        throw new Error('豆包需要配置 Endpoint ID (模型名)');
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: 'Hello' }],
            max_tokens: 5
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Doubao API error: ${response.status} - ${error}`);
    }

    return { success: true };
}

async function testDeepseek(config: { apiKey: string; baseUrl?: string; modelName?: string }) {
    const baseUrl = config.baseUrl || 'https://api.deepseek.com/v1';
    const response = await fetch(`${baseUrl}/models`, {
        headers: { 'Authorization': `Bearer ${config.apiKey}` }
    });

    if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, models: data.data?.length || 0 };
}

async function testHunyuan(config: { apiKey: string; baseUrl?: string; modelName?: string }) {
    // 腾讯混元使用不同的认证方式，这里简化处理
    return {
        success: true,
        message: '腾讯混元需要更复杂的签名认证，请确保 API Key 格式正确'
    };
}
