const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateModuleTypes() {
    console.log('开始迁移模板类型...');

    try {
        // 获取所有使用旧类型的模板
        const templates = await prisma.pageTemplate.findMany({
            where: {
                OR: [
                    { moduleType: 'COMPONENT' },
                    { moduleType: 'SIDEBAR' },
                    { moduleType: 'HERO' }
                ]
            }
        });

        console.log(`找到 ${templates.length} 个需要迁移的模板`);

        // 映射旧类型到新类型
        const typeMapping = {
            'COMPONENT': 'HOME_PAGE',
            'SIDEBAR': 'HOME_PAGE',
            'HERO': 'HOME_PAGE'
        };

        // 更新每个模板
        for (const template of templates) {
            const newType = typeMapping[template.moduleType] || 'HOME_PAGE';

            await prisma.pageTemplate.update({
                where: { id: template.id },
                data: { moduleType: newType }
            });

            console.log(`已更新模板: ${template.name} (${template.moduleType} -> ${newType})`);
        }

        console.log('迁移完成！');
    } catch (error) {
        console.error('迁移失败:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

migrateModuleTypes();
