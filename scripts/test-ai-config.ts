
import { getAIServiceForUseCase } from '../src/lib/ai/service';
import { db } from '../src/lib/db';

async function main() {
    console.log("Testing AI Service Resolution for 'WRITING'...");

    try {
        const service = await getAIServiceForUseCase('WRITING');
        console.log(`Resolved Service Config ID: ${(service as any).configId}`);

        // Fetch the config to see details
        const config = await db.aIConfig.findUnique({ where: { id: (service as any).configId } });
        console.log(`Provider: ${config?.provider}`);
        console.log(`Model: ${config?.modelName}`);
        console.log(`BaseURL: ${config?.baseUrl}`);

        console.log("\nTesting SEO Generation Prompt...");
        const seoPrompt = `
            作为一名 SEO 专家，请为以下文章内容生成优化的元数据。
            内容摘要/正文：
            Test Content about AI and SEO optimization.
            
            请生成以下 4 项内容，并以 JSON 格式返回：
            1. title: SEO 优化标题
            2. description: Meta Description
            3. slug: URL Slug
            4. altText: 建议的主图 Alt 文本
            
            返回格式示例：
            {
                "title": "...",
                "description": "...",
                "slug": "...",
                "altText": "..."
            }
            
            仅返回 JSON。
        `;

        const start = Date.now();
        const response = await service.generateContent(seoPrompt);
        const duration = Date.now() - start;

        console.log(`\nResponse (took ${duration}ms):`);
        console.log(response);

        // Try parsing
        const cleanResponse = response.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanResponse);
        console.log("\nParsed successfully:", parsed);

    } catch (e) {
        console.error("\nTEST FAILED:", e);
    }
}

main()
    .then(async () => {
        await db.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await db.$disconnect();
        process.exit(1);
    });
