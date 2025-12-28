/**
 * 生成 RSA 密钥对用于授权系统
 */
const NodeRSA = require('node-rsa');
const fs = require('fs');
const path = require('path');

console.log('🔐 生成 RSA-2048 密钥对...\n');

try {
    const keysDir = path.join(process.cwd(), '.keys');

    // 创建密钥目录
    if (!fs.existsSync(keysDir)) {
        fs.mkdirSync(keysDir, { recursive: true });
    }

    // 生成密钥对
    const key = new NodeRSA({ b: 2048 });
    const publicKey = key.exportKey('public');
    const privateKey = key.exportKey('private');

    // 保存密钥
    fs.writeFileSync(
        path.join(keysDir, 'public.pem'),
        publicKey,
        { mode: 0o600 }
    );

    fs.writeFileSync(
        path.join(keysDir, 'private.pem'),
        privateKey,
        { mode: 0o600 }
    );

    console.log('✅ 密钥对已生成并保存到 .keys/ 目录\n');

    // 显示公钥（用于客户端）
    console.log('📋 公钥（添加到客户端代码）：');
    console.log('─'.repeat(60));
    console.log(publicKey);
    console.log('─'.repeat(60));
    console.log('\n');

    // 保存到环境变量示例
    const envExample = `# 授权系统 RSA 公钥（客户端使用）
LICENSE_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"

# 授权系统 RSA 私钥（服务端使用，保密！）
LICENSE_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"
`;

    fs.writeFileSync(
        path.join(keysDir, 'env-keys.txt'),
        envExample
    );

    console.log('💾 密钥已保存到 .keys/env-keys.txt');
    console.log('⚠️  警告：私钥必须保密，不要提交到代码库！');
    console.log('\n');

    // 测试签名
    console.log('🧪 测试签名功能...');
    const testData = JSON.stringify({
        licenseId: 'TEST-LICENSE-001',
        plan: 'ENTERPRISE',
        expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000
    });

    const signature = key.sign(testData, 'base64');
    const verifyKey = new NodeRSA(publicKey);
    const isValid = verifyKey.verify(Buffer.from(testData), signature, 'utf8', 'base64');

    console.log(`签名验证: ${isValid ? '✅ 成功' : '❌ 失败'}\n`);

    if (isValid) {
        console.log('✅ RSA 密钥对生成并验证成功！');
        console.log('\n下一步：');
        console.log('1. 检查 .keys/ 目录');
        console.log('2. 将 .keys/env-keys.txt 中的内容添加到 .env 文件');
        console.log('3. 确保 .keys/ 目录不会被提交到git');
    } else {
        console.log('❌ 签名验证失败，请检查');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ 生成密钥对失败:', error);
    process.exit(1);
}
