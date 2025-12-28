import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';

export const maxDuration = 300; // 5 minutes timeout


export async function POST(request: NextRequest) {
    try {
        const { prompt, moduleType, style } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: '缺少描述信息' },
                { status: 400 }
            );
        }

        // 获取 AI 服务
        const aiService = await getAIService();

        // 构建提示词
        const systemPrompt = `
你是一个专业的前端开发专家，擅长使用 HTML5 和 Tailwind CSS 构建现代、响应式、美观的网页组件。
你的任务是根据用户的描述，生成高质量的 HTML 代码。

要求：
1. **只返回 HTML 代码**，不要包含 markdown 标记、解释或其他文字。
2. **使用 Tailwind CSS** 进行所有样式设计，确保设计美观、现代。
3. **响应式设计**：必须适配移动端 (mobile-first) 和桌面端。
4. **语义化 HTML**：使用正确的标签 (header, section, article, footer 等)。
5. **图标**：如果需要图标，请使用 svg 标签直接嵌入，或者假设使用了 Lucide React (但输出 HTML 时最好用 SVG 以免依赖问题)。为了通用性，请使用简单的 SVG 图标。
6. **图片**：使用占位图 (如 https://placehold.co/600x400) 或纯色背景。
7. **布局**：确保布局结构清晰，层级分明。
8. **交互**：如果需要交互（如下拉菜单），请使用简单的 CSS hover 效果或 checkbox hack，尽量避免复杂的行内 JS。

模板类型上下文：${moduleType || '通用组件'}
风格偏好：${style || '现代简约'}

请生成代码。
`;

        const userPrompt = `请根据以下描述生成 HTML 代码：\n${prompt}`;

        // 调用 AI 服务
        // 注意：这里我们使用 generateContent，并希望它直接返回代码
        // 为了确保返回格式，我们可以再次强调
        const finalPrompt = `${systemPrompt}\n\n${userPrompt}\n\n请直接返回 HTML 代码，不要包裹在 \`\`\`html 中。`;

        const aiResponse = await aiService.generateContent(finalPrompt);

        // 清理可能存在的 markdown 标记
        let cleanHtml = aiResponse.trim();
        if (cleanHtml.startsWith('```html')) {
            cleanHtml = cleanHtml.replace(/^```html/, '').replace(/```$/, '');
        } else if (cleanHtml.startsWith('```')) {
            cleanHtml = cleanHtml.replace(/^```/, '').replace(/```$/, '');
        }

        return NextResponse.json({ html: cleanHtml.trim() });
    } catch (error) {
        console.error('[Generate Template] Error:', error);
        return NextResponse.json(
            { error: '生成模板失败: ' + (error instanceof Error ? error.message : '未知错误') },
            { status: 500 }
        );
    }
}
