const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncConfig() {
    console.log('🚀 开始自动同步数据库设置...');

    try {
        // 1. 修复 SystemSetting 中的 site_url (解决预览不成功问题)
        console.log('--- 正在同步 SystemSetting ---');
        const existingUrl = await prisma.systemSetting.findUnique({
            where: { key: 'site_url' }
        });

        if (existingUrl) {
            await prisma.systemSetting.update({
                where: { key: 'site_url' },
                data: { value: '' } // 清空域名，改回相对路径
            });
            console.log('✅ 已将 site_url 设为空字符串（使用相对路径，解决预览问题）');
        } else {
            await prisma.systemSetting.create({
                data: {
                    key: 'site_url',
                    value: '',
                    description: '网站域名（留空则自动使用相对路径）'
                }
            });
            console.log('✅ 已创建缺少的 site_url 设置项');
        }

        // 2. 修复 AIConfig (确保图片生成使用正确的协议)
        console.log('\n--- 正在同步 AIConfig ---');
        const imageConfigs = await prisma.aIConfig.findMany({
            where: { useCase: 'IMAGE' }
        });

        for (const config of imageConfigs) {
            if (config.provider === 'volcengine') {
                await prisma.aIConfig.update({
                    where: { id: config.id },
                    data: {
                        provider: 'openai', // 临时改为 openai 协议以兼容通用 API 调用
                        baseUrl: 'https://ark.cn-beijing.volces.com/api/v3'
                    }
                });
                console.log(`✅ 已修复 AI 配置 ID: ${config.id}，将 volcengine 协议更新为兼容模式`);
            }
        }

        console.log('\n✨ 同步成功！请重启服务后刷新后台。');

    } catch (error) {
        console.error('❌ 同步过程中出错:', error);
    } finally {
        await prisma.$disconnect();
    }
}

syncConfig();
