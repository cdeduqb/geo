import { NextResponse } from 'next/server';
import { PrismaClient as LicenseClient } from '@prisma/client-license';

const licenseDb = new LicenseClient();

/**
 * GET /api/license-admin/stats
 * 获取统计数据
 */
export async function GET() {
    try {
        // 并行查询所有统计数据
        const [
            customersCount,
            licensesCount,
            activeLicenses,
            onlineInstances,
            recentOrders
        ] = await Promise.all([
            licenseDb.customer.count(),
            licenseDb.license.count(),
            licenseDb.license.count({ where: { status: 'active' } }),
            licenseDb.licenseInstance.count({ where: { status: 'online' } }),
            licenseDb.order.findMany({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setDate(1)) // 本月
                    },
                    paymentStatus: 'completed'
                },
                select: { finalAmount: true }
            })
        ]);

        // 计算本月收入
        const monthlyRevenue = recentOrders.reduce(
            (sum, order) => sum + Number(order.finalAmount),
            0
        );

        return NextResponse.json({
            customers: customersCount,
            licenses: licensesCount,
            activeLicenses,
            onlineInstances,
            monthlyRevenue: monthlyRevenue.toFixed(2)
        });

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            { error: '获取统计失败' },
            { status: 500 }
        );
    }
}
