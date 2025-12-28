/**
 * 测试授权系统核心功能
 * 运行: node scripts/test-license-system.js
 */

const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const os = require('os');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('🧪 开始测试 GeoCMS 授权系统\n');
console.log('='.repeat(60));

// ============================================================================
// 测试 1: 硬件指纹生成
// ============================================================================
async function testFingerprint() {
    console.log('\n📌 测试 1: 硬件指纹生成');
    console.log('-'.repeat(60));

    try {
        // CPU 信息
        const cpus = os.cpus();
        const cpuModel = cpus.length > 0 ? cpus[0].model : 'unknown';
        console.log(`✅ CPU: ${cpuModel} (${cpus.length} 核心)`);

        // 网络信息
        const interfaces = os.networkInterfaces();
        const macs = [];
        for (const name in interfaces) {
            const nets = interfaces[name];
            if (!nets) continue;
            for (const net of nets) {
                if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
                    if (!macs.includes(net.mac)) {
                        macs.push(net.mac);
                    }
                }
            }
        }
        const primaryMac = macs.length > 0 ? macs[0] : 'unknown';
        console.log(`✅ MAC 地址: ${primaryMac}`);

        // 系统信息
        const platform = os.platform();
        const hostname = os.hostname();
        console.log(`✅ 系统: ${platform}`);
        console.log(`✅ 主机名: ${hostname}`);

        // 生成指纹
        const fingerprintData = `${cpuModel}:${primaryMac}:${platform}:${hostname}`;
        const fingerprint = crypto.createHash('sha256').update(fingerprintData).digest('hex');

        console.log(`✅ 硬件指纹: ${fingerprint.substring(0, 32)}...`);
        console.log(`✅ 短指纹: ${fingerprint.substring(0, 12)}`);

        return { success: true, fingerprint };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 2: RSA 加密和签名
// ============================================================================
async function testRSA() {
    console.log('\n📌 测试 2: RSA 加密和签名');
    console.log('-'.repeat(60));

    try {
        // 检查密钥是否存在
        const keysDir = path.join(process.cwd(), '.keys');
        const publicKeyPath = path.join(keysDir, 'public.pem');
        const privateKeyPath = path.join(keysDir, 'private.pem');

        if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
            console.log('⚠️  密钥不存在，生成新密钥...');
            const key = new NodeRSA({ b: 2048 });
            const publicKey = key.exportKey('public');
            const privateKey = key.exportKey('private');

            if (!fs.existsSync(keysDir)) {
                fs.mkdirSync(keysDir, { recursive: true });
            }

            fs.writeFileSync(publicKeyPath, publicKey);
            fs.writeFileSync(privateKeyPath, privateKey);
            console.log('✅ 新密钥已生成');
        }

        // 读取密钥
        const publicKey = fs.readFileSync(publicKeyPath, 'utf-8');
        const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
        console.log('✅ 密钥加载成功');

        // 测试签名
        const licenseData = {
            licenseId: 'TEST-2024-001',
            customerId: 'CUST-001',
            plan: 'ENTERPRISE',
            domains: ['example.com'],
            issuedAt: Date.now(),
            expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
            features: { pages: true, ai: true, seo: true }
        };

        const dataString = JSON.stringify(licenseData);
        const key = new NodeRSA(privateKey);
        const signature = key.sign(dataString, 'base64');

        console.log('✅ 授权数据签名成功');
        console.log(`   签名长度: ${signature.length} 字符`);

        // 验证签名
        const verifyKey = new NodeRSA(publicKey);
        const isValid = verifyKey.verify(Buffer.from(dataString), signature, 'utf8', 'base64');

        if (isValid) {
            console.log('✅ 签名验证: 通过');
        } else {
            console.log('❌ 签名验证: 失败');
            return { success: false };
        }

        // 测试加密解密
        const testMessage = "这是一个测试消息";
        const encrypted = verifyKey.encrypt(testMessage, 'base64');
        console.log('✅ 数据加密成功');

        const decrypted = key.decrypt(encrypted, 'utf8');
        if (decrypted === testMessage) {
            console.log('✅ 数据解密: 通过');
        } else {
            console.log('❌ 数据解密: 失败');
            return { success: false };
        }

        return { success: true, licenseData, signature };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 3: AES 加密
// ============================================================================
async function testAES() {
    console.log('\n📌 测试 3: AES 加密');
    console.log('-'.repeat(60));

    try {
        const encryptionKey = 'test-encryption-key-32-chars!!';

        // 测试对象加密
        const cacheData = {
            licenseId: 'TEST-001',
            fingerprint: 'abc123',
            expiresAt: Date.now() + 86400000,
            cachedAt: Date.now()
        };

        const dataString = JSON.stringify(cacheData);
        const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey).toString();
        console.log('✅ 缓存数据加密成功');
        console.log(`   加密后长度: ${encrypted.length} 字符`);

        // 解密
        const decrypted = CryptoJS.AES.decrypt(encrypted, encryptionKey);
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decryptedString);

        if (decryptedData.licenseId === cacheData.licenseId) {
            console.log('✅ 缓存数据解密: 通过');
        } else {
            console.log('❌ 缓存数据解密: 失败');
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 4: SHA-256 哈希
// ============================================================================
async function testHash() {
    console.log('\n📌 测试 4: SHA-256 哈希');
    console.log('-'.repeat(60));

    try {
        const testData = "GeoCMS License System";

        // SHA-256
        const hash = CryptoJS.SHA256(testData).toString();
        console.log('✅ SHA-256 哈希: 成功');
        console.log(`   哈希值: ${hash.substring(0, 32)}...`);

        // 时间戳哈希（防重放）
        const timestamp = Date.now();
        const combined = `${testData}|${timestamp}`;
        const timestampedHash = CryptoJS.SHA256(combined).toString();
        console.log('✅ 时间戳哈希: 成功');

        // 验证
        const recomputed = CryptoJS.SHA256(combined).toString();
        if (recomputed === timestampedHash) {
            console.log('✅ 哈希验证: 通过');
        } else {
            console.log('❌ 哈希验证: 失败');
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 5: 数据库连接
// ============================================================================
async function testDatabase() {
    console.log('\n📌 测试 5: 数据库连接');
    console.log('-'.repeat(60));

    try {
        const { PrismaClient: LicenseClient } = require('@prisma/client-license');
        const licenseDb = new LicenseClient();

        // 测试连接
        await licenseDb.$connect();
        console.log('✅ 授权数据库连接: 成功');

        // 查询表数量
        const tables = ['customers', 'licenses', 'license_instances', 'orders'];
        for (const table of tables) {
            try {
                const count = await licenseDb[table].count();
                console.log(`✅ 表 ${table}: ${count} 条记录`);
            } catch (err) {
                console.log(`⚠️  表 ${table}: 暂无数据`);
            }
        }

        await licenseDb.$disconnect();
        return { success: true };
    } catch (error) {
        console.log(`❌ 数据库连接失败: ${error.message}`);
        console.log('   提示: 确保已运行 npx prisma generate --schema=prisma/schema.license.prisma');
        return { success: false, error };
    }
}

// ============================================================================
// 测试 6: 完整授权流程模拟
// ============================================================================
async function testLicenseFlow() {
    console.log('\n📌 测试 6: 完整授权流程模拟');
    console.log('-'.repeat(60));

    try {
        // 1. 生成硬件指纹
        const fingerprintResult = await testFingerprint();
        if (!fingerprintResult.success) return { success: false };

        // 2. 创建授权数据
        const licenseData = {
            licenseCode: `LIC-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
            customerId: 'TEST-CUSTOMER',
            plan: 'PRO',
            domains: ['test.example.com'],
            fingerprint: fingerprintResult.fingerprint,
            features: { pages: 100, ai: true, seo: true },
            issuedAt: new Date(),
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        };

        console.log('✅ 授权数据创建成功');
        console.log(`   授权码: ${licenseData.licenseCode}`);
        console.log(`   套餐: ${licenseData.plan}`);
        console.log(`   域名: ${licenseData.domains.join(', ')}`);

        // 3. 签名授权
        const keysDir = path.join(process.cwd(), '.keys');
        const privateKeyPath = path.join(keysDir, 'private.pem');

        if (fs.existsSync(privateKeyPath)) {
            const privateKey = fs.readFileSync(privateKeyPath, 'utf-8');
            const key = new NodeRSA(privateKey);
            const dataString = JSON.stringify(licenseData);
            const signature = key.sign(dataString, 'base64');

            console.log('✅ 授权签名成功');
            console.log(`   签名: ${signature.substring(0, 32)}...`);

            // 4. 加密缓存
            const encryptionKey = 'test-key-32-characters-long!!';
            const cacheData = { ...licenseData, signature, cachedAt: Date.now() };
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(cacheData), encryptionKey).toString();

            console.log('✅ 缓存加密成功');
            console.log(`   缓存大小: ${encrypted.length} 字节`);
        }

        return { success: true, licenseData };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 执行所有测试
// ============================================================================
async function runAllTests() {
    const results = {
        total: 6,
        passed: 0,
        failed: 0
    };

    console.log('\n🚀 开始执行所有测试...\n');

    const tests = [
        { name: '硬件指纹生成', fn: testFingerprint },
        { name: 'RSA 加密签名', fn: testRSA },
        { name: 'AES 加密', fn: testAES },
        { name: 'SHA-256 哈希', fn: testHash },
        { name: '数据库连接', fn: testDatabase },
        { name: '授权流程模拟', fn: testLicenseFlow }
    ];

    for (const test of tests) {
        const result = await test.fn();
        if (result.success) {
            results.passed++;
        } else {
            results.failed++;
        }
    }

    // 总结
    console.log('\n' + '='.repeat(60));
    console.log('📊 测试结果总结');
    console.log('='.repeat(60));
    console.log(`总测试数: ${results.total}`);
    console.log(`✅ 通过: ${results.passed}`);
    console.log(`❌ 失败: ${results.failed}`);
    console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    if (results.failed === 0) {
        console.log('\n🎉 所有测试通过！授权系统核心功能正常！');
    } else {
        console.log('\n⚠️  部分测试失败，请检查错误信息');
    }

    console.log('\n💡 提示:');
    console.log('   - 查看 .keys/ 目录查看RSA密钥');
    console.log('   - 运行 npx prisma studio --schema=prisma/schema.license.prisma 查看数据库');
    console.log('   - 查看 LICENSE_PROGRESS.md 了解下一步开发计划');
}

// 运行测试
runAllTests().catch(console.error);
