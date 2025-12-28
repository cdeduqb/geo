#!/usr/bin/env node

/**
 * HTML 结构重写测试脚本
 * 
 * 测试 AI 重写 API 的结构修改功能
 * 运行: node test-structure-rewrite.js
 */

const baseUrl = 'http://localhost:3000';

console.log('🧪 开始 HTML 结构重写测试...\n');

async function testStructureRewrite() {
    console.log('📝 测试: HTML 结构重写');
    console.log('----------------------------------------');

    const testCases = [
        {
            name: '列表转表格',
            body: {
                originalText: '<ul><li>苹果: 5元</li><li>香蕉: 3元</li><li>橙子: 4元</li></ul>',
                rewriteType: 'custom',
                customInstruction: '将列表转换为表格',
                mode: 'rewrite'
            }
        },
        {
            name: '添加样式',
            body: {
                originalText: '<p>这是一个警告信息</p>',
                rewriteType: 'custom',
                customInstruction: '添加红色警告样式',
                mode: 'rewrite'
            }
        },
        {
            name: '结构优化',
            body: {
                originalText: '<div>标题</div><div>内容</div>',
                rewriteType: 'improve',
                mode: 'rewrite'
            }
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n测试用例: ${testCase.name}`);
        console.log(`原文: "${testCase.body.originalText}"`);
        console.log(`指令: "${testCase.body.customInstruction || testCase.body.rewriteType}"`);

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
                console.log(`📄 重写结果: "${data.rewrittenText}"`);

                // 验证结构是否改变
                const originalHtml = testCase.body.originalText;
                const rewrittenHtml = data.rewrittenText;

                if (originalHtml !== rewrittenHtml) {
                    console.log('✨ 结构已修改: 是');

                    // 特殊检查
                    if (testCase.name === '列表转表格') {
                        if (rewrittenHtml.includes('<table') || rewrittenHtml.includes('<td')) {
                            console.log('✅ 成功转换为表格');
                        } else {
                            console.log('⚠️ 未检测到表格标签');
                        }
                    }
                } else {
                    console.log('⚠️ 结构未改变');
                }
            } else {
                console.log('❌ 状态: 失败');
                console.log(`错误: ${data.error}`);
            }
        } catch (error) {
            console.log('❌ 请求失败');
            console.log(`错误: ${error.message}`);
        }

        console.log('----------------------------------------');
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

// 执行测试
testStructureRewrite().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
});
