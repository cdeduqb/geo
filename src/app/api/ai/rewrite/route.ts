import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';
import { HtmlRewriter } from '@/lib/ai/html-rewriter';

// 纯文本重写提示词
const TEXT_PROMPTS = {
    general: (text: string, instruction?: string) => `
你是一个专业的文本重写助手。你的任务是重写用户的文本。
【严格约束】
1. 直接输出重写后的文本。
2. 严禁包含 "好的"、"重写如下" 等任何解释性文字。
3. 严禁使用 markdown 代码块标记 (如 \`\`\`)。
4. 保持原文的核心信息不变。
${instruction ? `5. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    improve: (text: string, instruction?: string) => `
你是一个专业的文案编辑。请改进以下文本的表达，使其更专业、流畅。
【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    expand: (text: string, instruction?: string) => `
请扩展以下文本，增加细节和说明。
【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    shorten: (text: string, instruction?: string) => `
请精简以下文本，保留核心要点。
【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    formal: (text: string, instruction?: string) => `
请将文本改写为正式、专业的风格。
【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    casual: (text: string, instruction?: string) => `
请将文本改写为轻松、口语化的风格。
【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    custom: (text: string, instruction: string) => `
${instruction}
【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。

原文:
${text}`
};

// HTML 标记感知提示词
const HTML_PROMPTS = {
    general: (text: string, instruction?: string) => `
请重写以下文本，优化表达。
【格式说明】
文本中包含 [TAG0], [TAG1] 等格式标记。
1. 必须保留所有标记，且成对出现。
2. 只修改标记间的文字。
3. 不要修改标记本身。

【严格约束】
1. 直接输出重写后的文本。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    improve: (text: string, instruction?: string) => `
请改进以下文本的表达。
【格式说明】
保留所有 [TAGx] 标记。只修改文字。

【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    expand: (text: string, instruction?: string) => `
请扩展以下文本。
【格式说明】
保留所有 [TAGx] 标记。只扩展文字。

【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    shorten: (text: string, instruction?: string) => `
请精简以下文本。
【格式说明】
保留所有 [TAGx] 标记。只精简文字。

【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    formal: (text: string, instruction?: string) => `
请将文本改写为正式风格。
【格式说明】
保留所有 [TAGx] 标记。只修改文字。

【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    casual: (text: string, instruction?: string) => `
请将文本改写为轻松风格。
【格式说明】
保留所有 [TAGx] 标记。只修改文字。

【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    custom: (text: string, instruction: string) => `
${instruction}

【格式说明】
保留所有 [TAGx] 标记。只修改文字。

【严格约束】
1. 直接输出结果。
2. 严禁包含任何解释或 markdown 标记。

原文:
${text}`
};

// HTML 结构重写提示词
const STRUCTURE_PROMPTS = {
    general: (text: string, instruction?: string) => `
请重写以下 HTML 内容，优化结构和表达。
【严格约束】
1. 直接输出优化后的 HTML 代码。
2. 严禁包含 \`\`\`html 或任何 markdown 标记。
3. 严禁包含任何解释性文字。
4. 返回必须是合法的 HTML 片段。
${instruction ? `5. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    improve: (text: string, instruction?: string) => `
请改进以下 HTML 内容的表达和结构。
【严格约束】
1. 直接输出 HTML 代码。
2. 严禁包含 markdown 标记或解释。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    expand: (text: string, instruction?: string) => `
请扩展以下 HTML 内容。
【严格约束】
1. 直接输出 HTML 代码。
2. 严禁包含 markdown 标记或解释。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    shorten: (text: string, instruction?: string) => `
请精简以下 HTML 内容。
【严格约束】
1. 直接输出 HTML 代码。
2. 严禁包含 markdown 标记或解释。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    formal: (text: string, instruction?: string) => `
请将内容改写为正式风格。
【严格约束】
1. 直接输出 HTML 代码。
2. 严禁包含 markdown 标记或解释。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    casual: (text: string, instruction?: string) => `
请将内容改写为轻松风格。
【严格约束】
1. 直接输出 HTML 代码。
2. 严禁包含 markdown 标记或解释。
${instruction ? `3. 额外要求: ${instruction}` : ''}

原文:
${text}`,

    custom: (text: string, instruction: string) => `
${instruction}

【严格约束】
1. 直接输出 HTML 代码。
2. 严禁包含 markdown 标记或解释。
3. 可以修改、添加或删除 HTML 标签。

原文:
${text}`
};

export async function POST(request: NextRequest) {
    try {
        // mode: 'text' (纯文本) | 'preserve' (保留结构) | 'rewrite' (重写结构)
        // 兼容旧参数 preserveHtml
        const body = await request.json();
        const { originalText, rewriteType, customInstruction } = body;

        let mode = body.mode;
        if (!mode) {
            mode = body.preserveHtml ? 'preserve' : 'text';
        }

        // 验证输入
        if (!originalText || typeof originalText !== 'string') {
            return NextResponse.json(
                { error: '请提供要重写的文本' },
                { status: 400 }
            );
        }

        if (!rewriteType || !(rewriteType in TEXT_PROMPTS)) {
            return NextResponse.json(
                { error: '无效的重写类型' },
                { status: 400 }
            );
        }

        if (rewriteType === 'custom' && !customInstruction) {
            return NextResponse.json(
                { error: '自定义重写需要提供指令' },
                { status: 400 }
            );
        }

        // 使用系统配置的 AI 服务
        const aiService = await getAIService();
        let rewrittenText = '';

        if (mode === 'rewrite') {
            // HTML 结构重写模式
            let prompt: string;
            if (rewriteType === 'custom' && customInstruction) {
                prompt = STRUCTURE_PROMPTS.custom(originalText, customInstruction);
            } else {
                const promptFn = STRUCTURE_PROMPTS[rewriteType as keyof Omit<typeof STRUCTURE_PROMPTS, 'custom'>];
                prompt = promptFn(originalText, customInstruction); // 传入 customInstruction
            }

            rewrittenText = await aiService.generateContent(prompt);

            // 清理可能存在的 markdown 代码块标记
            rewrittenText = rewrittenText.replace(/^```html\n/, '').replace(/^```\n/, '').replace(/\n```$/, '');

        } else if (mode === 'preserve') {
            // HTML 结构保留模式 (原 preserveHtml=true)
            try {
                const rewriter = new HtmlRewriter();
                const { markedText, tagMap } = rewriter.toMarked(originalText);

                // 构建 HTML 感知提示词
                let prompt: string;
                if (rewriteType === 'custom' && customInstruction) {
                    prompt = HTML_PROMPTS.custom(markedText, customInstruction);
                } else {
                    const promptFn = HTML_PROMPTS[rewriteType as keyof Omit<typeof HTML_PROMPTS, 'custom'>];
                    prompt = promptFn(markedText, customInstruction); // 传入 customInstruction
                }

                const aiResult = await aiService.generateContent(prompt);

                // 验证并转回 HTML
                const validation = rewriter.validateMarks(aiResult, tagMap);

                if (validation.success) {
                    rewrittenText = rewriter.fromMarked(aiResult, tagMap);
                } else {
                    console.warn('AI重写丢失了HTML标记,尝试回退到纯文本模式', validation.missingTags);
                    rewrittenText = aiResult.replace(/\[\/?TAG\d+\/?\]/g, '');
                }
            } catch (error) {
                console.error('HTML重写处理失败:', error);
                // 出错时回退到纯文本模式
                const promptFn = TEXT_PROMPTS[rewriteType as keyof Omit<typeof TEXT_PROMPTS, 'custom'>];
                const prompt = promptFn(originalText.replace(/<[^>]+>/g, ''), customInstruction); // 传入 customInstruction
                rewrittenText = await aiService.generateContent(prompt);
            }
        } else {
            // 纯文本模式 (mode === 'text')
            let prompt: string;
            if (rewriteType === 'custom' && customInstruction) {
                prompt = TEXT_PROMPTS.custom(originalText, customInstruction);
            } else {
                const promptFn = TEXT_PROMPTS[rewriteType as keyof Omit<typeof TEXT_PROMPTS, 'custom'>];
                prompt = promptFn(originalText, customInstruction); // 传入 customInstruction
            }
            rewrittenText = await aiService.generateContent(prompt);
        }

        return NextResponse.json({
            success: true,
            rewrittenText: rewrittenText.trim(),
            rewriteType,
            mode
        });
    } catch (error) {
        console.error('AI 重写错误:', error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'AI 重写失败',
                details: error instanceof Error ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}
