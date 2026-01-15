const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

/**
 * 全域修复脚本 v3.0
 * 解决三大问题：
 * 1. 图片无法预览 - 输出正确的 Nginx 配置
 * 2. 站长工具提示无法访问 - 统一 site_url
 * 3. AI 创作任务无法执行 - 检查 CRON 配置
 */

// 自动读取 .env 文件
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/DATABASE_URL=["']?(mysql:\/\/[^"'\n]+)["']?/);
    if (match && match[1]) {
        process.env.DATABASE_URL = match[1];
    }
}

const prisma = new PrismaClient();

// 【核心配置】请确保这是您浏览器访问网站的完整地址（带 https 和 www）
const REAL_DOMAIN = 'https://www.moli123.com';

async function diagnoseAndFix() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║         全域修复脚本 v3.0 - 三大问题一键解决             ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    if (!process.env.DATABASE_URL) {
        console.error('❌ 错误: 无法解析 DATABASE_URL。请确保在项目根目录运行。');
        return;
    }

    try {
        // ========== 问题 1: 修复 site_url 配置 ==========
        console.log('【1/4】修复站点 URL 配置...');

        const existingUrl = await prisma.systemSetting.findUnique({ where: { key: 'site_url' } });
        console.log(`   当前值: ${existingUrl?.value || '(空)'}`);

        await prisma.systemSetting.upsert({
            where: { key: 'site_url' },
            update: { value: REAL_DOMAIN },
            create: { key: 'site_url', value: REAL_DOMAIN, description: '网站完整访问域名' }
        });
        console.log(`   ✅ 已更新为: ${REAL_DOMAIN}`);

        // ========== 问题 2: 修复 SEO 推送配置 ==========
        console.log('\n【2/4】修复 SEO 推送配置...');

        const baiduConfig = await prisma.sEOPushConfig.findFirst({ where: { platform: 'baidu' } });
        if (baiduConfig && baiduConfig.apiUrl) {
            const oldApi = baiduConfig.apiUrl;
            const newApiUrl = baiduConfig.apiUrl.replace(/site=[^&]+/, `site=${REAL_DOMAIN}`);

            if (oldApi !== newApiUrl) {
                await prisma.sEOPushConfig.update({
                    where: { id: baiduConfig.id },
                    data: {
                        apiUrl: newApiUrl,
                        siteId: REAL_DOMAIN.replace(/^https?:\/\//, '')
                    }
                });
                console.log(`   ✅ 百度推送 API 已修正`);
                console.log(`      旧: ${oldApi}`);
                console.log(`      新: ${newApiUrl}`);
            } else {
                console.log(`   ✓ 百度推送配置已正确`);
            }
        }

        const indexNowConfig = await prisma.sEOPushConfig.findFirst({ where: { platform: 'indexnow' } });
        if (indexNowConfig) {
            await prisma.sEOPushConfig.update({
                where: { id: indexNowConfig.id },
                data: { siteId: REAL_DOMAIN }
            });
            console.log(`   ✅ IndexNow 站点 ID 已更正为: ${REAL_DOMAIN}`);
        }

        // ========== 问题 3: 检查 CRON 配置 ==========
        console.log('\n【3/4】检查 AI 创作任务调度器...');

        // 检查 .env 中的 DISABLE_CRON
        const envContent = fs.readFileSync(envPath, 'utf8');
        if (envContent.includes('DISABLE_CRON=true')) {
            console.log('   ⚠️ 警告: DISABLE_CRON=true，AI 任务调度器已被禁用！');
            console.log('   📌 修复方法: 将 .env 中的 DISABLE_CRON 改为 false');
        } else {
            console.log('   ✓ CRON 调度器未被禁用');
        }

        // 检查 NEXT_PUBLIC_SITE_URL
        const siteUrlMatch = envContent.match(/NEXT_PUBLIC_SITE_URL=["']?([^"'\n]+)/);
        if (siteUrlMatch) {
            const envSiteUrl = siteUrlMatch[1];
            if (envSiteUrl.includes('localhost') || envSiteUrl.includes('127.0.0.1')) {
                console.log(`   ⚠️ 警告: .env 中 NEXT_PUBLIC_SITE_URL 是 ${envSiteUrl}`);
                console.log('   📌 这会导致 AI 创作任务无法执行！');
                console.log(`   📌 修复方法: 改为 NEXT_PUBLIC_SITE_URL=${REAL_DOMAIN}`);
            } else if (envSiteUrl !== REAL_DOMAIN) {
                console.log(`   ⚠️ 警告: .env 中 NEXT_PUBLIC_SITE_URL=${envSiteUrl}`);
                console.log(`   📌 与数据库 site_url (${REAL_DOMAIN}) 不一致`);
                console.log(`   📌 建议统一修改为: ${REAL_DOMAIN}`);
            } else {
                console.log(`   ✓ NEXT_PUBLIC_SITE_URL 配置正确: ${envSiteUrl}`);
            }
        } else {
            console.log('   ⚠️ 警告: .env 中未找到 NEXT_PUBLIC_SITE_URL');
            console.log(`   📌 建议添加: NEXT_PUBLIC_SITE_URL=${REAL_DOMAIN}`);
        }

        // 检查待执行任务
        const pendingTasks = await prisma.aICreationTask.count({
            where: { status: 'PENDING' }
        });
        console.log(`   📊 当前待执行任务数: ${pendingTasks}`);

        // ========== 问题 1 补充: Nginx 配置建议 ==========
        console.log('\n【4/4】Nginx 配置诊断（图片无法预览的根本原因）');
        const uploadPath = path.join(process.cwd(), 'public', 'uploads');
        console.log('──────────────────────────────────────────────────────────');
        console.log('请在服务器 Nginx 配置文件中添加或修正以下内容：\n');
        console.log(`location /uploads/ {`);
        console.log(`    alias ${uploadPath}/;`);
        console.log(`    expires 30d;`);
        console.log(`    add_header Access-Control-Allow-Origin *;`);
        console.log(`}`);
        console.log('──────────────────────────────────────────────────────────');
        console.log('📌 修改后请执行: nginx -s reload');

        console.log('\n╔══════════════════════════════════════════════════════════╗');
        console.log('║                    修复完成！                            ║');
        console.log('╚══════════════════════════════════════════════════════════╝');
        console.log('\n⚠️ 请务必：');
        console.log('   1. 检查并修改服务器上的 .env 文件');
        console.log('   2. 检查并修改 Nginx 配置');
        console.log('   3. 重启 PM2 进程: pm2 restart all');
        console.log('   4. 重启 Nginx: nginx -s reload');

    } catch (error) {
        console.error('\n❌ 修复过程中遇到错误:', error);
    } finally {
        await prisma.$disconnect();
    }
}

diagnoseAndFix();
