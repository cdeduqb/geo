import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { AIConfig } from '@prisma/client';

// GET: 获取所有 AI 配置
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const configs = await db.aIConfig.findMany({
            orderBy: { priority: 'desc' }
        });

        // 隐藏 API Key 的大部分字符
        const safeConfigs = configs.map((c: AIConfig) => ({
            ...c,
            apiKey: c.apiKey ? maskApiKey(c.apiKey) : ''
        }));

        return NextResponse.json({ configs: safeConfigs });
    } catch (error) {
        console.error('Failed to fetch AI configs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch AI configs' },
            { status: 500 }
        );
    }
}

// POST: 保存 AI 配置
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { configs } = await request.json();

        if (!Array.isArray(configs)) {
            return NextResponse.json({ error: 'Invalid configs format' }, { status: 400 });
        }

        // 逐个保存配置
        for (const config of configs) {
            if (!config.provider) {
                console.log(`Skipping config with no provider:`, config);
                continue;
            }

            console.log(`Processing config for ${config.provider}:`, {
                hasApiKey: !!config.apiKey,
                apiKeyMasked: config.apiKey?.includes('****'),
                isActive: config.isActive
            });

            // 检查记录是否已存在
            const existing = await db.aIConfig.findFirst({
                where: { provider: config.provider }
            });

            // 检查是否是掩码后的 API Key
            const isMasked = config.apiKey?.includes('****');

            if (isMasked && !existing) {
                // 如果 API key 被掩码但记录不存在,说明这是无效数据,跳过
                console.log(`Skipping ${config.provider}: masked key but no existing record`);
                continue;
            }

            if (isMasked && existing) {
                // 只更新其他字段,保留原有 API Key
                console.log(`Updating ${config.provider} without changing API key`);
                await db.aIConfig.update({
                    where: { id: existing.id },
                    data: {
                        baseUrl: config.baseUrl || null,
                        modelName: config.modelName || null,
                        isActive: config.isActive ?? true,
                        priority: config.priority ?? 0,
                        dailyTokenLimit: config.dailyTokenLimit ?? null,
                        monthlyTokenLimit: config.monthlyTokenLimit ?? null,
                        useCase: config.useCase || 'GENERAL'
                    }
                });
            } else if (config.apiKey && !isMasked) {
                // 有未掩码的 API Key,创建或更新包括 API Key
                console.log(`Upserting ${config.provider} with API key`);
                if (existing) {
                    // Update existing record
                    await db.aIConfig.update({
                        where: { id: existing.id },
                        data: {
                            apiKey: config.apiKey,
                            baseUrl: config.baseUrl || null,
                            modelName: config.modelName || null,
                            isActive: config.isActive ?? true,
                            priority: config.priority ?? 0,
                            dailyTokenLimit: config.dailyTokenLimit ?? null,
                            monthlyTokenLimit: config.monthlyTokenLimit ?? null,
                            useCase: config.useCase || 'GENERAL'
                        }
                    });
                } else {
                    // Create new record
                    await db.aIConfig.create({
                        data: {
                            provider: config.provider,
                            apiKey: config.apiKey,
                            baseUrl: config.baseUrl || null,
                            modelName: config.modelName || null,
                            isActive: config.isActive ?? true,
                            priority: config.priority ?? 0,
                            dailyTokenLimit: config.dailyTokenLimit ?? null,
                            monthlyTokenLimit: config.monthlyTokenLimit ?? null,
                            useCase: config.useCase || 'GENERAL'
                        }
                    });
                }
            } else {
                console.log(`Skipping ${config.provider}: no valid API key`);
            }
        }

        return NextResponse.json({ success: true, message: '配置已保存' });
    } catch (error) {
        console.error('Failed to save AI configs:', error);
        return NextResponse.json(
            { error: 'Failed to save AI configs' },
            { status: 500 }
        );
    }
}

// 隐藏 API Key 的大部分字符
function maskApiKey(apiKey: string): string {
    if (apiKey.length <= 8) {
        return '****' + apiKey.slice(-4);
    }
    return apiKey.slice(0, 4) + '****' + apiKey.slice(-4);
}

