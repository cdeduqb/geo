
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAIServiceForUseCase } from '@/lib/ai/service';
import { getCurrentUser } from '@/lib/auth';
import { getActiveStorageProvider, generateFileKey } from '@/lib/storage/factory';

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { strategyId, context } = body;

        if (!strategyId) {
            return new NextResponse('Initial Strategy ID is required', { status: 400 });
        }

        // 1. Fetch Strategy
        const strategy = await db.aIStrategy.findUnique({
            where: { id: strategyId }
        });

        if (!strategy) {
            return new NextResponse('Strategy not found', { status: 404 });
        }

        // 2. Build Prompt
        let prompt = strategy.prompt;

        // Simple variable substitution
        if (context) {
            if (context.title) prompt = prompt.replace(/{title}/g, context.title);
            if (context.summary) prompt = prompt.replace(/{summary}/g, context.summary);
            if (context.keywords) prompt = prompt.replace(/{keywords}/g, context.keywords);
            if (context.selection) prompt = prompt.replace(/{selection}/g, context.selection);
        }

        // 3. Get AI Service
        console.log(`[AI_IMAGE_GEN] Using strategy: ${strategy.name}, prompt preview: ${prompt.substring(0, 100)}...`);
        const aiService = await getAIServiceForUseCase('IMAGE');

        // 4. Generate Image
        console.log(`[AI_IMAGE_GEN] Calling aiService.generateImage...`);
        const result = await aiService.generateImage(prompt);
        console.log(`[AI_IMAGE_GEN] aiService.generateImage result:`, result);

        // 5. Download and Save to Storage
        if (result.url) {
            console.log(`[AI_IMAGE_GEN] Attempting to save to storage: ${result.url}`);
            try {
                // Fetch the image data
                const imageRes = await fetch(result.url);
                if (!imageRes.ok) throw new Error(`Failed to download generated image: ${imageRes.statusText}`);
                const arrayBuffer = await imageRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                console.log(`[AI_IMAGE_GEN] Downloaded image, size: ${buffer.length} bytes`);

                // Determine file extension and mime type
                const mimeType = imageRes.headers.get('content-type') || 'image/png';
                const ext = mimeType.split('/')[1] || 'png';
                const filename = `ai-gen-${Date.now()}.${ext}`;

                // Get active storage provider
                const storage = await getActiveStorageProvider();
                const key = generateFileKey(filename, 'ai-generated');

                // Upload
                console.log(`[AI_IMAGE_GEN] Uploading to storage with key: ${key}`);
                const uploadResult = await storage.upload(buffer, key, mimeType);

                // Save File record
                const fileRecord = await db.file.create({
                    data: {
                        filename: filename,
                        storageKey: uploadResult.key,
                        mimeType: mimeType,
                        size: buffer.length,
                        url: uploadResult.url,
                        category: 'image',
                        folder: 'ai-generated',
                        description: result.description || prompt,
                        uploadedById: user.id
                    }
                });

                // Update result URL to our storage URL
                result.url = uploadResult.url;

                console.log(`[AI_IMAGE_GEN] Saved image to storage and DB, record ID: ${fileRecord.id}, URL: ${uploadResult.url}`);

            } catch (storageError) {
                console.error('[AI_IMAGE_GEN] Failed to save to storage, returning original URL:', storageError);
                // If storage fails, we still return the original AI URL as fallback
            }
        } else {
            console.warn(`[AI_IMAGE_GEN] aiService.generateImage returned no URL`);
        }

        return NextResponse.json(result);

    } catch (error) {
        console.error('[AI_IMAGE_GEN] Global error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
