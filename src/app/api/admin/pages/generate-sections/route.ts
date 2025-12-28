import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/service';

export const maxDuration = 300; // 5 minutes timeout

// 可用的组件类型及其描述（供AI参考）
const AVAILABLE_COMPONENTS = `
可用的组件类型列表：

【布局组件 - layout】
- header: 页眉导航组件，包含 logo, siteName, navItems(导航链接数组), showCTA, ctaText, ctaLink
- hero: 首屏横幅，包含 title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, backgroundImage
- footer-01 到 footer-15: 页脚组件，包含 companyName, description, columns(链接分组), copyright, socialLinks

【内容展示 - content】
- features: 功能特性展示，包含 title, subtitle, features(特性数组: title, description, icon)
- rich-text: 富文本内容，包含 content(HTML字符串)
- faq: 常见问题，包含 title, subtitle, items(问题数组: question, answer)
- timeline-01 到 timeline-05: 时间轴组件，包含 title, items(时间点: date, title, description)
- tabs-01 到 tabs-05: 标签页组件，包含 tabs(标签数组: label, content)

【数据列表 - data】
- stats-01 到 stats-06: 数据统计展示，包含 title, stats(统计项: value, label, description)
- pricing-01 到 pricing-06: 价格表，包含 title, plans(套餐: name, price, features数组, ctaText)
- compare-01 到 compare-06: 对比表，包含 title, items(对比项数组)

【营销转化 - marketing】
- cta-01 到 cta-06: 行动号召，包含 title, description, buttonText, buttonLink, backgroundImage
- testimonials-01 到 testimonials-05: 客户评价，包含 title, testimonials(评价: quote, author, title, avatar)
- partner-01 到 partner-06: 合作伙伴/logo墙，包含 title, partners(logo数组: name, logo)

【联系互动 - contact】
- contact-01 到 contact-20: 联系表单，包含 title, subtitle, address, phone, email, showMap
- team-07 到 team-15: 团队介绍，包含 title, members(成员: name, role, avatar, bio)
- map-01 到 map-05: 地图组件，包含 title, address, latitude, longitude

【自定义】
- custom-html: 自定义HTML代码，包含 html(HTML字符串)
`;

// 生成页面结构的系统提示词
const SYSTEM_PROMPT = `你是一个专业的网页结构设计专家。你的任务是根据用户描述，设计一个页面的组件结构。

${AVAILABLE_COMPONENTS}

【输出要求】
1. 必须返回一个有效的 JSON 数组，包含多个组件配置
2. 每个组件必须包含: id (使用 uuid 格式), type (组件类型), data (组件数据)
3. 组件顺序应该符合页面排布逻辑（从上到下）
4. 为每个组件填充真实的、有意义的中文内容
5. 不要包含任何 markdown 标记或解释，只返回 JSON

【内容要求】
1. 所有文本内容使用中文
2. 内容应该专业、有说服力
3. 根据页面目的选择合适的组件组合
4. 图片链接使用占位图 https://placehold.co/600x400

【示例输出格式】
[
  {
    "id": "uuid-1234-5678",
    "type": "hero",
    "data": {
      "title": "欢迎来到我们的网站",
      "subtitle": "专业的解决方案提供商",
      "primaryButtonText": "立即咨询",
      "primaryButtonLink": "/contact"
    }
  },
  {
    "id": "uuid-2345-6789",
    "type": "features",
    "data": {
      "title": "我们的优势",
      "features": [
        {"title": "专业团队", "description": "拥有10年行业经验"},
        {"title": "优质服务", "description": "724小时客户支持"}
      ]
    }
  }
]`;

export async function POST(request: NextRequest) {
    try {
        const { prompt, pageType } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: '缺少描述信息' },
                { status: 400 }
            );
        }

        // 获取 AI 服务
        const aiService = await getAIService();

        // 构建用户提示词
        const userPrompt = `
请根据以下需求设计页面组件结构：

【页面描述】
${prompt}

【页面类型】
${pageType || '企业官网页面'}

请直接返回 JSON 数组，不要包含任何其他文字。`;

        const finalPrompt = `${SYSTEM_PROMPT}\n\n${userPrompt}`;

        const aiResponse = await aiService.generateContent(finalPrompt);

        // 解析并验证 JSON
        let cleanJson = aiResponse.trim();

        // 清理可能存在的 markdown 标记
        if (cleanJson.startsWith('```json')) {
            cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanJson.startsWith('```')) {
            cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        // 尝试解析 JSON
        let sections;
        try {
            sections = JSON.parse(cleanJson);
        } catch (parseError) {
            console.error('JSON 解析失败:', cleanJson);
            return NextResponse.json(
                { error: 'AI 返回的格式不正确，请重试', rawResponse: cleanJson },
                { status: 500 }
            );
        }

        // 验证结构
        if (!Array.isArray(sections)) {
            return NextResponse.json(
                { error: '返回的不是数组格式', rawResponse: sections },
                { status: 500 }
            );
        }

        // 确保每个 section 有必要的字段
        const validatedSections = sections.map((section: any, index: number) => ({
            id: section.id || crypto.randomUUID(),
            type: section.type || 'rich-text',
            data: section.data || {},
            style: section.style || {},
        }));

        return NextResponse.json({
            sections: validatedSections,
            mode: 'visual' // 标记为可视化模式
        });
    } catch (error) {
        console.error('[Generate Sections] Error:', error);
        return NextResponse.json(
            { error: '生成页面结构失败: ' + (error instanceof Error ? error.message : '未知错误') },
            { status: 500 }
        );
    }
}
