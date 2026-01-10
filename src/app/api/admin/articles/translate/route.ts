import { NextRequest, NextResponse } from 'next/server';
import { db as prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { locales } from '@/lib/i18n';

// 语言名称映射
const LANG_NAMES: Record<string, string> = {
    'zh': '简体中文',
    'en': '英语',
    'ja': '日语',
    'ko': '韩语',
    'fr': '法语',
    'de': '德语',
    'es': '西班牙语',
    'pt': '葡萄牙语',
    'ru': '俄语',
    'ar': '阿拉伯语',
};

// 获取AI配置
async function getAIConfig() {
    let aiConfig = await prisma.aIConfig.findFirst({
        where: {
            isActive: true,
            provider: { in: ['openai', 'deepseek', 'zhipu', 'minimax'] }
        },
        orderBy: { updatedAt: 'desc' },
    });

    if (!aiConfig) {
        aiConfig = await prisma.aIConfig.findFirst({
            where: { isActive: true },
            orderBy: { updatedAt: 'desc' },
        });
    }

    if (!aiConfig) {
        throw new Error('没有可用的AI配置');
    }

    return aiConfig;
}

// 调用AI API
async function callAI(aiConfig: any, systemPrompt: string, userPrompt: string, maxTokens: number = 4000): Promise<string> {
    const apiKey = aiConfig.apiKey;
    const baseUrl = aiConfig.baseUrl;
    const model = aiConfig.modelName || 'gpt-3.5-turbo';

    let response;

    if (aiConfig.provider === 'openai') {
        response = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: maxTokens,
            }),
        });
    } else if (aiConfig.provider === 'deepseek') {
        response = await fetch(`${baseUrl || 'https://api.deepseek.com/v1'}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: model || 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: maxTokens,
            }),
        });
    } else {
        response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
            }),
        });
    }

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[AI翻译] API错误:', errorText);
        throw new Error(`AI API调用失败: ${response.statusText}`);
    }

    const data = await response.json();
    const resultContent = data.choices?.[0]?.message?.content;

    if (!resultContent) {
        throw new Error('AI返回内容为空');
    }

    return resultContent.trim();
}

// 调用AI进行翻译
async function translateWithAI(
    title: string,
    summary: string,
    content: string,
    targetLang: string
): Promise<{ title: string; summary: string; content: string; slug: string }> {
    try {
        const aiConfig = await getAIConfig();
        const targetLangName = LANG_NAMES[targetLang] || targetLang;
        const systemPrompt = `你是一个专业的翻译专家，擅长多语言翻译和本地化。`;

        console.log('[AI翻译] 开始翻译:', { title, targetLang: targetLangName });

        // 第一步：翻译标题、摘要和生成slug
        const metaPrompt = `请将以下内容翻译成${targetLangName}，并生成一个适合URL的slug。

标题: ${title}
摘要: ${summary || '(无摘要)'}

请以纯JSON格式返回（不要包含markdown代码块标记），格式如下：
{"title": "翻译后的标题", "summary": "翻译后的摘要", "slug": "url-friendly-slug"}`;

        const metaResult = await callAI(aiConfig, systemPrompt, metaPrompt, 500);

        let translatedMeta = { title, summary, slug: '' };
        try {
            // 尝试解析JSON
            let jsonText = metaResult.trim();
            if (jsonText.startsWith('```')) {
                const match = jsonText.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
                if (match) jsonText = match[1].trim();
            }
            translatedMeta = JSON.parse(jsonText);
        } catch (e) {
            console.warn('[AI翻译] 元数据解析失败，使用原始值:', e);
        }

        // 第二步：翻译正文内容（纯文本返回，不需要JSON格式）
        const contentPrompt = `请将以下HTML内容翻译成${targetLangName}。

翻译要求：
1. 保持原文的语义和风格
2. 保留所有HTML标签和格式
3. 专业术语要准确翻译
4. 确保翻译自然流畅

请直接返回翻译后的HTML内容，不要添加任何额外的说明文字或代码块标记。

原文内容：
${content.substring(0, 10000)}`;

        const translatedContent = await callAI(aiConfig, systemPrompt, contentPrompt, 8000);

        console.log('[AI翻译] 翻译完成');

        return {
            title: translatedMeta.title || title,
            summary: translatedMeta.summary || summary,
            content: translatedContent || content,
            slug: translatedMeta.slug || '',
        };
    } catch (error) {
        console.error('[AI翻译] 翻译失败:', error);
        throw error;
    }
}

// POST - 翻译文章
export async function POST(request: NextRequest) {
    try {
        await requireAdmin();

        const body = await request.json();
        const { articleId, targetLang, createNew = true } = body;

        if (!articleId) {
            return NextResponse.json(
                { error: '缺少articleId参数' },
                { status: 400 }
            );
        }

        if (!targetLang) {
            return NextResponse.json(
                { error: '缺少目标语言参数' },
                { status: 400 }
            );
        }

        // 获取原文章
        const article = await prisma.article.findUnique({
            where: { id: articleId },
            include: {
                category: true,
                author: true,
            },
        });

        if (!article) {
            return NextResponse.json(
                { error: '文章不存在' },
                { status: 404 }
            );
        }

        // 检查目标语言文章是否已存在
        if (createNew && article.translationGroupId) {
            const existingTranslation = await prisma.article.findFirst({
                where: {
                    translationGroupId: article.translationGroupId,
                    lang: targetLang,
                },
            });

            if (existingTranslation) {
                return NextResponse.json(
                    { error: `该文章的${LANG_NAMES[targetLang] || targetLang}版本已存在` },
                    { status: 400 }
                );
            }
        }

        // 调用AI翻译
        const translated = await translateWithAI(
            article.title,
            article.summary || '',
            article.content,
            targetLang
        );

        // 生成唯一slug
        const baseSlug = translated.slug || article.slug;
        let newSlug = `${baseSlug}-${targetLang}`;
        let counter = 1;

        while (true) {
            const existing = await prisma.article.findFirst({
                where: { slug: newSlug, lang: targetLang },
            });
            if (!existing) break;
            newSlug = `${baseSlug}-${targetLang}-${counter}`;
            counter++;
        }

        if (createNew) {
            // 创建新的翻译文章
            const translationGroupId = article.translationGroupId || `group_${Date.now()}`;

            // 如果原文章没有翻译组，更新它
            if (!article.translationGroupId) {
                await prisma.article.update({
                    where: { id: articleId },
                    data: { translationGroupId },
                });
            }

            const newArticle = await prisma.article.create({
                data: {
                    title: translated.title,
                    slug: newSlug,
                    content: translated.content,
                    summary: translated.summary,
                    coverImage: article.coverImage,
                    status: 'DRAFT',
                    lang: targetLang,
                    translationGroupId,
                    categoryId: article.categoryId,
                    authorId: article.authorId,
                    citations: article.citations as any,
                    entities: article.entities as any,
                },
            });

            return NextResponse.json({
                success: true,
                message: '翻译完成，已创建新文章',
                article: newArticle,
                redirectUrl: `/admin/articles/${newArticle.id}`,
            });
        } else {
            // 仅返回翻译结果，不创建新文章
            return NextResponse.json({
                success: true,
                translated: {
                    title: translated.title,
                    summary: translated.summary,
                    content: translated.content,
                    slug: newSlug,
                },
            });
        }
    } catch (error: any) {
        console.error('翻译失败:', error);
        return NextResponse.json(
            { error: error.message || '翻译失败' },
            { status: 500 }
        );
    }
}

// GET - 获取支持的语言列表
export async function GET() {
    try {
        await requireAdmin();

        return NextResponse.json({
            languages: locales.map((locale: string) => ({
                code: locale,
                name: LANG_NAMES[locale] || locale,
            })),
        });
    } catch (error) {
        console.error('获取语言列表失败:', error);
        return NextResponse.json(
            { error: '获取语言列表失败' },
            { status: 500 }
        );
    }
}
