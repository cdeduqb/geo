const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const project = await prisma.articleAutomationProject.create({
        data: {
            name: 'Final Pipeline Test',
            topic: 'Future of Sustainable Energy',
            dailyLimit: 2,
            totalCount: 2,
            status: 'ACTIVE',
            authorId: 'user_2ozI5fO8A9kYyitQ6P91FvDsq8e', // I'll use a real UUID from DB
            categoryId: '3921855e-99e7-4f67-a25e-3ee5f0b18fd6',
            strategyId: '98d5a86a-7333-4f9e-bc43-6c8430b8e661',
            enableGeo: true,
            enableIllustrate: true,
            enableAutoLink: true,
            enableCover: true,
            tasks: {
                create: [
                    {
                        topic: 'Automation: Solar Energy Advancements',
                        scheduledAt: new Date(Date.now() - 3600000), // 1 hour ago
                        status: 'PENDING'
                    }
                ]
            }
        }
    });
    console.log('Project created:', project.id);
}

// Find a real user/category/strategy first to ensure validity
async function setup() {
    const user = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    const cat = await prisma.category.findFirst();
    const strat = await prisma.aIStrategy.findFirst({ where: { targetType: 'ARTICLE_CONTENT' } });

    if (!user || !cat || !strat) {
        console.log('Missing dependencies');
        return;
    }

    const project = await prisma.articleAutomationProject.create({
        data: {
            name: 'Final Pipeline Test',
            topic: 'Sustainable Energy',
            dailyLimit: 2,
            totalCount: 1,
            status: 'ACTIVE',
            authorId: user.id,
            categoryId: cat.id,
            strategyId: strat.id,
            enableGeo: true,
            enableIllustrate: true,
            enableAutoLink: true,
            enableCover: true,
            tasks: {
                create: [
                    {
                        topic: 'Automation: Solar Energy Advancements',
                        scheduledAt: new Date(Date.now() - 3600000), // 1 hour ago
                        status: 'PENDING'
                    }
                ]
            }
        }
    });
    console.log('Test project created:', project.id);
}

setup().finally(() => prisma.$disconnect());
