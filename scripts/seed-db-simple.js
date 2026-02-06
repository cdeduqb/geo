const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
    console.log('🚀 开始初始化数据库默认数据...');

    try {
        // 1. 创建默认管理员
        const hashedPassword = hashPassword('admin123');
        const admin = await prisma.user.upsert({
            where: { email: 'admin@example.com' },
            update: {},
            create: {
                email: 'admin@example.com',
                name: '管理员',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        console.log('✅ 默认管理员已就绪: admin@example.com / admin123');

        // 2. 创建基础分类
        const techCategory = await prisma.category.upsert({
            where: { id: '550e8400-e29b-41d4-a716-446655440001' },
            update: {},
            create: {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: '科技',
                slug: 'technology',
                description: '科技相关文章',
            }
        });
        console.log('✅ 基础分类已创建');

        // 3. 初始化系统设置 (包含 site_url 修复)
        // 【重要】请将此域名改为您的实际访问域名
        const REAL_DOMAIN = 'https://www.moli123.com';

        const settings = [
            { key: 'site_name', value: '全域魔力GEO', description: '网站名称' },
            { key: 'site_url', value: REAL_DOMAIN, description: '网站完整访问域名（用于 SEO 推送和 AI 任务调度）' },
            { key: 'enable_multi_language', value: 'true', description: '是否开启多语言支持' },
            { key: 'primaryColor', value: '#2563eb', description: '主题色' }
        ];

        for (const s of settings) {
            await prisma.systemSetting.upsert({
                where: { key: s.key },
                update: { value: s.value }, // 每次都更新值
                create: s
            });
        }
        console.log(`✅ 系统核心设置已初始化 (site_url: ${REAL_DOMAIN})`);


        // 4. 创建基础模板 (选取 seed.ts 中最重要的一个)
        await prisma.pageTemplate.upsert({
            where: { id: 'header-classic' },
            update: {},
            create: {
                id: 'header-classic',
                name: '经典导航栏',
                description: '系统默认导航栏',
                moduleType: 'HEADER',
                type: 'GENERAL',
                isActive: true,
                content: '<header>导航栏内容</header>',
                style: 'header { padding: 10px; }'
            }
        });
        console.log('✅ 基础模板已创建');

        console.log('\n✨ 数据库初始化成功！');
    } catch (error) {
        console.error('❌ 初始化失败:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
