/**
 * 清除授权数据库中的所有数据
 * 用于重新测试
 */

const { PrismaClient } = require('@prisma/client-license');

const db = new PrismaClient();

async function clearAllData() {
    console.log('🗑️  清除授权数据库...\n');
    console.log('='.repeat(70));

    try {
        // 删除顺序很重要（因为外键约束）
        console.log('\n1. 删除心跳记录...');
        const heartbeats = await db.licenseHeartbeat.deleteMany();
        console.log(`   ✅ 删除 ${heartbeats.count} 条心跳记录`);

        console.log('\n2. 删除授权实例...');
        const instances = await db.licenseInstance.deleteMany();
        console.log(`   ✅ 删除 ${instances.count} 个授权实例`);

        console.log('\n3. 删除授权...');
        const licenses = await db.license.deleteMany();
        console.log(`   ✅ 删除 ${licenses.count} 个授权`);

        console.log('\n4. 删除订单...');
        const orders = await db.order.deleteMany();
        console.log(`   ✅ 删除 ${orders.count} 个订单`);

        console.log('\n5. 删除客户...');
        const customers = await db.customer.deleteMany();
        console.log(`   ✅ 删除 ${customers.count} 个客户`);

        console.log('\n6. 删除审计日志...');
        const logs = await db.auditLog.deleteMany();
        console.log(`   ✅ 删除 ${logs.count} 条日志`);

        console.log('\n' + '='.repeat(70));
        console.log('✅ 数据库清理完成！');
        console.log('='.repeat(70));

        console.log('\n💡 提示:');
        console.log('   - 所有授权数据已清除');
        console.log('   - 可以重新开始测试');
        console.log('   - 管理员账户未删除（在Admin表）\n');

    } catch (error) {
        console.error('\n❌ 清理失败:', error);
    } finally {
        await db.$disconnect();
    }
}

clearAllData();
