/**
 * 创建授权系统初始管理员
 */
const { PrismaClient } = require('@prisma/client-license');
const crypto = require('crypto');

const db = new PrismaClient();

async function createAdmin() {
    console.log('🔐 创建授权系统管理员...\n');

    // 密码: admin123
    const password = 'admin123';
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {
        const admin = await db.admin.create({
            data: {
                username: 'admin',
                email: 'license@geocms.com',
                password: hashedPassword,
                role: 'super_admin',
                status: 'active'
            }
        });

        console.log('✅ 管理员创建成功！\n');
        console.log('━'.repeat(50));
        console.log('📋 登录信息:');
        console.log('━'.repeat(50));
        console.log(`用户名: ${admin.username}`);
        console.log(`邮箱: ${admin.email}`);
        console.log(`密码: admin123`);
        console.log(`角色: ${admin.role}`);
        console.log('━'.repeat(50));
        console.log('\n🌐 管理后台地址:');
        console.log('http://localhost:3000/license-admin/login');
        console.log('\n⚠️  请登录后立即修改密码！\n');

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('⚠️  管理员已存在\n');

            const existing = await db.admin.findFirst({
                where: { username: 'admin' }
            });

            if (existing) {
                console.log('━'.repeat(50));
                console.log('📋 现有管理员信息:');
                console.log('━'.repeat(50));
                console.log(`用户名: ${existing.username}`);
                console.log(`邮箱: ${existing.email}`);
                console.log(`角色: ${existing.role}`);
                console.log(`状态: ${existing.status}`);
                console.log('━'.repeat(50));
                console.log('\n如需重置密码，请删除后重新创建。');
            }
        } else {
            console.error('❌ 创建失败:', error);
            process.exit(1);
        }
    } finally {
        await db.$disconnect();
    }
}

createAdmin();
