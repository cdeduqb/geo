import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getAIService, getAIServiceForUseCase } from '@/lib/ai/service';
import { ContentPipelineService } from '@/lib/ai/pipeline';
import { getActiveStorageProvider, generateFileKey } from '@/lib/storage/factory';
import { logger } from '@/lib/logger';
import { autoPushToSEO } from '@/app/admin/articles/actions';
import { getCurrentUser } from '@/lib/auth';
import { LicenseManager } from '@/lib/license';

// 这个 API 用于执行自动化流水线。
// 它可以被 Cron Job 或者手动触发。
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!LicenseManager.hasFeature('ai')) {
            return NextResponse.json({ error: 'Forbidden', message: '需要购买AI商业授权才能使用此功能。' }, { status: 403 });
        }

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
                        strategy: true,
                        knowledgeBase: true,
                        category: {
                            select: { lang: true }
                        }
                    }
                }
            },
            take: 5 // 每次处理 5 篇，避免超时
        });

        if (pendingTasks.length === 0) {
            return NextResponse.json({ message: 'No pending tasks to process.' });
        }

        // 获取系统通用设置 (GEO)
        const geoSettingRecord = await db.systemSetting.findUnique({ where: { key: 'geo_settings' } });
        let enableAiDetector = true;
        if (geoSettingRecord) {
            try {
                const geoSettings = JSON.parse(geoSettingRecord.value);
                if (geoSettings.enableAiDetector === false) {
                    enableAiDetector = false;
                }
            } catch {}
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const heartbeat = setInterval(() => {
                    try {
                        controller.enqueue(encoder.encode(' '));
                    } catch (e) {
                        clearInterval(heartbeat);
                    }
                }, 4000);

                try {
                    // 立即发送一个空格建立连接
                    controller.enqueue(encoder.encode(' '));

                    const results = [];
                    for (const task of pendingTasks) {
                        try {
                            const project = task.project as any;
                            if (!project) continue;

                            // --- ATOMIC CLAIM ---
                            // 使用 updateMany 配合 status 检查来原子性地“认领”任务
                            // 这可以防止多个并发进程（或重复点击）同时处理同一个任务
                            const claimResult = await db.aICreationTask.updateMany({
                                where: {
                                    id: task.id,
                                    status: 'PENDING'
                                },
                                data: {
                                    status: 'PROCESSING'
                                }
                            });

                            if (claimResult.count === 0) {
                                logger.warn(`[Automation] Task ${task.id} already claimed or processed. Skipping.`);
                                continue;
                            }

                            const aiService = await getAIService();
                            const userId = project.authorId;

                            // --- STEP 1: 核心创作 ---
                            logger.info(`[Automation] Processing Task ${task.id}: Initial Writing`);

                            const lengthMap: Record<string, string> = {
                                short: '800字左右',
                                medium: '1500字左右',
                                long: '3000字以上'
                            };
                            const preferredLength = project.preferredLength || 'medium';
                            const lengthText = lengthMap[preferredLength] || '1500字左右';

                            let kbXml = '';
                            if (project.knowledgeBase && project.knowledgeBase.isActive) {
                                const kb = project.knowledgeBase;
                                kbXml = `\n\n<enterprise_knowledge>\n`;
                                if (kb.productServices) kbXml += `  <product_services>${kb.productServices}</product_services>\n`;
                                if (kb.productFeatures) kbXml += `  <product_features>${kb.productFeatures}</product_features>\n`;
                                if (kb.brandStory) kbXml += `  <brand_story>${kb.brandStory}</brand_story>\n`;
                                if (kb.userPainPoints) kbXml += `  <user_pain_points>${kb.userPainPoints}</user_pain_points>\n`;
                                if (kb.trustEndorsement) kbXml += `  <trust_endorsement>${kb.trustEndorsement}</trust_endorsement>\n`;
                                if (kb.customerCases) kbXml += `  <customer_cases>${kb.customerCases}</customer_cases>\n`;
                                if (kb.otherInfo) kbXml += `  <other_info>${kb.otherInfo}</other_info>\n`;
                                kbXml += `</enterprise_knowledge>\n\n【核心约束】上面的 <enterprise_knowledge> 是企业专属系统提供的核心事实知识库。如果在输出本文的相关段落时涉及相关维度场景，请严格参考映射节点内的素材，严禁发生大模型幻觉编造现象。`;
                            }

                            const fullPrompt = project.strategy.prompt
                                .replace(/{topic}/g, task.topic)
                                .replace(/{keywords}/g, task.keywords || '')
                                .replace(/{length}/g, lengthText)
                                .replace(/{{length}}/g, lengthText) + kbXml;

                            const writeResult = await aiService.generateArticle({
                                topic: task.topic,
                                keywords: task.keywords || undefined,
                                length: preferredLength as any,
                                customPrompt: fullPrompt
                            });

                            let currentContent = writeResult.content;

                            const articleLang = (project as any).category?.lang || 'zh';

                            // --- STEP 2: GEO 深度优化 ---
                            if (project.enableGeo) {
                                logger.info(`[Automation] Task ${task.id}: GEO Optimization starting...`);
                                try {
                                    currentContent = await ContentPipelineService.optimizeGeo(task.topic, currentContent, task.keywords, articleLang);
                                    logger.info(`[Automation] Task ${task.id}: GEO Optimization completed.`);
                                } catch (err) {
                                    logger.error(`[Automation] GEO Optimization failed for task ${task.id}`, err);
                                }
                            }

                            // --- STEP 3: 智能插图 ---
                            if (project.enableIllustrate) {
                                logger.info(`[Automation] Task ${task.id}: Smart Illustration starting...`);
                                try {
                                    currentContent = await ContentPipelineService.illustrate(task.topic, currentContent, userId, articleLang);
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
                                        const imageRes = await imageService.generateImage(
                                            coverStrategy.prompt.replace(/{topic}/g, task.topic)
                                        );

                                        if (imageRes.url) {
                                            const response = await fetch(imageRes.url);
                                            const buffer = Buffer.from(await response.arrayBuffer());

                                            const storage = await getActiveStorageProvider();
                                            const filename = `cover-${task.id}.png`;
                                            const upload = await storage.upload(buffer, generateFileKey('covers', filename), 'image/png');

                                            if (upload.url) {
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
                                    }
                                } catch (err) {
                                    console.error('[Automation] Cover Generation failed:', err);
                                }
                            }

                            // --- STEP 4.5: 元数据生成 (SEO, 实体, 引用) ---
                            // 修正：在 GEO 优化后的最终内容上提取元数据
                            logger.info(`[Automation] Task ${task.id}: Generating Metadata (SEO, Entities, Citations)`);
                            const [seoData, entities, citations] = await Promise.all([
                                project.enableSEO ? ContentPipelineService.generateSEO(task.topic, currentContent, articleLang) : Promise.resolve(null),
                                project.enableEntities ? ContentPipelineService.extractEntities(currentContent, articleLang) : Promise.resolve(null),
                                project.enableCitations ? ContentPipelineService.generateCitations(task.topic, currentContent, articleLang) : Promise.resolve(null)
                            ]);

                            // --- STEP 4.8: AI机械度审查 (Anti AI-Detector) ---
                            let detectorRes = { score: 0, result: '' };
                            let finalStatus: 'PUBLISHED' | 'DRAFT' = 'PUBLISHED';
                            
                            if (enableAiDetector) {
                                logger.info(`[Automation] Task ${task.id}: Checking AI Mechanical Score`);
                                detectorRes = await ContentPipelineService.checkMechanicalScore(currentContent, articleLang);
                                finalStatus = detectorRes.score >= 80 ? 'DRAFT' : 'PUBLISHED';
                                if (detectorRes.score >= 80) {
                                    logger.warn(`[Automation] Task ${task.id}: Article flagged as too robotic (${detectorRes.score}/100), saving as DRAFT for human review.`);
                                }
                            } else {
                                logger.info(`[Automation] Task ${task.id}: AI Mechanical Score checking disabled by settings.`);
                            }

                            // --- STEP 5: 创建文章记录 ---
                            logger.info(`[Automation] Task ${task.id}: Finalizing Article`);
                            // 如果关闭了优化标题，则严格使用任务原始主题 (task.topic)
                            const articleTitle = project.optimizeTitle === false
                                ? task.topic
                                : (seoData?.title || task.topic.split(': ')[1] || task.topic);
                            const baseSlug = seoData?.slug || `${project.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}-${task.id.slice(0, 4)}`;


                            // 唯一性检查与处理 (改为多次尝试模式)
                            let finalSlug = baseSlug;
                            let article = null;
                            let retryCount = 0;
                            const maxRetries = 3;

                            while (retryCount < maxRetries) {
                                try {
                                    article = await db.article.create({
                                        data: {
                                            title: articleTitle,
                                            slug: finalSlug,
                                            content: currentContent,
                                            summary: seoData?.description || currentContent.slice(0, 300).replace(/<[^>]*>/g, ''),
                                            coverImage: coverImage,
                                            status: finalStatus,
                                            authorId: userId,
                                            categoryId: project.categoryId,
                                            lang: articleLang,
                                            aiGenerated: true,
                                            automationProjectId: project.id,
                                            citations: citations ?? undefined,
                                            entities: entities ?? undefined,
                                            aiDetectorScore: detectorRes.score,
                                            aiDetectorResult: detectorRes.result,
                                            seo: seoData ? {
                                                create: {
                                                    title: project.optimizeTitle === false ? articleTitle : seoData.title,
                                                    description: seoData.description,
                                                    keywords: seoData.keywords
                                                }
                                            } : undefined
                                        }
                                    });
                                    break; // 成功创建，跳出循环
                                } catch (createErr: any) {
                                    // 检查是否为唯一约束冲突 (Prisma P2002)
                                    if (createErr.code === 'P2002' && (createErr.meta?.target?.includes('slug') || createErr.message?.includes('Unique constraint'))) {
                                        retryCount++;
                                        finalSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
                                        logger.warn(`[Automation] Slug collision on create. Retry ${retryCount}/${maxRetries}. New slug: ${finalSlug}`);
                                    } else {
                                        throw createErr; // 其他错误继续抛出
                                    }
                                }
                            }

                            if (!article) {
                                throw new Error(`Failed to create article after ${maxRetries} retries due to slug collisions.`);
                            }

                            // --- STEP 6: 自动内链 ---
                            if (project.enableAutoLink) {
                                console.log(`[Automation] Task ${task.id}: Auto Linking`);
                                try {
                                    const linkedContent = await ContentPipelineService.autoLink(article.title, currentContent, article.id, articleLang);
                                    await db.article.update({
                                        where: { id: article.id },
                                        data: { content: linkedContent }
                                    });
                                } catch (err) {
                                    console.error('[Automation] Auto Linking failed:', err);
                                }
                            }

                            // --- STEP 7: 自动推送 SEO (放在最后，确保推送的是最终完善的内容) ---
                            if (article.status === 'PUBLISHED') {
                                logger.info(`[Automation] Task ${task.id}: Triggering SEO Auto-push`);
                                autoPushToSEO(article.slug, article.lang || 'zh').catch(err => {
                                    logger.error(`[Automation] SEO Auto-push failed for task ${task.id}`, err);
                                });
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

                            // --- STEP 8: 呼吸时间 (延迟 3 秒) ---
                            await new Promise(resolve => setTimeout(resolve, 3000));

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

                    // 检查项目是否全部完成
                    const projectIdsToCheck = new Set(pendingTasks.map((t: any) => t.projectId));

                    for (const projectId of projectIdsToCheck) {
                        if (!projectId) continue;
                        const remainingTasks = await db.aICreationTask.count({
                            where: {
                                projectId: projectId as string,
                                status: { in: ['PENDING', 'PROCESSING'] }
                            }
                        });

                        if (remainingTasks === 0) {
                            await db.articleAutomationProject.update({
                                where: { id: projectId as string },
                                data: { status: 'COMPLETED' }
                            });
                            console.log(`[Automation] Project ${projectId} marked as COMPLETED.`);
                        }
                    }

                    clearInterval(heartbeat);
                    controller.enqueue(encoder.encode(JSON.stringify({ processed: results.length, results })));
                    controller.close();

                } catch (error: any) {
                    clearInterval(heartbeat);
                    console.error('Automation processor stream error:', error);
                    controller.enqueue(encoder.encode(JSON.stringify({ error: error.message || 'Internal Server Error' })));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
            }
        });

    } catch (error: any) {
        console.error('Automation processor initialization error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
