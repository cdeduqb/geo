import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

function debugLog(message: string, data?: any) {
    const logPath = path.join(process.cwd(), 'ai_strategy_debug.log');
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message} ${data ? JSON.stringify(data, null, 2) : ''}\n`;
    fs.appendFileSync(logPath, logEntry);
}

// GET /api/admin/ai-strategies - List all strategies
export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const targetType = searchParams.get('targetType');
        const type = searchParams.get('type');

        const where: any = {};
        if (targetType) {
            where.targetType = targetType;
        }
        if (type) {
            where.type = type;
        }

        const strategies = await db.aIStrategy.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { tasks: true },
                },
            },
        });

        return NextResponse.json(strategies);
    } catch (error) {
        console.error('Error fetching AI strategies:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/ai-strategies - Create new strategy
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, prompt, temperature, maxTokens, targetType, type } = body;

        if (!name || !prompt) {
            return NextResponse.json({ error: 'Name and prompt are required' }, { status: 400 });
        }

        debugLog('[POST] Creating strategy', { name, prompt, targetType, type });

        const strategy = await db.aIStrategy.create({
            data: {
                name,
                prompt,
                temperature: temperature ?? 0.7,
                maxTokens: maxTokens || null,
                targetType: targetType || 'article',
                type: (type || 'WRITING') as any,
            },
        });

        debugLog('[POST] Strategy created', strategy);
        revalidatePath('/admin/ai/strategies');

        return NextResponse.json(strategy);
    } catch (error) {
        console.error('Error creating AI strategy:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/admin/ai-strategies - Update strategy
export async function PUT(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, name, prompt, temperature, maxTokens, targetType, type } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        console.log('[AI_STRATEGY_UPDATE] Request body:', body);

        const updateData: any = {
            name,
            prompt,
            temperature,
            maxTokens: maxTokens || null,
            targetType,
        };

        if (type) {
            updateData.type = type;
        }

        console.log('[AI_STRATEGY_UPDATE] Final update data:', updateData);

        debugLog('[PUT] Updating strategy', { id, updateData });

        const strategy = await db.aIStrategy.update({
            where: { id },
            data: updateData,
        });

        debugLog('[PUT] Strategy updated', strategy);
        revalidatePath('/admin/ai/strategies');

        return NextResponse.json(strategy);
    } catch (error: any) {
        debugLog('[PUT] Error', { message: error.message, stack: error.stack });
        console.error('Error updating AI strategy:', error);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/ai-strategies - Delete strategy
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

        await db.aIStrategy.delete({
            where: { id },
        });

        revalidatePath('/admin/ai/strategies');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting AI strategy:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
