import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('开始创建文章列表页面...');

    // 获取一个文章列表模版（使用极简列表风格）
    const articleTemplate = await prisma.pageTemplate.findFirst({
        where: {
            name: '文章列表 - 极简列表风格',
        }
    });

    if (!articleTemplate) {
        console.error('未找到文章列表模版，请先运行 seed-article-list-templates.ts');
        return;
    }

    // 检查是否已存在 articles 页面
    const existingPage = await prisma.page.findUnique({
        where: { slug: 'articles' }
    });

    if (existingPage) {
        console.log('articles 页面已存在，更新模版设置...');
        await prisma.page.update({
            where: { slug: 'articles' },
            data: {
                templateId: articleTemplate.id,
                type: 'ARTICLE_LIST',
                status: 'PUBLISHED'
            }
        });
    } else {
        console.log('创建新的 articles 页面...');
        await prisma.page.create({
            data: {
                slug: 'articles',
                title: '文章列表',
                content: '', // 内容由模版提供
                type: 'ARTICLE_LIST',
                status: 'PUBLISHED',
                templateId: articleTemplate.id,
            }
        });
    }

    console.log('文章列表页面创建/更新完成！');
    console.log('现在访问 /articles 将使用模版系统渲染。');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
