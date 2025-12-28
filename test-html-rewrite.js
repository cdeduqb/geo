#!/usr/bin/env node

/**
 * HTML 重写功能测试脚本
 * 
 * 测试 AI 重写 API 的 HTML 保留功能
 * 运行: node test-html-rewrite.js
 */

const baseUrl = 'http://localhost:3000';

console.log('🧪 开始 HTML 重写功能测试...\n');

async function testHtmlRewrite() {
    console.log('📝 测试: 保留 HTML 格式');
    console.log('----------------------------------------');

    const testCases = [
        {
            name: '简单格式保留',
            body: {
                originalText: '这是<strong>重要</strong>通知',
                rewriteType: 'improve',
                preserveHtml: true
            }
        },
        {
            name: '链接保留',
            body: {
                originalText: '请访问<a href="https://example.com">官方网站</a>获取更多信息',
                rewriteType: 'expand',
                preserveHtml: true
            }
        },
        {
            name: '颜色样式保留',
            body: {
                originalText: '<span style="color: red;">警告:</span> 操作不可逆',
                rewriteType: 'formal',
                preserveHtml: true
            }
        },
        {
            name: '混合格式',
            body: {
                originalText: '<strong>注意:</strong> 请点击<a href="#">这里</a>查看<span style="color: blue;">详细说明</span>',
                rewriteType: 'improve',
                preserveHtml: true
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
                console.log(`📄 重写结果: "${data.rewrittenText}"`);

                // 验证格式是否保留
                const originalHtml = testCase.body.originalText;
                const rewrittenHtml = data.rewrittenText;

                // 简单检查标签是否存在
                const tags = originalHtml.match(/<[^>]+>/g) || [];
                const missingTags = tags.filter(tag => !rewrittenHtml.includes(tag));

                if (missingTags.length === 0) {
                    console.log('✨ 格式保留验证: 通过');
                } else {
                    console.log('⚠️ 格式保留验证: 失败');
                    console.log('丢失的标签:', missingTags);
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
testHtmlRewrite().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
});
