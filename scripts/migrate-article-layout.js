const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateArticleLayout() {
    console.log('开始迁移文章布局类型...');

    try {
        // 获取所有使用 ARTICLE_LAYOUT 的模板
        const templates = await prisma.pageTemplate.findMany({
            where: {
                moduleType: 'ARTICLE_LAYOUT'
            }
        });

        console.log(`找到 ${templates.length} 个需要迁移的文章布局模板`);

        // 更新每个模板
        for (const template of templates) {
            await prisma.pageTemplate.update({
                where: { id: template.id },
                data: { moduleType: 'ARTICLE_PAGE' }
            });

            console.log(`已更新模板: ${template.name} (ARTICLE_LAYOUT -> ARTICLE_PAGE)`);
        }

        console.log('迁移完成！');
    } catch (error) {
        console.error('迁移失败:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

migrateArticleLayout();
