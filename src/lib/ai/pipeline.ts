import { getAIServiceForUseCase } from './service';
import { db } from '../db';
import { getActiveStorageProvider, generateFileKey } from '../storage/factory';
import { logger } from '../logger';

/**
 * AI 内容增强流水线服务
 * 用于对生成的文章进行 GEO 优化、配图、内链等处理
 */
export class ContentPipelineService {
    /**
     * GEO 深度优化
     */
    static async optimizeGeo(title: string, content: string, keywords?: string | null, lang: string = 'zh') {
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const prompt = isEn ? `
You are a professional GEO (Generative Engine Optimization) optimization expert.
Please perform a deep optimization on the following article content to increase its visibility and authority in AI search engines (e.g., Perplexity, ChatGPT, Claude).

Article Title: ${title}
${keywords ? `Keywords: ${keywords}` : ''}

Content to optimize:
${content}

Optimization Requirements (Must strictly follow):
1. **Natural Tone**: **CRITICAL** Use clear, concise, and professional English. Avoid "AI-sounding" or overly formal academic language. Do not use transition clichés like "In conclusion", "To summarize", "Firstly/Secondly/Finally".
2. **Compliance & Objectivity**: Do not use superlatives (e.g., "the best", "strongest", "perfect"), follow advertising regulations. Ensure content is legal and objective.
3. **Direct Answer**: The article MUST start **directly** with a 50-100 word core answer or executive summary.
   - **Strictly No** headers like "Summary", "Abstract", or the title itself at the beginning.
   - **Strictly No** repetition of the article title.
   - Start immediately with the main body paragraph. Wrap key terms in <strong> tags.
4. **Mandatory Structure**:
   - **Table**: Analyze data, comparisons, processes, or elements and generate an HTML <table> for summary or comparison.
   - **List**: Break down long paragraphs into <ul> or <ol> lists for readability.
   - **FAQ**: At the end, add an "FAQ" section using <h3> with at least 3 specific question-answer pairs.
5. **Entities & Semantics**:
   - Bold key entities, products, names, and technical terms using <strong> for knowledge graph extraction.
   - Ensure each paragraph has a clear focus.
6. **Output Constraints (CRITICAL)**:
   - **Only Output HTML**: Do not wrap in markdown code blocks like \`\`\`html.
   - **No** title at the beginning.
   - **Maintain Original Intent**: Keep core facts and viewpoints accurate.

Output the optimized complete HTML content (directly use <p>, <h3>, <ul>, <table>, etc.):
` : `
你是一位专业的 GEO (Generative Engine Optimization) 优化专家。
请对以下文章内容进行深度优化，以提升其在 AI 搜索引擎（如 Perplexity, ChatGPT, Claude）中的可见度和权重。

文章标题：${title}
${keywords ? `关键词：${keywords}` : ''}

待优化内容：
${content}

优化要求（必须严格遵守）：
1. **自然去 AI 化 (Natural Tone)**：**CRITICAL** 必须使用通俗易懂、口语化但不失专业的中文表达。避免“翻译腔”，避免使用复杂的长句。严禁使用“总而言之”、“综上所述”、“首先、其次、最后”等僵硬的 AI 模版词汇。
2. **合规性与客观性 (Compliance)**：严禁使用最高级词汇（如“全网第一”、“最强”、“完美”等），遵守广告法。确保内容合法合规，不含敏感信息。
3. **开篇即精华 (Direct Answer)**：文章开头必须**直接**是一段 50-100 字的核心回答或精华总结。
   - **严禁**出现“快速摘要”、“文章摘要”、“${title}”等任何形式的标题或标签前缀。
   - **严禁**重复文章标题。
   - 直接开始正文段落。关键词使用 <strong> 包裹。
4. **强制结构化 (Mandatory Structure)**：
   - **表格 (Table)**：分析内容中涉及的数据、对比、流程或要素，**必须**生成一个 HTML <table> 表格进行总结或对比。
   - **列表 (List)**：将长段落拆解为 <ul> 或 <ol> 列表以提高可读性。
   - **Q&A 模块**：在文章末尾，**必须**使用 <h3> 增加一个“常见问题解答 (FAQ)”章节，包含至少 3 个具体的问答对。
5. **实体与语义**：
   - 对文章中出现的关键实体、产品名、人名、专业术语进行 <strong> 加粗强调，便于知识图谱提取。
   - 优化段落逻辑，确保每段都有清晰的中心。
6. **输出约束 (CRITICAL)**：
   - **仅输出 HTML**：不要包含 \`\`\`html 等任何代码块标记。
   - **不要**在开头输出文章标题。
   - **保持原意**：虽然重组结构，但必须保持文章的核心观点 and 事实准确。

请开始输出优化后的完整 HTML 内容（直接输出 <p>, <h3>, <ul>, <table> 等标签）：
`;

        logger.info(`[Pipeline] GEO optimizing for: ${title} (${lang})`);
        const optimized = await aiService.generateContent(prompt);
        logger.info(`[Pipeline] GEO optimization received length: ${optimized.length}`);
        return optimized.replace(/```html/g, '').replace(/```/g, '').trim();
    }

    /**
     * 智能配图强化
     */
    static async illustrate(title: string, content: string, userId: string, lang: string = 'zh') {
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const analyzerPrompt = isEn ? `
As a senior web content editor, please analyze the following article and suggest 2-3 paragraph nodes that need illustrations.
For each illustration point, please provide:
1. **Location Description (afterText)**: Which complete paragraph this illustration should follow (please provide the last 15-20 characters of that paragraph to ensure uniqueness).
2. **AI Drawing Prompt (Visual Prompt)**: Used to generate a beautiful, professional illustration matching the paragraph's theme.
3. **English Caption (caption)**: Provide a short English title or description for this image.

**Illustration Style Requirements:**
- **High Quality & Cinematic**: Prompts should include keywords like "Cinematic lighting, High quality, 4k, Professional photography".
- **Content Relevant**: The image should visually reflect the scene, object, or concept described in the paragraph.
- **Avoid Text**: Strictly **no text** in prompts (e.g., avoid "signboard with text"), as it often ruins the aesthetics.
- **Prompt Language**: Drawing prompts must be in **English**.

Please return in JSON format:
{ "illustrations": [{ "afterText": "...", "prompt": "...", "caption": "..." }] }

Article Title: ${title}
Article Content: ${content.substring(0, 4000)}
` : `
作为一位资深网页内容编辑，请分析以下文章内容，并建议 2-3 个需要配图的段落节点。
对于每个配图点，请提供：
1. **位置描述 (afterText)**：该配图应该插入在哪个完整段落之后（请提供该段落末尾的 15-20 个字符，确保唯一性）。
2. **AI 绘图提示词 (Visual Prompt)**：用于生成一张精美且专业的、符合段落主题的配图。
3. **中文说明 (caption)**：为这张图片提供一个简短的中文标题或描述。

**配图风格要求：**
- **高品质摄影感**：提示词应包含 "Cinematic lighting, High quality, 4k, Professional photography" 等词汇。
- **内容相关**：图片应直观反映段落描述的场景、物体或概念。
- **避免文字**：尽量通过视觉元素表达，**不要**在提示词中要求生成文字（如 signboard with text），因为这往往会破坏美感。
- **提示词语言**：绘图提示词必须使用**英语**。

请以 JSON 格式返回：
{ "illustrations": [{ "afterText": "...", "prompt": "...", "caption": "..." }] }

文章标题：${title}
文章内容：${content.substring(0, 4000)}
`;

        logger.info(`[Pipeline] Analyzing illustration points for: ${title} (${lang})`);
        const analysisRes = await aiService.generateContent(analyzerPrompt, { response_format: { type: 'json_object' } });
        logger.info(`[Pipeline] Analysis result: ${analysisRes.slice(0, 100)}...`);
        let analysis;
        try {
            const jsonMatch = analysisRes.match(/\{[\s\S]*\}/);
            analysis = JSON.parse(jsonMatch ? jsonMatch[0] : analysisRes);
        } catch (e) {
            console.error('[Pipeline] Analysis parse fail', e);
            return content;
        }

        const items = analysis.illustrations || [];
        if (items.length === 0) return content;

        const imageService = await getAIServiceForUseCase('IMAGE');
        const storage = await getActiveStorageProvider();
        let newContent = content;

        for (const item of items) {
            try {
                // Modified prompt to match Cover Image style (Cinematic/High Quality) and remove strict text rendering requirements
                const strictPrompt = `PROMPT: ${item.prompt}. STYLE: Cinematic, High Resolution, Photorealistic, 8k, Detailed texture, Depth of field.`;
                const genResult = await imageService.generateImage(strictPrompt);

                if (genResult.url) {
                    const imgRes = await fetch(genResult.url);
                    const buffer = Buffer.from(await imgRes.arrayBuffer());
                    const filename = `illustration-${Date.now()}.png`;
                    const key = generateFileKey(filename, 'illustrations');
                    const upload = await storage.upload(buffer, key, 'image/png');

                    await db.file.create({
                        data: {
                            filename, storageKey: upload.key, mimeType: 'image/png',
                            size: buffer.length, url: upload.url, category: 'image',
                            uploadedById: userId, description: `Illustration for: ${title}`
                        }
                    });

                    const imgTag = `
<figure class="my-8 text-center">
  <img src="${upload.url}" alt="${item.caption || title}" class="rounded-2xl shadow-xl w-full object-cover max-h-[500px]" />
  <figcaption class="mt-3 text-sm text-gray-500 font-medium italic">${lang === 'en' ? 'Image: ' : '图：'}${item.caption || (lang === 'en' ? 'AI Generated Image' : 'AI 生成配图')}</figcaption>
</figure>`;

                    if (item.afterText && newContent.includes(item.afterText)) {
                        const idx = newContent.indexOf(item.afterText);
                        const after = newContent.substring(idx + item.afterText.length);
                        const tagEnd = after.indexOf('>');
                        if (tagEnd !== -1 && tagEnd < 20) {
                            const pos = idx + item.afterText.length + tagEnd + 1;
                            newContent = newContent.slice(0, pos) + imgTag + newContent.slice(pos);
                        } else {
                            newContent = newContent.replace(item.afterText, item.afterText + imgTag);
                        }
                    } else {
                        newContent += imgTag;
                    }
                }
            } catch (err) {
                console.error('[Pipeline] Image error', err);
            }
        }
        return newContent;
    }

    /**
     * 智能自动内链
     */
    static async autoLink(title: string, content: string, articleId?: string, lang: string = 'zh') {
        const otherArticles = await db.article.findMany({
            where: { status: 'PUBLISHED', id: { not: articleId || '' }, lang: lang },
            select: { id: true, title: true, slug: true },
            take: 50
        });

        if (otherArticles.length === 0) return content;

        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';
        const contextArticles = otherArticles.map(a => `{"title": "${a.title}", "url": "/article/${a.slug}"}`).join('\n');

        const prompt = isEn ? `
You are a professional SEO optimization assistant. Your task is to automatically add internal links to the following article.

Current Article Title: ${title}
Available Internal Articles List:
${contextArticles}

Content to process:
${content}

Requirements:
1. Identify phrases in the content relevant to the "Available Internal Articles List" and insert <a href="/article/slug">key phrase</a>.
2. Suggest 2-4 internal links for the entire article. Only output the processed complete HTML.
` : `
你是一个专业的 SEO 优化助手。你的任务是为以下文章内容自动添加站内内链。

当前文章标题：${title}
站内可选文章列表：
${contextArticles}

待处理内容：
${content}

要求：
1. 识别中与“可选文章列表”相关的词汇，插入 <a href="/article/slug">关键内容</a>。
2. 每篇文章建议 2-4 个内链。仅输出处理后的完整 HTML。
`;

        logger.info(`[Pipeline] Auto-linking for: ${title} with ${otherArticles.length} candidates`);
        const linked = await aiService.generateContent(prompt);
        logger.info(`[Pipeline] Auto-linking completed, length: ${linked.length}`);
        return linked.replace(/```html/g, '').replace(/```/g, '').trim();
    }

    /**
     * 生成 SEO 元数据
     */
    static async generateSEO(title: string, content: string, lang: string = 'zh') {
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const prompt = isEn ? `
As an SEO expert, generate SEO metadata for this article.

Article Title: ${title}
Article Summary: ${content.substring(0, 1000)}...

Please return in JSON format:
{
    "title": "SEO Optimized Title (within 60 characters)",
    "description": "Meta Description (within 150 characters)",
    "keywords": "5-8 keywords, comma separated",
    "slug": "url-friendly-slug-lowercase"
}
` : `
作为 SEO 专家，请为这篇文章生成 SEO 元数据。

文章标题：${title}
文章内容摘要：${content.substring(0, 1000)}...

请返回 JSON 格式：
{
    "title": "SEO 优化标题 (60字符以内)",
    "description": "Meta Description (150字符以内)",
    "keywords": "5-8个关键词, 逗号分隔",
    "slug": "url-friendly-english-slug-lowercase"
}
`;
        logger.info(`[Pipeline] Generating SEO for: ${title}`);
        const res = await aiService.generateContent(prompt, { response_format: { type: 'json_object' } });
        try {
            const jsonMatch = res.match(/\{[\s\S]*\}/);
            return JSON.parse(jsonMatch ? jsonMatch[0] : res);
        } catch (e) {
            logger.error('[Pipeline] SEO generation parse failed', e);
            return { title: title, description: title, keywords: '', slug: '' };
        }
    }

    /**
     * 实体提取
     */
    static async extractEntities(content: string, lang: string = 'zh') {
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const prompt = isEn ? `
Please analyze the following text and extract key entities (Person, Organization, Place, Product, Concept).

Text content: ${content.substring(0, 2000)}...

Please return in JSON format:
[
    { "text": "Entity Name", "type": "Type", "relevance": 0-10 score }
]
` : `
请分析以下文本，提取其中的关键实体（人物、组织、地点、产品、概念）。

文本内容：${content.substring(0, 2000)}...

请返回 JSON 格式：
[
    { "text": "实体名", "type": "类型", "relevance": 0-10评分 }
]
`;
        logger.info(`[Pipeline] Extracting entities`);
        const res = await aiService.generateContent(prompt, { response_format: { type: 'json_object' } });
        try {
            const jsonMatch = res.match(/\[[\s\S]*\]/); // Array match
            // Sometimes it wraps in { entities: [] } or just []
            if (!jsonMatch) {
                const objMatch = res.match(/\{[\s\S]*\}/);
                if (objMatch) {
                    const obj = JSON.parse(objMatch[0]);
                    return obj.entities || obj.items || [];
                }
                return [];
            }
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            logger.error('[Pipeline] Entity extraction parse failed', e);
            return [];
        }
    }

    /**
     * 生成引用/参考文献
     */
    static async generateCitations(title: string, content: string, lang: string = 'zh') {
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const prompt = isEn ? `
Please generate 3-5 relevant references or citations for this article (books, authoritative websites, papers, or logically inferred sources).

Article Title: ${title}
Article Content: ${content.substring(0, 1000)}...

Please return in JSON format:
[
    { "title": "Source Title", "url": "URL (if website)", "author": "Author/Organization", "year": "Year" }
]
` : `
请为这篇文章生成 3-5 个相关的参考文献或引用来源（可以是真实存在的书籍、权威网站、论文，或者是根据内容合理推断的来源）。

文章标题：${title}
文章内容：${content.substring(0, 1000)}...

请返回 JSON 格式：
[
    { "title": "来源标题", "url": "URL(如果是网站)", "author": "作者/机构", "year": "年份" }
]
`;
        logger.info(`[Pipeline] Generating citations`);
        const res = await aiService.generateContent(prompt, { response_format: { type: 'json_object' } });
        try {
            // Try to handle both array and object wrapper returns
            const jsonMatch = res.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                const objMatch = res.match(/\{[\s\S]*\}/);
                if (objMatch) {
                    const obj = JSON.parse(objMatch[0]);
                    return obj.citations || obj.references || obj.sources || [];
                }
                return [];
            }
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            logger.error('[Pipeline] Citation generation parse failed', e);
            return [];
        }
    }
}
