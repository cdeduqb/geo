import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const { fieldName, fieldLabel, currentValue, context } = await request.json();

        if (!fieldName) {
            return NextResponse.json(
                { error: '缺少字段名称' },
                { status: 400 }
            );
        }

        // 获取 AI 服务
        const aiService = await getAIService();

        // 构建上下文信息
        const contextInfo = context ? `
页面类型: ${context.sectionType || '通用页面'}
页面标题: ${context.pageTitle || '企业官网'}
其他已填字段: ${JSON.stringify(context.otherFields || {}, null, 2)}
` : '';

        // 构建提示词
        const prompt = `你是一个专业的网站内容编辑。请为以下字段生成合适的中文内容。

字段名称: ${fieldLabel || fieldName}
字段类型: ${getFieldTypeDescription(fieldName)}
当前内容: ${currentValue || '(空)'}
${contextInfo}

要求:
1. 生成的内容应该专业、有吸引力
2. 内容要符合企业官网的风格
3. 只返回生成的内容本身，不要包含任何解释或标记
4. 内容长度要适中，不要太长也不要太短
5. 如果是标题类字段，控制在20字以内
6. 如果是描述类字段，控制在100字左右
7. 必须使用中文

请直接输出内容:`;

        const aiResponse = await aiService.generateContent(prompt);

        // 清理响应
        let cleanContent = aiResponse.trim();
        // 移除可能的引号包裹
        if ((cleanContent.startsWith('"') && cleanContent.endsWith('"')) ||
            (cleanContent.startsWith("'") && cleanContent.endsWith("'"))) {
            cleanContent = cleanContent.slice(1, -1);
        }

        return NextResponse.json({ content: cleanContent });
    } catch (error) {
        console.error('[AI Generate Content] Error:', error);
        return NextResponse.json(
            { error: '生成内容失败: ' + (error instanceof Error ? error.message : '未知错误') },
            { status: 500 }
        );
    }
}

// 根据字段名推断字段类型描述
function getFieldTypeDescription(fieldName: string): string {
    const lowerName = fieldName.toLowerCase();

    if (lowerName.includes('title') || lowerName.includes('heading')) {
        return '标题文本（简短有力）';
    }
    if (lowerName.includes('subtitle') || lowerName.includes('subheading')) {
        return '副标题（补充说明主标题）';
    }
    if (lowerName.includes('description') || lowerName.includes('desc')) {
        return '描述文本（详细说明）';
    }
    if (lowerName.includes('button') || lowerName.includes('cta')) {
        return '按钮文案（行动号召）';
    }
    if (lowerName.includes('quote') || lowerName.includes('testimonial')) {
        return '评价/引用（客户反馈）';
    }
    if (lowerName.includes('name')) {
        return '名称';
    }
    if (lowerName.includes('content')) {
        return '内容正文';
    }

    return '文本内容';
}
