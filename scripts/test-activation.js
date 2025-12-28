/**
 * 测试授权激活流程
 * 创建客户 → 生成授权 → 测试激活
 */

const { PrismaClient } = require('@prisma/client-license');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const db = new PrismaClient();

console.log('🧪 测试授权激活流程\n');
console.log('='.repeat(70));

async function testActivationFlow() {
    try {
        // 步骤1: 创建测试客户
        console.log('\n📝 步骤1: 创建测试客户');
        console.log('-'.repeat(70));

        let customer = await db.customer.findFirst({
            where: { email: 'test@geocms.com' }
        });

        if (!customer) {
            customer = await db.customer.create({
                data: {
                    email: 'test@geocms.com',
                    companyName: 'GeoCMS测试公司',
                    contactPerson: '测试用户',
                    phone: '13800138000',
                    status: 'active'
                }
            });
            console.log('✅ 客户创建成功');
        } else {
            console.log('✅ 使用现有客户');
        }
        console.log(`   客户ID: ${customer.id}`);
        console.log(`   邮箱: ${customer.email}`);

        // 步骤2: 生成授权码
        console.log('\n📝 步骤2: 生成授权码');
        console.log('-'.repeat(70));

        const licenseCode = generateLicenseCode();
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1年后

        const licenseData = {
            licenseCode,
            customerId: customer.id,
            plan: 'PRO',
            features: {
                pages: 100,
                ai: true,
                seo: true,
                geo: true,
                customDomain: true
            },
            domains: ['localhost', '*.geocms.com'],
            maxActivations: 1,
            currentActivations: 0,
            issuedAt: now,
            expiresAt,
            status: 'active',
            version: '1.0'
        };

        // 生成签名
        const signature = signLicense(licenseData);

        // 保存授权
        const license = await db.license.create({
            data: {
                ...licenseData,
                signature
            }
        });

        console.log('✅ 授权创建成功');
        console.log(`   授权码: ${licenseCode}`);
        console.log(`   计划: ${license.plan}`);
        console.log(`   有效期: ${expiresAt.toLocaleDateString('zh-CN')}`);

        // 步骤3: 测试激活
        console.log('\n📝 步骤3: 测试激活API');
        console.log('-'.repeat(70));

        const activateBody = {
            licenseCode,
            domain: 'localhost'
        };

        console.log('发送激活请求...');
        const response = await fetch('http://localhost:3000/api/license/activate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(activateBody)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            console.log('✅ 激活成功！');
            console.log('   响应:', JSON.stringify(result, null, 2));
        } else {
            console.log('❌ 激活失败');
            console.log('   错误:', result.error || result);
        }

        // 步骤4: 验证缓存
        console.log('\n📝 步骤4: 检查本地缓存');
        console.log('-'.repeat(70));

        const cacheFile = path.join(process.cwd(), '.license-cache', 'license.enc');
        if (fs.existsSync(cacheFile)) {
            console.log('✅ 缓存文件已创建');
            const stats = fs.statSync(cacheFile);
            console.log(`   文件大小: ${stats.size} bytes`);
            console.log(`   位置: ${cacheFile}`);
        } else {
            console.log('⚠️  缓存文件未找到');
        }

        // 总结
        console.log('\n' + '='.repeat(70));
        console.log('📊 测试总结');
        console.log('='.repeat(70));
        console.log('✅ 客户创建: 成功');
        console.log('✅ 授权生成: 成功');
        console.log(`${response.ok ? '✅' : '❌'} 授权激活: ${response.ok ? '成功' : '失败'}`);

        console.log('\n💡 使用说明:');
        console.log('━'.repeat(70));
        console.log('1. 访问 http://localhost:3000/admin/license');
        console.log('2. 点击"激活授权"');
        console.log(`3. 输入授权码: ${licenseCode}`);
        console.log('4. 点击"激活"');
        console.log('━'.repeat(70));

    } catch (error) {
        console.error('\n❌ 测试失败:', error);
    } finally {
        await db.$disconnect();
    }
}

function generateLicenseCode() {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `LIC-2024-${timestamp}-${random}`;
}

function signLicense(data) {
    try {
        const keysDir = path.join(process.cwd(), '.keys');
        const privateKeyPath = path.join(keysDir, 'private.pem');

        if (!fs.existsSync(privateKeyPath)) {
            console.warn('⚠️  RSA私钥不存在，使用临时签名');
            return 'TEMP-' + crypto.randomBytes(32).toString('hex');
        }

        const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
        const { signature, ...dataWithoutSignature } = data;
        const dataString = JSON.stringify(dataWithoutSignature);

        const NodeRSA = require('node-rsa');
        const key = new NodeRSA(privateKey);
        return key.sign(dataString, 'base64');
    } catch (error) {
        console.error('签名错误:', error.message);
        return 'ERROR-' + crypto.randomBytes(32).toString('hex');
    }
}

// 运行测试
testActivationFlow();
