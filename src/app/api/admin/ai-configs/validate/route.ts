import { NextRequest, NextResponse } from 'next/server';
import { validateAIConfig } from '@/lib/ai/validate-config';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: '未授权' }, { status: 401 });
        }

        const { provider, baseUrl, apiKey, modelName, secretKey, configId, useCase } = await req.json();

        if (!provider || !baseUrl) {
            return NextResponse.json(
                { error: '缺少必要参数' },
                { status: 400 }
            );
        }

        let actualApiKey = apiKey;
        let actualSecretKey = secretKey;

        // If API key is masked (contains "..."), fetch the real one from database
        if (!apiKey || apiKey.includes('...')) {
            if (!configId) {
                return NextResponse.json(
                    {
                        success: false,
                        message: '请输入API Key或提供配置ID',
                        details: 'API Key已被遮蔽，无法验证'
                    },
                    { status: 200 }
                );
            }

            // Fetch the real API key and Secret Key from database
            const config = await db.aIConfig.findUnique({
                where: { id: configId },
                select: { apiKey: true, secretKey: true }
            });

            if (!config) {
                return NextResponse.json(
                    { error: '配置不存在' },
                    { status: 404 }
                );
            }

            actualApiKey = config.apiKey;
            if (secretKey && secretKey.includes('...')) {
                actualSecretKey = config.secretKey;
            }
        }

        if (!actualApiKey) {
            return NextResponse.json(
                {
                    success: false,
                    message: '缺少API Key',
                    details: '请提供有效的API Key'
                },
                { status: 200 }
            );
        }

        const result = await validateAIConfig(provider, baseUrl, actualApiKey, modelName, actualSecretKey, useCase);

        return NextResponse.json(result);
    } catch (error: any) {
        console.error('AI Config validation error:', error);
        return NextResponse.json(
            { error: error.message || '验证失败' },
            { status: 500 }
        );
    }
}
