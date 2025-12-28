import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// 用户提交留言
export async function POST(request: Request) {
    try {
        const { name, email, phone, subject, content } = await request.json();

        // 验证必填字段 - 姓名、手机号和留言内容必填
        if (!name || !phone || !content) {
            return NextResponse.json(
                { error: '请填写姓名、手机号和留言内容' },
                { status: 400 }
            );
        }

        // 简单手机号格式验证（支持更多格式）
        const phoneRegex = /^[\d\-+\s()]{7,20}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { error: '请输入有效的电话号码' },
                { status: 400 }
            );
        }

        // 创建留言
        const message = await db.message.create({
            data: {
                name,
                email: email || null,
                phone: phone,
                subject: subject || null,
                content,
            },
        });

        return NextResponse.json({ success: true, id: message.id });
    } catch (error: any) {
        console.error('提交留言失败:', error);
        return NextResponse.json(
            { error: `提交留言失败: ${error.message}` },
            { status: 500 }
        );
    }
}
