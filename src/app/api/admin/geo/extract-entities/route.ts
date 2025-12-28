import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

export interface ExtractedEntity {
    text: string;
    type: 'Person' | 'Place' | 'Organization' | 'Product' | 'Concept';
    description?: string;
    confidence?: number;
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { content, lang = 'zh' } = await request.json();

        if (!content || content.trim().length < 50) {
            return NextResponse.json(
                { error: '内容太短，无法进行实体提取' },
                { status: 400 }
            );
        }

        // 使用 WRITING 用途的 AI 模型
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        const prompt = isEn ? `Please analyze the following text and extract key entities.

Text content:
${content.substring(0, 5000)}

Please return the entity list in JSON format, as follows:
{
    "entities": [
        {
            "text": "Entity Name",
            "type": "Person|Place|Organization|Product|Concept",
            "description": "Brief description (optional)"
        }
    ]
}

Entity Type Description:
- Person: Persons (e.g., Elon Musk, Steve Jobs)
- Place: Locations (e.g., Beijing, Silicon Valley)
- Organization: Organizations (e.g., Alibaba, Apple Inc.)
- Product: Products or services (e.g., iPhone, ChatGPT)
- Concept: Concepts or terms (e.g., Artificial Intelligence, Blockchain)

Requirements:
1. Only extract entities explicitly mentioned in the text.
2. Extract up to 5 most important entities for each type.
3. Ensure the type field value is one of the five above.
4. Return ONLY JSON, no other content.` : `请分析以下文本，提取其中的关键实体。

文本内容：
${content.substring(0, 5000)}

请以 JSON 格式返回实体列表，格式如下：
{
    "entities": [
        {
            "text": "实体名称",
            "type": "Person|Place|Organization|Product|Concept",
            "description": "简短描述（可选）"
        }
    ]
}

实体类型说明：
- Person: 人物（如：马云、乔布斯）
- Place: 地点（如：北京、硅谷）
- Organization: 组织机构（如：阿里巴巴、苹果公司）
- Product: 产品或服务（如：iPhone、ChatGPT）
- Concept: 概念或术语（如：人工智能、区块链）

要求：
1. 只提取文本中明确提到的实体
2. 每种类型最多提取 5 个最重要的实体
3. 确保 type 字段的值是上述五种之一
4. 只返回 JSON，不要有其他内容`;

        const response = await aiService.generateContent(prompt, {
            response_format: { type: 'json_object' }
        });

        // 解析 AI 返回的 JSON
        let entities: ExtractedEntity[] = [];
        try {
            // 尝试从响应中提取 JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                entities = parsed.entities || [];

                // 验证和清理实体数据
                entities = entities
                    .filter((e: any) => e.text && e.type)
                    .map((e: any) => ({
                        text: String(e.text).trim(),
                        type: ['Person', 'Place', 'Organization', 'Product', 'Concept'].includes(e.type)
                            ? e.type
                            : 'Concept',
                        description: e.description ? String(e.description).trim() : undefined
                    }));
            }
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
            console.log('Raw response:', response);
        }

        return NextResponse.json({
            entities,
            count: entities.length
        });

    } catch (error) {
        console.error('Entity extraction error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '实体提取失败' },
            { status: 500 }
        );
    }
}
