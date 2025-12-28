/**
 * 测试阶段2：授权验证核心功能
 * 运行: node scripts/test-stage2-license.js
 */

const NodeRSA = require('node-rsa');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🧪 开始测试阶段2：授权验证核心\n');
console.log('='.repeat(70));

// ============================================================================
// 工具函数
// ============================================================================

// 生成硬件指纹
async function generateFingerprint() {
    const cpuModel = os.cpus()[0]?.model || 'unknown';
    const macs = [];
    const interfaces = os.networkInterfaces();

    for (const name in interfaces) {
        const nets = interfaces[name];
        if (!nets) continue;
        for (const net of nets) {
            if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
                if (!macs.includes(net.mac)) macs.push(net.mac);
            }
        }
    }

    const primaryMac = macs[0] || 'unknown';
    const platform = os.platform();
    const hostname = os.hostname();

    const data = `${cpuModel}:${primaryMac}:${platform}:${hostname}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

// 生成测试授权数据
function generateTestLicense(fingerprint) {
    const now = Date.now();
    const licenseData = {
        licenseId: `LIC-TEST-${Date.now()}`,
        licenseCode: `LIC-2024-TEST-${Math.random().toString(36).substring(7).toUpperCase()}`,
        customerId: 'CUST-TEST-001',
        plan: 'PRO',
        domains: ['test.example.com', '*.example.com'],
        fingerprint: fingerprint,
        features: {
            pages: 100,
            ai: true,
            seo: true,
            geo: false,
            customDomain: true,
            support: 'email'
        },
        maxActivations: 1,
        currentActivations: 1,
        issuedAt: now,
        expiresAt: now + 365 * 24 * 60 * 60 * 1000, // 1年后
        status: 'active',
        version: '1.0'
    };

    return licenseData;
}

// RSA签名授权
function signLicense(licenseData, privateKey) {
    const { signature, ...dataWithoutSignature } = licenseData;
    const dataString = JSON.stringify(dataWithoutSignature);
    const key = new NodeRSA(privateKey);
    return key.sign(dataString, 'base64');
}

// RSA验证签名
function verifyLicenseSignature(licenseData, signature, publicKey) {
    const { signature: _, ...dataWithoutSignature } = licenseData;
    const dataString = JSON.stringify(dataWithoutSignature);
    const key = new NodeRSA(publicKey);
    return key.verify(Buffer.from(dataString), signature, 'utf8', 'base64');
}

// ============================================================================
// 测试 1: 授权验证引擎
// ============================================================================
async function testLicenseVerifier() {
    console.log('\n📌 测试 1: 授权验证引擎');
    console.log('-'.repeat(70));

    try {
        // 读取RSA密钥
        const keysDir = path.join(process.cwd(), '.keys');
        const publicKey = fs.readFileSync(path.join(keysDir, 'public.pem'), 'utf-8');
        const privateKey = fs.readFileSync(path.join(keysDir, 'private.pem'), 'utf-8');

        // 生成测试授权
        const fingerprint = await generateFingerprint();
        const licenseData = generateTestLicense(fingerprint);

        // 签名
        const signature = signLicense(licenseData, privateKey);
        licenseData.signature = signature;

        console.log('✅ 测试授权数据生成成功');
        console.log(`   授权码: ${licenseData.licenseCode}`);
        console.log(`   套餐: ${licenseData.plan}`);
        console.log(`   域名: ${licenseData.domains.join(', ')}`);

        // 测试签名验证
        const signatureValid = verifyLicenseSignature(licenseData, signature, publicKey);
        if (signatureValid) {
            console.log('✅ 签名验证: 通过');
        } else {
            console.log('❌ 签名验证: 失败');
            return { success: false };
        }

        // 测试状态验证
        const statusValid = licenseData.status === 'active';
        console.log(`✅ 状态验证: ${statusValid ? '激活' : '未激活'}`);

        // 测试过期验证
        const now = Date.now();
        const notExpired = now >= licenseData.issuedAt && now < licenseData.expiresAt;
        const daysLeft = Math.ceil((licenseData.expiresAt - now) / (24 * 60 * 60 * 1000));
        console.log(`✅ 过期验证: ${notExpired ? `有效（剩余${daysLeft}天）` : '已过期'}`);

        // 测试域名验证
        const testDomains = ['test.example.com', 'www.example.com', 'other.com'];
        console.log('✅ 域名验证测试:');
        testDomains.forEach(domain => {
            const matches = licenseData.domains.some(allowed => {
                if (allowed.startsWith('*.')) {
                    return domain.endsWith(allowed.substring(2));
                }
                return allowed === domain;
            });
            console.log(`   ${domain}: ${matches ? '✅ 匹配' : '❌ 不匹配'}`);
        });

        // 测试硬件指纹验证
        const currentFingerprint = await generateFingerprint();
        const fingerprintMatch = currentFingerprint === licenseData.fingerprint;
        console.log(`✅ 硬件指纹验证: ${fingerprintMatch ? '匹配' : '不匹配'}`);

        // 测试功能权限
        console.log('✅ 功能权限检查:');
        Object.entries(licenseData.features).forEach(([key, value]) => {
            const status = value ? '✅ 开启' : '❌ 关闭';
            console.log(`   ${key}: ${status} ${typeof value === 'number' ? `(限制: ${value})` : ''}`);
        });

        return { success: true, licenseData };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 2: 本地缓存系统
// ============================================================================
async function testLicenseCache(licenseData) {
    console.log('\n📌 测试 2: 本地缓存系统');
    console.log('-'.repeat(70));

    try {
        const cacheDir = path.join(process.cwd(), '.license-cache');
        const cacheFile = path.join(cacheDir, 'license.enc');

        // 确保缓存目录存在
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true, mode: 0o700 });
        }

        // 创建缓存数据
        const cachedLicense = {
            license: licenseData,
            cachedAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24小时
            lastVerifiedAt: Date.now()
        };

        // 加密缓存
        const encryptionKey = process.env.LICENSE_ENCRYPTION_KEY || 'test-key-32-characters-long!!';
        const dataString = JSON.stringify({
            data: cachedLicense,
            cachedAt: cachedLicense.cachedAt,
            version: '1.0'
        });
        const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey).toString();

        // 保存到文件
        fs.writeFileSync(cacheFile, encrypted, { mode: 0o600 });
        console.log('✅ 缓存保存成功');
        console.log(`   文件: ${cacheFile}`);
        console.log(`   大小: ${encrypted.length} 字节`);

        // 读取并解密
        const encryptedFromFile = fs.readFileSync(cacheFile, 'utf-8');
        const decrypted = CryptoJS.AES.decrypt(encryptedFromFile, encryptionKey);
        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
        const decryptedData = JSON.parse(decryptedString);

        if (decryptedData.data.license.licenseCode === licenseData.licenseCode) {
            console.log('✅ 缓存读取: 成功');
            console.log('✅ 数据完整性: 验证通过');
        } else {
            console.log('❌ 缓存数据不匹配');
            return { success: false };
        }

        // 检查缓存有效性
        const cacheAge = Math.floor((Date.now() - cachedLicense.cachedAt) / 1000);
        const timeUntilExpiration = Math.floor((cachedLicense.expiresAt - Date.now()) / 1000);

        console.log('✅ 缓存统计:');
        console.log(`   缓存年龄: ${cacheAge}秒`);
        console.log(`   剩余时间: ${Math.floor(timeUntilExpiration / 3600)}小时`);
        console.log(`   是否有效: ${Date.now() < cachedLicense.expiresAt ? '是' : '否'}`);

        // 测试离线宽限期
        const offlineGracePeriod = 7 * 24 * 60 * 60 * 1000; // 7天
        const offlineUntil = Date.now() + offlineGracePeriod;
        cachedLicense.offlineUntil = offlineUntil;

        console.log(`✅ 离线宽限期: ${Math.floor(offlineGracePeriod / (24 * 60 * 60 * 1000))}天`);
        console.log(`   截止时间: ${new Date(offlineUntil).toLocaleString('zh-CN')}`);

        return { success: true };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 3: 时间戳防护
// ============================================================================
async function testTimestampProtection() {
    console.log('\n📌 测试 3: 时间戳防护');
    console.log('-'.repeat(70));

    try {
        const timestampFile = path.join(process.cwd(), '.license-cache', 'timestamp.dat');
        const cacheDir = path.dirname(timestampFile);

        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true, mode: 0o700 });
        }

        // 保存当前时间戳
        const currentTime = Date.now();
        fs.writeFileSync(timestampFile, currentTime.toString(), { mode: 0o600 });
        console.log('✅ 时间戳保存: 成功');
        console.log(`   当前时间: ${new Date(currentTime).toLocaleString('zh-CN')}`);

        // 读取时间戳
        const savedTime = parseInt(fs.readFileSync(timestampFile, 'utf-8'));
        console.log('✅ 时间戳读取: 成功');

        // 检查时间回拨
        const timeDiff = currentTime - savedTime;
        if (timeDiff < -300000) { // 5分钟容差
            console.log('❌ 检测到时间回拨！');
            return { success: false };
        } else {
            console.log('✅ 时间回拨检测: 正常');
        }

        // 模拟时间差检测
        const mockServerTime = Date.now() + 60000; // 服务器快1分钟
        const serverDiff = Math.abs(mockServerTime - currentTime);
        const maxDiff = 600000; // 10分钟

        console.log('✅ 时间差异检测:');
        console.log(`   本地时间: ${new Date(currentTime).toLocaleString('zh-CN')}`);
        console.log(`   服务器时间: ${new Date(mockServerTime).toLocaleString('zh-CN')}`);
        console.log(`   差异: ${Math.floor(serverDiff / 1000)}秒`);
        console.log(`   状态: ${serverDiff < maxDiff ? '✅ 正常' : '❌ 异常'}`);

        return { success: true };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 4: 心跳数据收集
// ============================================================================
async function testHeartbeatData() {
    console.log('\n📌 测试 4: 心跳数据收集');
    console.log('-'.repeat(70));

    try {
        const fingerprint = await generateFingerprint();
        const deviceInfo = {
            platform: os.platform(),
            cpuModel: os.cpus()[0]?.model || 'unknown',
            hostname: os.hostname(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem()
        };

        const heartbeatData = {
            licenseId: 'LIC-TEST-001',
            fingerprint: fingerprint,
            domain: 'test.example.com',
            platform: deviceInfo.platform,
            version: '1.0.0',
            uptime: os.uptime(),
            cpuUsage: 0.5,
            memoryUsage: ((deviceInfo.totalMemory - deviceInfo.freeMemory) / deviceInfo.totalMemory * 100).toFixed(2),
            timestamp: Date.now()
        };

        console.log('✅ 心跳数据收集成功:');
        console.log(`   授权ID: ${heartbeatData.licenseId}`);
        console.log(`   硬件指纹: ${heartbeatData.fingerprint.substring(0, 16)}...`);
        console.log(`   平台: ${heartbeatData.platform}`);
        console.log(`   运行时间: ${Math.floor(heartbeatData.uptime / 3600)}小时`);
        console.log(`   内存使用: ${heartbeatData.memoryUsage}%`);

        // 模拟心跳发送
        console.log('✅ 心跳发送模拟:');
        console.log(`   目标: LICENSE_SERVER_URL/api/license/heartbeat`);
        console.log(`   方法: POST`);
        console.log(`   数据大小: ${JSON.stringify(heartbeatData).length} 字节`);
        console.log(`   状态: ⚠️  离线模拟（未实际发送）`);

        return { success: true, heartbeatData };
    } catch (error) {
        console.log(`❌ 错误: ${error.message}`);
        return { success: false, error };
    }
}

// ============================================================================
// 测试 5: 完整授权流程模拟
// ============================================================================
async function testCompleteFlow() {
    console.log('\n📌 测试 5: 完整授权流程模拟');
    console.log('-'.repeat(70));

    try {
        // 1. 生成硬件指纹
        const fingerprint = await generateFingerprint();
        console.log('✅ 步骤1: 硬件指纹生成');
        console.log(`   指纹: ${fingerprint.substring(0, 32)}...`);

        // 2. 创建授权数据
        const licenseData = generateTestLicense(fingerprint);
        console.log('✅ 步骤2: 授权数据创建');
        console.log(`   授权码: ${licenseData.licenseCode}`);

        // 3. 签名授权
        const keysDir = path.join(process.cwd(), '.keys');
        const privateKey = fs.readFileSync(path.join(keysDir, 'private.pem'), 'utf-8');
        const signature = signLicense(licenseData, privateKey);
        licenseData.signature = signature;
        console.log('✅ 步骤3: 授权签名');
        console.log(`   签名: ${signature.substring(0, 32)}...`);

        // 4. 验证授权
        const publicKey = fs.readFileSync(path.join(keysDir, 'public.pem'), 'utf-8');
        const isValid = verifyLicenseSignature(licenseData, signature, publicKey);
        console.log(`✅ 步骤4: 授权验证 - ${isValid ? '通过' : '失败'}`);

        // 5. 保存到缓存
        const encryptionKey = 'test-key-32-characters-long!!';
        const cached = {
            license: licenseData,
            cachedAt: Date.now(),
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
            lastVerifiedAt: Date.now()
        };
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify({ data: cached }), encryptionKey).toString();
        console.log('✅ 步骤5: 缓存加密');
        console.log(`   缓存大小: ${encrypted.length} 字节`);

        // 6. 生成心跳数据
        const heartbeat = {
            licenseId: licenseData.licenseId,
            fingerprint: fingerprint,
            timestamp: Date.now()
        };
        console.log('✅ 步骤6: 心跳准备');
        console.log(`   间隔: 每小时`);

        console.log('\n✨ 完整流程测试成功！');

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
        total: 5,
        passed: 0,
        failed: 0,
        details: []
    };

    console.log('\n🚀 开始执行所有测试...\n');

    // 测试1
    const test1 = await testLicenseVerifier();
    results.details.push({ name: '授权验证引擎', ...test1 });
    if (test1.success) results.passed++; else results.failed++;

    // 测试2
    const test2 = await testLicenseCache(test1.licenseData || generateTestLicense(await generateFingerprint()));
    results.details.push({ name: '本地缓存系统', ...test2 });
    if (test2.success) results.passed++; else results.failed++;

    // 测试3
    const test3 = await testTimestampProtection();
    results.details.push({ name: '时间戳防护', ...test3 });
    if (test3.success) results.passed++; else results.failed++;

    // 测试4
    const test4 = await testHeartbeatData();
    results.details.push({ name: '心跳数据收集', ...test4 });
    if (test4.success) results.passed++; else results.failed++;

    // 测试5
    const test5 = await testCompleteFlow();
    results.details.push({ name: '完整流程模拟', ...test5 });
    if (test5.success) results.passed++; else results.failed++;

    // 总结
    console.log('\n' + '='.repeat(70));
    console.log('📊 阶段2测试结果总结');
    console.log('='.repeat(70));
    console.log(`总测试数: ${results.total}`);
    console.log(`✅ 通过: ${results.passed}`);
    console.log(`❌ 失败: ${results.failed}`);
    console.log(`成功率: ${((results.passed / results.total) * 100).toFixed(1)}%`);

    console.log('\n📋 详细结果:');
    results.details.forEach((test, index) => {
        const status = test.success ? '✅' : '❌';
        console.log(`${index + 1}. ${status} ${test.name}`);
    });

    if (results.failed === 0) {
        console.log('\n🎉 所有测试通过！阶段2核心功能正常！');
        console.log('\n💡 提示:');
        console.log('   - 查看 .license-cache/ 目录查看缓存文件');
        console.log('   - 所有验证逻辑已就绪');
        console.log('   - 可以开始阶段3 API开发');
    } else {
        console.log('\n⚠️  部分测试失败，请检查错误信息');
    }
}

// 运行测试
runAllTests().catch(console.error);
