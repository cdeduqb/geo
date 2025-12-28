import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function testAndFixAuthorCards() {
    console.log('🔍 检查作者和文章数据...\n');

    // 1. 检查所有用户
    const users = await db.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            isPublicAuthor: true,
            _count: {
                select: { articles: true }
            }
        }
    });

    console.log(`📊 找到 ${users.length} 个用户：`);
    users.forEach(user => {
        console.log(`  - ${user.name || user.email}: 公开=${user.isPublicAuthor}, 文章数=${user._count.articles}`);
    });
    console.log('');

    // 2. 检查已发布的文章
    const articles = await db.article.findMany({
        where: { status: 'PUBLISHED' },
        select: {
            id: true,
            title: true,
            slug: true,
            author: {
                select: {
                    id: true,
                    name: true,
                    isPublicAuthor: true
                }
            }
        },
        take: 5
    });

    console.log(`📝 找到 ${articles.length} 篇已发布文章：`);
    articles.forEach(article => {
        console.log(`  - "${article.title}" (/${article.slug})`);
        console.log(`    作者: ${article.author.name}, 公开: ${article.author.isPublicAuthor}`);
    });
    console.log('');

    // 3. 统计需要修复的作者
    const authorsWithArticles = users.filter(u => u._count.articles > 0);
    const nonPublicAuthors = authorsWithArticles.filter(u => !u.isPublicAuthor);

    if (nonPublicAuthors.length > 0) {
        console.log(`⚠️  发现 ${nonPublicAuthors.length} 个有文章但未公开的作者\n`);
        console.log('🔧 正在自动修复...\n');

        // 4. 将所有有文章的作者设置为公开
        for (const user of nonPublicAuthors) {
            await db.user.update({
                where: { id: user.id },
                data: { isPublicAuthor: true }
            });
            console.log(`✅ 已将 ${user.name || user.email} 设置为公开作者`);
        }
        console.log('');
    } else {
        console.log('✅ 所有有文章的作者都已设置为公开\n');
    }

    // 5. 输出测试 URL
    if (articles.length > 0) {
        console.log('🌐 测试链接：');
        articles.forEach(article => {
            console.log(`  http://localhost:3000/article/${article.slug}`);
        });
    }

    await db.$disconnect();
}

testAndFixAuthorCards()
    .then(() => {
        console.log('\n✨ 测试和修复完成！');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ 错误:', error);
        process.exit(1);
    });
