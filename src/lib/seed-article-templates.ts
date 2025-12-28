import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedArticleTemplates() {
    console.log('🌱 开始创建文章列表页面模板...');

    // 模板 1: 经典网格布局
    const gridTemplate = await prisma.pageTemplate.upsert({
        where: {
            id: 'article-template-grid'
        },
        update: {},
        create: {
            id: 'article-template-grid',
            name: '经典文章网格',
            description: '3列响应式网格布局，大卡片设计，适合展示丰富的文章内容',
            moduleType: 'ARTICLE_PAGE',
            type: 'ARTICLE_LIST',
            version: 1,
            isActive: false,
            isDefault: false,
            content: `
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="mb-12 text-center">
                        <h1 class="text-4xl font-bold text-gray-900  mb-4">最新文章</h1>
                        <p class="text-lg text-gray-600 ">探索我们的精彩内容</p>
                    </div>
                    <!-- ArticleList component will be rendered here with layout="grid" -->
                    <div id="article-list" data-layout="grid"></div>
                </div>
            `,
            style: JSON.stringify({
                layout: 'grid',
                columns: 3,
                gap: 32,
                cardStyle: 'elevated'
            })
        }
    });

    // 模板 2: 列表式布局
    const listTemplate = await prisma.pageTemplate.upsert({
        where: {
            id: 'article-template-list'
        },
        update: {},
        create: {
            id: 'article-template-list',
            name: '简约文章列表',
            description: '单列列表布局，紧凑设计，适合阅读型网站',
            moduleType: 'ARTICLE_PAGE',
            type: 'ARTICLE_LIST',
            version: 1,
            isActive: false,
            isDefault: false,
            content: `
                <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="mb-12">
                        <h1 class="text-4xl font-bold text-gray-900  mb-4">文章列表</h1>
                        <p class="text-gray-600 ">浏览所有文章内容</p>
                    </div>
                    <!-- ArticleList component will be rendered here with layout="list" -->
                    <div id="article-list" data-layout="list"></div>
                </div>
            `,
            style: JSON.stringify({
                layout: 'list',
                cardStyle: 'compact',
                imagePosition: 'left'
            })
        }
    });

    // 模板 3: 杂志风格布局
    const magazineTemplate = await prisma.pageTemplate.upsert({
        where: {
            id: 'article-template-magazine'
        },
        update: {},
        create: {
            id: 'article-template-magazine',
            name: '杂志风文章',
            description: '混合布局，特色文章大图展示，其余文章小卡片显示',
            moduleType: 'ARTICLE_PAGE',
            type: 'ARTICLE_LIST',
            version: 1,
            isActive: false,
            isDefault: false,
            content: `
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div class="mb-12 text-center">
                        <h1 class="text-5xl font-bold text-gray-900  mb-6">精选文章</h1>
                        <p class="text-xl text-gray-600  max-w-2xl mx-auto">
                            发现最新、最有价值的内容
                        </p>
                    </div>
                    <!-- ArticleList component will be rendered here with layout="magazine" -->
                    <div id="article-list" data-layout="magazine"></div>
                </div>
            `,
            style: JSON.stringify({
                layout: 'magazine',
                featuredSize: 'large',
                gridColumns: 4
            })
        }
    });

    console.log('✅ 文章列表页面模板创建完成:');
    console.log(`  - ${gridTemplate.name} (ID: ${gridTemplate.id})`);
    console.log(`  - ${listTemplate.name} (ID: ${listTemplate.id})`);
    console.log(`  - ${magazineTemplate.name} (ID: ${magazineTemplate.id})`);
}

seedArticleTemplates()
    .catch((e) => {
        console.error('❌ 种子数据创建失败:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
