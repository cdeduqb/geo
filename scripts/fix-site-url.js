const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

/**
 * 快速修复脚本：确保 site_url 存在于数据库中
 * 用法：node scripts/fix-site-url.js
 */

// 自动加载 .env
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?(mysql:\/\/[^"'\n]+)["']?/);
    if (match && match[1]) {
        process.env.DATABASE_URL = match[1];
    }
}

const prisma = new PrismaClient();

// 【修改这里】设置您的实际域名
const SITE_URL = 'https://www.moli123.com';

async function fixSiteUrl() {
    console.log('🔧 正在检查并修复 site_url 设置...\n');

    if (!process.env.DATABASE_URL) {
        console.error('❌ 错误：无法加载 DATABASE_URL');
        return;
    }

    try {
        // 检查当前值
        const existing = await prisma.systemSetting.findUnique({
            where: { key: 'site_url' }
        });

        if (existing) {
            console.log(`📌 当前 site_url: "${existing.value}"`);

            if (existing.value === SITE_URL) {
                console.log('✅ site_url 已正确配置，无需修改');
                return;
            }

            // 更新
            await prisma.systemSetting.update({
                where: { key: 'site_url' },
                data: { value: SITE_URL }
            });
            console.log(`✅ site_url 已更新为: ${SITE_URL}`);
        } else {
            // 创建
            await prisma.systemSetting.create({
                data: {
                    key: 'site_url',
                    value: SITE_URL,
                    description: '网站完整访问域名（用于 SEO 推送和 AI 任务调度）'
                }
            });
            console.log(`✅ site_url 已创建: ${SITE_URL}`);
        }

        console.log('\n🎉 修复完成！');
        console.log('📌 请重启服务以使配置生效: pm2 restart all');

    } catch (error) {
        console.error('❌ 修复失败:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixSiteUrl();
