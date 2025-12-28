import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';
import { v4 as uuidv4 } from 'uuid';

/**
 * AI Translation API
 * Handles batch translation for Articles, Pages, Products, and Categories.
 * Refined on: 2025-12-28
 */

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { type, limit = 1 } = body;

        const aiService = await getAIServiceForUseCase('GENERAL');

        let resultItem = null;

        if (type === 'article') {
            resultItem = await processArticle(limit, aiService);
        } else if (type === 'page') {
            resultItem = await processPage(limit, aiService);
        } else if (type === 'product') {
            resultItem = await processProduct(limit, aiService);
        } else if (type === 'category') {
            resultItem = await processCategory(limit, aiService);
        } else {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            processed: resultItem ? 1 : 0,
            message: resultItem ? 'Translated successfully' : 'No items pending translation'
        });

    } catch (error: any) {
        console.error('Batch translate error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}

// ----------------------------------------------------------------------------
// Article Translation Logic
// ----------------------------------------------------------------------------
async function processArticle(limit: number, ai: any) {
    const zhArticlesWithoutGroup = await db.article.findMany({
        where: { lang: 'zh', translationGroupId: null },
        take: 10
    });
    for (const item of zhArticlesWithoutGroup) {
        await db.article.update({ where: { id: item.id }, data: { translationGroupId: uuidv4() } });
    }

    const enArticles = await db.article.findMany({
        where: { lang: 'en', translationGroupId: { not: null } },
        select: { translationGroupId: true }
    });
    const translatedGroupIds = enArticles.map(p => p.translationGroupId).filter((id): id is string => id !== null);

    const targetZh = await db.article.findFirst({
        where: {
            lang: 'zh',
            translationGroupId: { notIn: translatedGroupIds },
            NOT: { translationGroupId: null }
        }
    });

    if (targetZh) {
        return await translateArticle(targetZh, ai);
    }
    return null;
}

async function translateArticle(zhItem: any, ai: any) {
    let translated: any = {};
    try {
        const inputJson = JSON.stringify({
            title: zhItem.title,
            summary: zhItem.summary || '',
            content: zhItem.content
        });

        const response = await ai.generateContent(`
            Translate the following Article JSON from Chinese to English.
            Keep HTML tags and structure unchanged.
            Output valid JSON only.
            
            Input:
            ${inputJson}
        `, { response_format: { type: 'json_object' } });

        try {
            const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
            translated = JSON.parse(cleanJson);
        } catch (e) {
            console.error("Failed to parse article translation JSON", response);
            throw new Error("AI Translation Parse Error");
        }

        return await db.article.create({
            data: {
                title: translated.title || zhItem.title,
                slug: `${zhItem.slug}-en`,
                content: translated.content || zhItem.content,
                summary: translated.summary || zhItem.summary,
                coverImage: zhItem.coverImage,
                status: 'PUBLISHED',
                lang: 'en',
                translationGroupId: zhItem.translationGroupId,
                authorId: zhItem.authorId,
                categoryId: zhItem.categoryId,
            }
        });
    } catch (err: any) {
        if (err.code === 'P2002') {
            return await db.article.create({
                data: {
                    title: translated.title || zhItem.title,
                    slug: `${zhItem.slug}-en-${uuidv4().slice(0, 6)}`,
                    content: translated.content || zhItem.content,
                    summary: translated.summary || zhItem.summary,
                    coverImage: zhItem.coverImage,
                    status: 'PUBLISHED',
                    lang: 'en',
                    translationGroupId: zhItem.translationGroupId,
                    authorId: zhItem.authorId,
                    categoryId: zhItem.categoryId,
                }
            });
        }
        throw err;
    }
}

// ----------------------------------------------------------------------------
// Page Translation Logic
// ----------------------------------------------------------------------------
async function processPage(limit: number, ai: any) {
    const zhItemsWithoutGroup = await db.page.findMany({
        where: { lang: 'zh', translationGroupId: null },
        take: 10
    });
    for (const item of zhItemsWithoutGroup) {
        await db.page.update({ where: { id: item.id }, data: { translationGroupId: uuidv4() } });
    }

    const enPages = await db.page.findMany({
        where: { lang: 'en', translationGroupId: { not: null } },
        select: { translationGroupId: true }
    });
    const translatedGroupIds = enPages.map(p => p.translationGroupId).filter((id): id is string => id !== null);

    const targetZhPage = await db.page.findFirst({
        where: {
            lang: 'zh',
            status: { not: 'ARCHIVED' },
            translationGroupId: { notIn: translatedGroupIds },
            NOT: { translationGroupId: null }
        }
    });

    if (targetZhPage) {
        return await translatePage(targetZhPage, ai);
    }
    return null;
}

async function translatePage(zhItem: any, ai: any) {
    let translated: any = {};
    try {
        const inputJson = JSON.stringify({
            title: zhItem.title || 'Untitled',
            content: zhItem.content || ''
        });

        const response = await ai.generateContent(`
            Translate the values of the following Page JSON object from Chinese to English. 
            Keep HTML tags, style attributes, and structure UNCHANGED in 'content'.
            Only translate user-visible text.
            Output valid JSON only.
            
            Input:
            ${inputJson}
        `, { response_format: { type: 'json_object' } });

        try {
            const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
            translated = JSON.parse(cleanJson);
        } catch (e) {
            console.error("AI JSON Parse Error. Raw response:", response);
            throw new Error("AI Translation Parse Error: Invalid JSON response");
        }

        // Logic to generate unique slug for English version
        let finalEnSlug = `${zhItem.slug}-en`;
        const existingPage = await db.page.findFirst({ where: { slug: finalEnSlug } });
        if (existingPage) {
            finalEnSlug = `${zhItem.slug}-en-${Date.now().toString().slice(-4)}`;
        }

        return await db.page.create({
            data: {
                title: translated.title || zhItem.title,
                slug: finalEnSlug,
                content: translated.content || zhItem.content,
                type: zhItem.type,
                status: zhItem.status,
                lang: 'en',
                translationGroupId: zhItem.translationGroupId,
                templateId: zhItem.templateId,
                headerTemplateId: zhItem.headerTemplateId,
                footerTemplateId: zhItem.footerTemplateId,
                seo: zhItem.seo ? {
                    create: {
                        title: translated.title,
                        description: translated.title
                    }
                } : undefined
            }
        });
    } catch (error: any) {
        if (error.code === 'P2002') {
            const fallbackSlug = `${zhItem.slug}-en-${uuidv4().slice(0, 8)}`;
            return await db.page.create({
                data: {
                    title: translated.title || zhItem.title,
                    slug: fallbackSlug,
                    content: translated.content || zhItem.content,
                    type: zhItem.type,
                    status: zhItem.status,
                    lang: 'en',
                    translationGroupId: zhItem.translationGroupId,
                    templateId: zhItem.templateId,
                    headerTemplateId: zhItem.headerTemplateId,
                    footerTemplateId: zhItem.footerTemplateId,
                    seo: zhItem.seo ? { create: { title: translated.title } } : undefined
                }
            });
        }
        console.error(`Failed to translate page ${zhItem.id}:`, error);
        throw new Error(`Page Translation Failed [${zhItem.title}]: ${error.message}`);
    }
}

// ----------------------------------------------------------------------------
// Product Translation Logic
// ----------------------------------------------------------------------------
async function processProduct(limit: number, ai: any) {
    const zhWithoutGroup = await db.product.findMany({
        where: { lang: 'zh', translationGroupId: null },
        take: 10
    });
    for (const item of zhWithoutGroup) {
        await db.product.update({ where: { id: item.id }, data: { translationGroupId: uuidv4() } });
    }

    const enItems = await db.product.findMany({
        where: { lang: 'en', translationGroupId: { not: null } },
        select: { translationGroupId: true }
    });
    const translatedGroupIds = enItems.map(p => p.translationGroupId).filter((id): id is string => id !== null);

    const targetZh = await db.product.findFirst({
        where: {
            lang: 'zh',
            translationGroupId: { notIn: translatedGroupIds },
            NOT: { translationGroupId: null }
        }
    });

    if (targetZh) {
        return await translateProduct(targetZh, ai);
    }
    return null;
}

async function translateProduct(zhItem: any, ai: any) {
    let translated: any = {};
    try {
        const inputJson = JSON.stringify({
            name: zhItem.name,
            description: zhItem.description || '',
            content: zhItem.content || ''
        });

        const response = await ai.generateContent(`
            Translate Product JSON from Chinese to English.
            Output JSON only.
            
            Input:
            ${inputJson}
        `, { response_format: { type: 'json_object' } });

        try {
            const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
            translated = JSON.parse(cleanJson);
        } catch (e) {
            throw new Error("AI Translation Parse Error");
        }

        return await db.product.create({
            data: {
                name: translated.name || zhItem.name,
                slug: `${zhItem.slug}-en`,
                description: translated.description || zhItem.description,
                content: translated.content || zhItem.content,
                price: zhItem.price,
                stock: zhItem.stock,
                sku: zhItem.sku ? `${zhItem.sku}-EN` : null,
                coverImage: zhItem.coverImage,
                images: zhItem.images || undefined,
                status: zhItem.status,
                lang: 'en',
                translationGroupId: zhItem.translationGroupId,
                categoryId: zhItem.categoryId
            }
        });
    } catch (err: any) {
        if (err.code === 'P2002') {
            return await db.product.create({
                data: {
                    name: translated.name || zhItem.name,
                    slug: `${zhItem.slug}-en-${uuidv4().slice(0, 6)}`,
                    description: translated.description || zhItem.description,
                    content: translated.content || zhItem.content,
                    price: zhItem.price,
                    stock: zhItem.stock,
                    sku: zhItem.sku ? `${zhItem.sku}-EN` : null,
                    coverImage: zhItem.coverImage,
                    status: zhItem.status,
                    lang: 'en',
                    translationGroupId: zhItem.translationGroupId,
                    categoryId: zhItem.categoryId
                }
            });
        }
        throw err;
    }
}

// ----------------------------------------------------------------------------
// Category Translation Logic
// ----------------------------------------------------------------------------
async function processCategory(limit: number, ai: any) {
    const zhWithoutGroup = await db.category.findMany({
        where: { lang: 'zh', translationGroupId: null },
        take: 10
    });
    for (const item of zhWithoutGroup) {
        await db.category.update({ where: { id: item.id }, data: { translationGroupId: uuidv4() } });
    }

    const enItems = await db.category.findMany({
        where: { lang: 'en', translationGroupId: { not: null } },
        select: { translationGroupId: true }
    });
    const translatedGroupIds = enItems.map(p => p.translationGroupId).filter((id): id is string => id !== null);

    const targetZh = await db.category.findFirst({
        where: {
            lang: 'zh',
            translationGroupId: { notIn: translatedGroupIds },
            NOT: { translationGroupId: null }
        }
    });

    if (targetZh) {
        return await translateCategory(targetZh, ai);
    }
    return null;
}

async function translateCategory(zhItem: any, ai: any) {
    let translated: any = {};
    try {
        const inputJson = JSON.stringify({
            name: zhItem.name,
            description: zhItem.description || ''
        });

        const response = await ai.generateContent(`
            Translate Category JSON from Chinese to English.
            Output JSON: { "name": "...", "description": "..." }
            
            Input:
            ${inputJson}
        `, { response_format: { type: 'json_object' } });

        try {
            const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
            translated = JSON.parse(cleanJson);
        } catch (e) {
            throw new Error("AI Translation Parse Error");
        }

        return await db.category.create({
            data: {
                name: translated.name || zhItem.name,
                slug: `${zhItem.slug}-en`,
                description: translated.description || zhItem.description,
                lang: 'en',
                translationGroupId: zhItem.translationGroupId,
                parentId: zhItem.parentId
            }
        });
    } catch (err: any) {
        if (err.code === 'P2002') {
            return await db.category.create({
                data: {
                    name: translated.name || zhItem.name,
                    slug: `${zhItem.slug}-en-${uuidv4().slice(0, 6)}`,
                    description: translated.description || zhItem.description,
                    lang: 'en',
                    translationGroupId: zhItem.translationGroupId,
                    parentId: zhItem.parentId
                }
            });
        }
        throw err;
    }
}
