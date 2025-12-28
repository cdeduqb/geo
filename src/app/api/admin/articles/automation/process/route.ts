import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAIService, getAIServiceForUseCase } from '@/lib/ai/service';
import { ContentPipelineService } from '@/lib/ai/pipeline';
import { getActiveStorageProvider, generateFileKey } from '@/lib/storage/factory';
import { logger } from '@/lib/logger';

// 这个 API 用于执行自动化流水线。
// 它可以被 Cron Job 或者手动触发。
export async function POST(request: NextRequest) {
    try {
        // 1. 查找所有“到了执行时间”且“尚未开始”的自动化任务
        const now = new Date();
        const pendingTasks = await db.aICreationTask.findMany({
            where: {
                status: 'PENDING',
                scheduledAt: { lte: now },
                projectId: { not: null } // 只处理属于自动化工厂的任务
            },
            include: {
                project: {
                    include: {
                        strategy: true
                    }
                }
            },
            take: 5 // 每次处理 5 篇，避免超时
        });

        if (pendingTasks.length === 0) {
            return NextResponse.json({ message: 'No pending tasks to process.' });
        }

        const results = [];

        for (const task of pendingTasks) {
            try {
                // 更新状态为处理中
                await db.aICreationTask.update({
                    where: { id: task.id },
                    data: { status: 'PROCESSING' }
                });

                const project = task.project!;
                const aiService = await getAIService();
                const userId = project.authorId;

                // --- STEP 1: 核心创作 ---
                logger.info(`[Automation] Processing Task ${task.id}: Initial Writing`);
                const fullPrompt = project.strategy.prompt
                    .replace(/{topic}/g, task.topic)
                    .replace(/{keywords}/g, task.keywords || '');

                const writeResult = await aiService.generateArticle({
                    topic: task.topic,
                    keywords: task.keywords || undefined,
                    customPrompt: fullPrompt
                });
                let currentContent = writeResult.content;

                // --- STEP 2: GEO 深度优化 ---
                if (project.enableGeo) {
                    logger.info(`[Automation] Task ${task.id}: GEO Optimization starting...`);
                    try {
                        currentContent = await ContentPipelineService.optimizeGeo(task.topic, currentContent, task.keywords);
                        logger.info(`[Automation] Task ${task.id}: GEO Optimization completed.`);
                    } catch (err) {
                        logger.error(`[Automation] GEO Optimization failed for task ${task.id}`, err);
                    }
                }

                // --- STEP 3: 智能插图 ---
                if (project.enableIllustrate) {
                    logger.info(`[Automation] Task ${task.id}: Smart Illustration starting...`);
                    try {
                        currentContent = await ContentPipelineService.illustrate(task.topic, currentContent, userId);
                        logger.info(`[Automation] Task ${task.id}: Smart Illustration completed.`);
                    } catch (err) {
                        logger.error(`[Automation] Illustration failed for task ${task.id}`, err);
                    }
                }

                // --- STEP 4: 封面图生成 ---
                let coverImage = null;
                if (project.enableCover) {
                    console.log(`[Automation] Task ${task.id}: Cover Generation`);
                    try {
                        const coverStrategy = await db.aIStrategy.findFirst({
                            where: { targetType: 'IMAGE_COVER' }
                        });

                        if (coverStrategy) {
                            const imageService = await getAIServiceForUseCase('IMAGE');
                            const storage = await getActiveStorageProvider();
                            const strictPrompt = `Cover for: ${task.topic}. Theme: ${project.name}. High quality, cinematic.`;
                            const genResult = await imageService.generateImage(strictPrompt);

                            if (genResult.url) {
                                const imgRes = await fetch(genResult.url);
                                const buffer = Buffer.from(await imgRes.arrayBuffer());
                                const filename = `cover-${Date.now()}.png`;
                                const key = generateFileKey(filename, 'covers');
                                const upload = await storage.upload(buffer, key, 'image/png');

                                await db.file.create({
                                    data: {
                                        filename, storageKey: upload.key, mimeType: 'image/png',
                                        size: buffer.length, url: upload.url, category: 'image',
                                        uploadedById: userId, description: `Cover for: ${task.topic}`
                                    }
                                });
                                coverImage = upload.url;
                            }
                        }
                    } catch (err) {
                        console.error('[Automation] Cover Generation failed:', err);
                    }
                }

                // --- STEP 4.5: 元数据生成 (SEO, 实体, 引用) ---
                logger.info(`[Automation] Task ${task.id}: Generating Metadata (SEO, Entities, Citations)`);
                const [seoData, entities, citations] = await Promise.all([
                    project.enableSEO ? ContentPipelineService.generateSEO(task.topic, currentContent) : Promise.resolve(null),
                    project.enableEntities ? ContentPipelineService.extractEntities(currentContent) : Promise.resolve(null),
                    project.enableCitations ? ContentPipelineService.generateCitations(task.topic, currentContent) : Promise.resolve(null)
                ]);

                // --- STEP 5: 创建文章记录 ---
                logger.info(`[Automation] Task ${task.id}: Finalizing Article`);
                const articleTitle = seoData?.title || task.topic.split(': ')[1] || task.topic;
                const article = await db.article.create({
                    data: {
                        title: articleTitle,
                        slug: seoData?.slug || `${project.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${task.id.slice(0, 4)}`,
                        content: currentContent,
                        summary: seoData?.description || currentContent.slice(0, 300).replace(/<[^>]*>/g, ''),
                        coverImage: coverImage,
                        status: 'PUBLISHED',
                        authorId: userId,
                        categoryId: project.categoryId,
                        aiGenerated: true,
                        automationProjectId: project.id,
                        citations: citations ?? undefined,
                        entities: entities ?? undefined,
                        seo: seoData ? {
                            create: {
                                title: seoData.title,
                                description: seoData.description,
                                keywords: seoData.keywords
                            }
                        } : undefined
                    }
                });

                // --- STEP 6: 自动内链 ---
                if (project.enableAutoLink) {
                    console.log(`[Automation] Task ${task.id}: Auto Linking`);
                    try {
                        const linkedContent = await ContentPipelineService.autoLink(article.title, currentContent, article.id);
                        await db.article.update({
                            where: { id: article.id },
                            data: { content: linkedContent }
                        });
                    } catch (err) {
                        console.error('[Automation] Auto Linking failed:', err);
                    }
                }

                // 完成任务
                await db.aICreationTask.update({
                    where: { id: task.id },
                    data: {
                        status: 'COMPLETED',
                        articleId: article.id,
                        completedAt: new Date()
                    }
                });

                results.push({ id: task.id, status: 'SUCCESS', articleId: article.id });

            } catch (err: any) {
                console.error(`[Automation] Task ${task.id} Failed:`, err);
                await db.aICreationTask.update({
                    where: { id: task.id },
                    data: {
                        status: 'FAILED',
                        error: err.message || 'Internal logic error'
                    }
                });
                results.push({ id: task.id, status: 'FAILED', error: err.message });
            }
        }

        // @ts-ignore
        const projectIdsToCheck = new Set(pendingTasks.map((t: any) => t.projectId));

        for (const projectId of projectIdsToCheck) {
            if (!projectId) continue;
            // @ts-ignore
            const remainingTasks = await db.aICreationTask.count({
                where: {
                    // @ts-ignore
                    projectId: projectId,
                    status: { in: ['PENDING', 'PROCESSING'] }
                }
            });

            if (remainingTasks === 0) {
                // @ts-ignore
                await db.articleAutomationProject.update({
                    where: { id: projectId },
                    data: { status: 'COMPLETED' }
                });
                console.log(`[Automation] Project ${projectId} marked as COMPLETED.`);
            }
        }

        return NextResponse.json({ processed: results.length, results });

    } catch (error) {
        console.error('Automation processor error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
