import { NextRequest, NextResponse } from 'next/server';
import { getAIServiceForUseCase } from '@/lib/ai/service';

export async function POST(request: NextRequest) {
    try {
        const { content, lang = 'zh' } = await request.json();

        if (!content) {
            return NextResponse.json(
                { error: '缺少文章内容' },
                { status: 400 }
            );
        }

        // 获取 AI 服务
        const aiService = await getAIServiceForUseCase('WRITING');
        const isEn = lang === 'en';

        // 构建提示词
        const prompt = isEn ? `
Please analyze the following article content and extract all worth citing external materials, research, tools, platforms, and information sources.

Article Content:
${content}

Please identify and extract the following types of citations:
1. Explicit external articles or research (with URL, author, publish date)
2. Mentioned research institutions, organizations (e.g., DORA, Gartner)
3. Mentioned open source projects, tools, platforms (e.g., LaunchDarkly, Spinnaker)
4. Cited books, reports, whitepapers
5. Sources for statistics or surveys

For each identified citation, extract as much of the following information as possible:
- title: Title or name of the citation (Required)
- author: Author or organization (if mentioned)
- url: Related official website or document link (if mentioned or inferable, e.g., LaunchDarkly can be inferred as https://launchdarkly.com)
- publishDate: Publish date (if mentioned)
- description: Short description explaining the citation context in the article (1-2 sentences)

Note:
- Even if there's no explicit URL, important external sources should still be extracted
- For well-known tools/platforms, infer their official website URL (e.g., Netflix → https://netflix.com)
- description should explain the purpose or reason for mentioning this citation in the article

Return JSON format:
{
  "citations": [
    {
      "title": "LaunchDarkly Feature Flag Platform",
      "author": "LaunchDarkly",
      "url": "https://launchdarkly.com",
      "publishDate": "",
      "description": "The feature flag management platform mentioned in the article"
    }
  ]
}

If no external citations or sources are found, return an empty array.
` : `
请分析以下文章内容，提取所有值得引用的外部资料、研究、工具、平台和信息来源。

文章内容：
${content}

请识别并提取以下类型的引用：
1. 明确的外部文章或研究（带URL、作者、发布日期）
2. 提到的研究机构、组织（如 DORA、Gartner）
3. 提到的开源项目、工具、平台（如 LaunchDarkly、Spinnaker）
4. 引用的书籍、报告、白皮书
5. 统计数据或调查的来源

对于每个识别的引用，尽可能提取以下信息：
- title: 引用的标题或名称（必需）
- author: 作者或组织（如果提到）
- url: 相关的官方网站或文档链接（如果文中提到或可推断，如 LaunchDarkly 可推断为 https://launchdarkly.com）
- publishDate: 发布日期（如果提到）
- description: 简短描述，说明在文中的引用上下文（1-2句话）

注意：
- 即使没有明确的 URL，只要是重要的外部来源，也应提取
- 对于知名工具/平台，可以推断其官网URL（如 Netflix → https://netflix.com）
- description 应该说明这个引用在文中的用途或提到的原因

返回 JSON 格式：
{
  "citations": [
    {
      "title": "LaunchDarkly 功能开关平台",
      "author": "LaunchDarkly",
      "url": "https://launchdarkly.com",
      "publishDate": "",
      "description": "文章提到的功能开关管理平台"
    }
  ]
}

如果文章中确实没有任何外部引用或来源，返回空数组。
`;


        // 调用 AI 服务
        const aiResponse = await aiService.generateContent(prompt, {
            response_format: { type: 'json_object' }
        });

        console.log('[Extract Citations] AI Response:', aiResponse.substring(0, 200));

        // 解析 JSON 响应
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(aiResponse);
        } catch (parseError) {
            console.error('[Extract Citations] JSON Parse Error:', parseError);
            console.error('[Extract Citations] AI Response:', aiResponse);
            return NextResponse.json(
                { error: 'AI 返回的格式不正确，无法解析为引用列表' },
                { status: 500 }
            );
        }

        const citations = parsedResponse.citations || [];

        console.log('[Extract Citations] Extracted citations:', citations.length);

        return NextResponse.json({ citations });
    } catch (error) {
        console.error('[Extract Citations] Error:', error);
        return NextResponse.json(
            { error: '提取引用失败: ' + (error instanceof Error ? error.message : '未知错误') },
            { status: 500 }
        );
    }
}
