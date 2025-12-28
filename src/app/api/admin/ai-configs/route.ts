import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

// GET /api/admin/ai-configs - List all configs
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const configs = await db.aIConfig.findMany({
            orderBy: { priority: 'desc' },
        });

        // Mask API keys and Secret keys for security
        const maskedConfigs = configs.map(config => ({
            ...config,
            apiKey: config.apiKey ? `${config.apiKey.substring(0, 3)}...${config.apiKey.substring(config.apiKey.length - 4)}` : '',
            secretKey: (config as any).secretKey ? `${(config as any).secretKey.substring(0, 3)}...${(config as any).secretKey.substring((config as any).secretKey.length - 4)}` : undefined,
        }));

        return NextResponse.json(maskedConfigs);
    } catch (error) {
        console.error('Error fetching AI configs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/ai-configs - Create new config
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { provider, apiKey, baseUrl, modelName, secretKey, isActive, priority, dailyTokenLimit, monthlyTokenLimit, useCase } = body;

        if (!provider || !apiKey) {
            return NextResponse.json({ error: 'Provider and API Key are required' }, { status: 400 });
        }

        const config = await db.aIConfig.create({
            data: {
                provider,
                apiKey,
                baseUrl,
                modelName,
                secretKey,
                isActive: isActive ?? true,
                priority: priority ?? 0,
                dailyTokenLimit: dailyTokenLimit ?? null,
                monthlyTokenLimit: monthlyTokenLimit ?? null,
                useCase: useCase || 'GENERAL',
            },
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error creating AI config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/admin/ai-configs - Update config
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, provider, apiKey, baseUrl, modelName, secretKey, isActive, priority, dailyTokenLimit, monthlyTokenLimit, useCase } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // If apiKey is masked (starts with ... or similar check), do not update it unless it's a new value
        // Simple check: if it looks like the masked version we sent, don't update it.
        // Better approach: Client should only send apiKey if it's changed.

        const dataToUpdate: any = {
            provider,
            baseUrl,
            modelName,
            isActive,
            priority,
            dailyTokenLimit: dailyTokenLimit ?? null,
            monthlyTokenLimit: monthlyTokenLimit ?? null,
            useCase: useCase || 'GENERAL',
        };

        // Only update API key if provided and not masked
        if (apiKey && !apiKey.includes('...')) {
            dataToUpdate.apiKey = apiKey;
        }

        // Only update Secret Key if provided and not masked
        if (secretKey && !secretKey.includes('...')) {
            dataToUpdate.secretKey = secretKey;
        }

        const config = await db.aIConfig.update({
            where: { id },
            data: dataToUpdate,
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error updating AI config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/admin/ai-configs - Delete config
export async function DELETE(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        await db.aIConfig.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting AI config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
