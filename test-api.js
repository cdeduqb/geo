#!/usr/bin/env node

/**
 * API 功能测试脚本
 * 
 * 测试 AI 重写 API 的基本功能
 * 运行: node test-api.js
 */

const baseUrl = 'http://localhost:3000';

console.log('🧪 开始 API 功能测试...\n');

// 测试 AI 重写 API
async function testAIRewriteAPI() {
    console.log('📝 测试 1: AI 重写 API');
    console.log('----------------------------------------');

    try {
        const testCases = [
            {
                name: '改进表达',
                body: {
                    originalText: '这个功能很好用',
                    rewriteType: 'improve'
                }
            },
            {
                name: '扩展内容',
                body: {
                    originalText: 'AI 可以帮助写作',
                    rewriteType: 'expand'
                }
            },
            {
                name: '精简内容',
                body: {
                    originalText: '在现代社会中,随着科技的快速发展和广泛应用,人工智能技术已经成为了一个非常重要的话题',
                    rewriteType: 'shorten'
                }
            },
            {
                name: '自定义重写',
                body: {
                    originalText: '产品质量很好',
                    rewriteType: 'custom',
                    customInstruction: '请改写成营销文案风格'
                }
            }
        ];

        for (const testCase of testCases) {
            console.log(`\n测试用例: ${testCase.name}`);
            console.log(`原文: "${testCase.body.originalText}"`);

            try {
                const response = await fetch(`${baseUrl}/api/ai/rewrite`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(testCase.body)
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('✅ 状态: 成功');
                    console.log(`📄 重写结果: "${data.rewrittenText.substring(0, 100)}${data.rewrittenText.length > 100 ? '...' : ''}"`);
                } else {
                    console.log('❌ 状态: 失败');
                    console.log(`错误: ${data.error}`);

                    if (data.error && data.error.includes('AI')) {
                        console.log('\n💡 提示: 请确保在"系统设置 → AI 配置"中已配置并激活了 AI 模型');
                    }
                }
            } catch (error) {
                console.log('❌ 请求失败');
                console.log(`错误: ${error.message}`);
            }

            console.log('----------------------------------------');

            // 等待一下,避免请求过快
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    } catch (error) {
        console.log('❌ 测试失败:', error.message);
    }
}

// 测试服务器连接
async function testServerConnection() {
    console.log('🔗 测试 0: 服务器连接');
    console.log('----------------------------------------');

    try {
        const response = await fetch(`${baseUrl}/admin/templates`);

        if (response.ok) {
            console.log('✅ 服务器正常运行');
            console.log(`状态码: ${response.status}`);
        } else {
            console.log('⚠️ 服务器响应异常');
            console.log(`状态码: ${response.status}`);
        }
    } catch (error) {
        console.log('❌ 无法连接到服务器');
        console.log(`错误: ${error.message}`);
        console.log('\n💡 请确保开发服务器正在运行: npm run dev');
        process.exit(1);
    }

    console.log('----------------------------------------\n');
}

// 测试选区相关功能(需要在浏览器中测试,这里只验证API)
async function testSelectionApis() {
    console.log('📝 测试 2: 选区相关 API (模拟)');
    console.log('----------------------------------------');
    console.log('ℹ️  选区保存/恢复功能需要在浏览器中测试');
    console.log('请参考手动测试指南进行验证');
    console.log('----------------------------------------\n');
}

// 运行所有测试
async function runTests() {
    await testServerConnection();
    await testSelectionApis();
    await testAIRewriteAPI();

    console.log('\n✨ 测试完成!\n');
    console.log('📌 注意事项:');
    console.log('  1. AI 重写功能需要系统配置了 AI 模型才能正常工作');
    console.log('  2. 选区保存/恢复功能需要在浏览器中手动测试');
    console.log('  3. 完整的 UI 测试请参考 manual_test_guide.md\n');
}

// 执行测试
runTests().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
});
