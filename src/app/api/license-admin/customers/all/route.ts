import { NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';

const licenseDb = new LicenseClient();

/**
 * GET /api/license-admin/customers/all
 * 获取所有客户（包括非激活的）
 */
export async function GET() {
    try {
        const customers = await licenseDb.customer.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ customers });
    } catch (error) {
        console.error('Get all customers error:', error);
        return NextResponse.json(
            { error: '获取客户列表失败' },
            { status: 500 }
        );
    }
}
