import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';

const licenseDb = new LicenseClient();

/**
 * POST /api/license-admin/customers/create
 * 创建新客户
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, companyName, contactPerson, phone, address, status } = body;

        if (!email) {
            return NextResponse.json(
                { error: '邮箱不能为空' },
                { status: 400 }
            );
        }

        // 检查邮箱是否已存在
        const existing = await licenseDb.customer.findFirst({
            where: { email }
        });

        if (existing) {
            return NextResponse.json(
                { error: '该邮箱已被使用' },
                { status: 400 }
            );
        }

        // 创建客户
        const customer = await licenseDb.customer.create({
            data: {
                email,
                companyName: companyName || null,
                contactPerson: contactPerson || null,
                phone: phone || null,
                address: address || null,
                status: status || 'active'
            }
        });

        return NextResponse.json({
            success: true,
            customer
        });

    } catch (error) {
        console.error('Create customer error:', error);
        return NextResponse.json(
            { error: '创建客户失败' },
            { status: 500 }
        );
    }
}
