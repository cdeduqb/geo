import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('正在生成测试引用数据...');

  const queries = [
    '如何开发微信小程序',
    '成都小程序开发公司推荐',
    '小程序开发成本分析',
    'AI搜索优化GEO怎么做',
    'Next.js 15 新特性',
    'TailwindCSS 实战教程',
    'Prisma 数据库迁移指南',
    '微信小程序支付功能实现',
    '小程序直播功能开发'
  ];

  const platforms = ['ChatGPT', 'Perplexity', 'Claude', 'Gemini', 'BING AI'];

  // 先清空一下旧话题
  await prisma.trendingTopic.deleteMany({});
  await prisma.contentRecommendation.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const query = queries[Math.floor(Math.random() * queries.length)];
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    // 生成过去 15 天内的数据
    const daysAgo = Math.floor(Math.random() * 15);
    const citedAt = new Date();
    citedAt.setDate(citedAt.getDate() - daysAgo);

    await prisma.aICitation.create({
      data: {
        platform,
        query,
        articleId: '25d31106-399e-4e16-9168-1278e91ec5a3',
        articleTitle: '成都小程序开发公司|小程序开发流程及成本解析',
        citedAt
      }
    });
  }

  console.log('✅ 50 条测试引用数据已生成');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
