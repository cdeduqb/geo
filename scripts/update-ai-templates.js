const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateAITemplates() {
    console.log('开始更新 AI 生成的模板标记...');

    try {
        // 查找所有模板
        const allTemplates = await prisma.pageTemplate.findMany();

        console.log(`共找到 ${allTemplates.length} 个模板`);

        // 筛选出可能是 AI 生成的模板
        // AI 生成的模板：sections 为 null 且 content 不为空
        const aiTemplates = allTemplates.filter(t =>
            (!t.sections || (typeof t.sections === 'object' && Object.keys(t.sections).length === 0)) &&
            t.content &&
            t.content.trim().length > 0 &&
            !t.isAIGenerated
        );

        console.log(`找到 ${aiTemplates.length} 个可能是 AI 生成的模板`);

        if (aiTemplates.length === 0) {
            console.log('没有需要更新的模板');
            return;
        }

        // 更新这些模板
        for (const template of aiTemplates) {
            await prisma.pageTemplate.update({
                where: { id: template.id },
                data: { isAIGenerated: true }
            });

            console.log(`✅ 已更新模板: ${template.name} (ID: ${template.id})`);
        }

        console.log(`\n✅ 更新完成！共更新 ${aiTemplates.length} 个模板`);
    } catch (error) {
        console.error('❌ 更新失败:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

updateAITemplates();
