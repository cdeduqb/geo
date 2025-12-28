import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';

const licenseDb = new LicenseClient();

/**
 * PUT /api/license-admin/customers/[id]
 * 更新客户信息
 */
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const body = await request.json();
        const { companyName, contactPerson, phone, address, status } = body;

        const customer = await licenseDb.customer.update({
            where: { id: params.id },
            data: {
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
        console.error('Update customer error:', error);
        return NextResponse.json(
            { error: '更新客户失败' },
            { status: 500 }
        );
    }
}
