import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ take: 1, select: { id: true } });
  if (!users.length) {
    console.log('未找到用户，无法关联文章作者');
    return;
  }
  const authorId = users[0].id;

  const dummyArticle = await prisma.article.create({
    data: {
      title: '关于数字化驱动企业业务持续稳定增长的关键探讨与深度系统分',
      slug: `ai-test-article-${Date.now()}`,
      content: '<p>在这个日新月异、瞬息万变的数字化时代。首先，数字化转型已经成为了企业不可剥夺的核心动力。</p><p>其次，我们看到越来越多的企业拥抱变化，使用大模型工具。综上所述，毫无疑问，这是未来不可逆转的趋势，任何企业都必须抓紧时代的脉搏才能乘风破浪。</p>',
      summary: '这是一篇充满套话、没有实质性信息、严重依赖大模型关联词的测试水文。',
      status: 'DRAFT',
      authorId: authorId,
      aiGenerated: true,
      aiDetectorScore: 92,
      aiDetectorResult: '打分：92 分。\n检测结果：文本严重依赖大模型常用的衔接词与空泛用语，如“日新月异”、“首先”、“其次”、“综上所述”、“不可逆转的趋势”、“时代脉搏”等。整体论述浮于表面，呈明显的拼凑感与极高的机械度，缺乏人类基于立足点的实际情感。'
    }
  });

  console.log('✅ 测试高机械度文章创建成功!');
  console.log('请前往后台查看：http://localhost:3000/admin/articles');
  console.log('文章编排地址：http://localhost:3000/admin/articles/' + dummyArticle.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
