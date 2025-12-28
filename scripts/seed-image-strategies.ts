
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
    console.log('start seeding image strategies...');

    const strategies = [
        // 封面图策略
        {
            name: '科技感封面',
            targetType: 'IMAGE_COVER',
            prompt: '一张充满未来感的科技风格图片，主题是：{title}。背景包含抽象的数据流和发光的几何图形，色调以深蓝和霓虹青为主，展现高科技和创新的氛围。高质量，高清，3D 渲染风格。',
            temperature: 0.7,
        },
        {
            name: '商务简约封面',
            targetType: 'IMAGE_COVER',
            prompt: '一张专业、极简的商务风格图片，表现主题：{title}。画面构图简洁，使用柔和的自然光，背景可以是现代化的办公室一角或抽象的商务元素。色调以白色、灰色和淡蓝为主，传达信任和专业的品牌形象。',
            temperature: 0.7,
        },
        {
            name: '抽象创意封面',
            targetType: 'IMAGE_COVER',
            prompt: '一张富有创意的抽象艺术图片，灵感来源于：{title}。使用大胆的色彩对比和流动的线条，表现摘要中的核心概念：{summary}。风格类似现代数字艺术，视觉冲击力强。',
            temperature: 0.8,
        },

        // 正文配图策略
        {
            name: '写实风格配图',
            targetType: 'IMAGE_CONTENT',
            prompt: '一张写实风格的照片，准确描绘以下场景：{selection}。光影自然，细节丰富，类似国家地理杂志的摄影风格。',
            temperature: 0.7,
        },
        {
            name: '扁平插画配图',
            targetType: 'IMAGE_CONTENT',
            prompt: '一张现代扁平化风格的插画，解释这个概念：{selection}。色彩明快，线条简洁，适合互联网产品的 UI 插图风格。',
            temperature: 0.7,
        },
    ];

    for (const strategy of strategies) {
        // Check if exists
        const existing = await db.aIStrategy.findFirst({
            where: {
                name: strategy.name,
                targetType: strategy.targetType
            }
        });

        if (existing) {
            console.log(`Skipping existing strategy: ${strategy.name}`);
            continue;
        }

        await db.aIStrategy.create({
            data: strategy
        });
        console.log(`Created strategy: ${strategy.name}`);
    }

    console.log('✅ Image strategies seeding completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
