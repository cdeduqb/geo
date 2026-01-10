import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { getAIServiceForUseCase } from '@/lib/ai/service';

/**
 * POST /api/admin/geo/competitor
 * 执行竞品对比分析
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();
        const { keyword, competitors = [] } = await req.json();

        if (!keyword) {
            return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
        }

        const aiService = await getAIServiceForUseCase('GENERAL');

        // 模拟/获取搜索结果及引证情况的对比
        const comparePrompt = `
            你是一个资深的 GEO (Generative Engine Optimization) 专家。
            请针对关键词 "${keyword}" 进行竞品对比分析。
            我们的网站：企业官网 驱动的官方网站。
            竞争对手：${competitors.join(', ') || '通用行业竞争对手'}。
            
            请分析并对比以下维度：
            1. 品牌提及率 (Mention Share)
            2. 回答权威度得分 (Authority Score 0-100)
            3. 引证来源丰富度
            4. 内容缺口 (Content Gap)
            
            请返回详细的 JSON 格式：
            {
                "ourStats": { "mentionShare": 数字, "authority": 数字 },
                "competitorStats": [
                    { "name": "竞争对手名", "mentionShare": 数字, "authority": 数字 }
                ],
                "contentGap": ["缺口1", "缺口2"],
                "recommendation": "改进建议"
            }
        `;

        const response = await aiService.generateContent(comparePrompt, { response_format: { type: 'json_object' } });
        const analysis = JSON.parse(response.replace(/```json|```/g, '').trim());

        return NextResponse.json({ analysis });
    } catch (error) {
        console.error('[CompetitorAnalysis] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
