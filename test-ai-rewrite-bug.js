const puppeteer = require('puppeteer');

(async () => {
    console.log('🚀 启动自动化测试：AI 重写功能');
    console.log('================================\n');

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        defaultViewport: { width: 1800, height: 1000 }
    });

    const page = await browser.newPage();

    // Bypass Login
    const adminId = 'cmigqk57t0000ftprs67m5g1q';
    const sessionToken = `${adminId}:dummy_token_for_test`;
    await page.setCookie({
        name: 'session',
        value: sessionToken,
        domain: 'localhost',
        path: '/',
        httpOnly: true
    });

    // Capture logs - but minimal output
    page.on('pageerror', err => console.log('⚠️  页面错误:', err.toString()));

    try {
        // 1. Navigate to pages
        console.log('步骤 1: 导航到页面管理');
        await page.goto('http://localhost:3000/admin/pages', { waitUntil: 'networkidle0' });

        const builderLink = await page.$('a[href*="/admin/pages/builder/"]');

        if (!builderLink) {
            throw new Error('未找到可编辑的可视化页面');
        }

        console.log('步骤 2: 进入可视化编辑器');
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            builderLink.click()
        ]);

        await new Promise(r => setTimeout(r, 3000)); // Wait for full load

        // 2. Look for "属性编辑" panel to ensure we're in the right place
        console.log('步骤 3: 验证编辑器已加载');
        const propertiesPanel = await page.evaluate(() => {
            const h2s = Array.from(document.querySelectorAll('h2'));
            return h2s.find(h => h.textContent && h.textContent.includes('属性编辑'));
        });
        if (!propertiesPanel) {
            throw new Error('未找到属性编辑面板');
        }

        // 3. Click specifically on a rich text section
        console.log('步骤 4: 查找并选中富文本区块');

        // First, try to find if there's any existing section
        const hasSections = await page.evaluate(() => {
            return document.querySelectorAll('[class*="border-2"]').length > 0;
        });

        if (!hasSections) {
            console.log('  → 未找到区块，尝试添加富文本组件...');
            // Find and click the rich text component button
            await page.evaluate(() => {
                const spans = Array.from(document.querySelectorAll('span'));
                const richTextSpan = spans.find(s => s.textContent && s.textContent.includes('富文本内容'));
                if (richTextSpan) {
                    const button = richTextSpan.closest('button');
                    if (button) button.click();
                }
            });
            await new Promise(r => setTimeout(r, 2000));
        }

        // Click on the first section
        const clicked = await page.evaluate(() => {
            const sections = Array.from(document.querySelectorAll('[class*="border-2"][class*="transition"]'));
            if (sections.length > 0) {
                sections[0].click();
                return true;
            }
            return false;
        });

        if (!clicked) {
            throw new Error('无法点击区块');
        }

        console.log('  ✓ 区块已选中');
        await new Promise(r => setTimeout(r, 1500));

        // 4. Verify properties panel now shows "富文本内容"
        console.log('步骤 5: 验证属性面板显示富文本编辑器');
        const panelHasRichText = await page.evaluate(() => {
            const panel = document.querySelector('.w-80'); // Properties panel
            return panel && panel.textContent.includes('富文本内容');
        });

        if (!panelHasRichText) {
            console.log('⚠️  警告：属性面板未显示"富文本内容"');
            console.log('  可能选中了其他类型的区块。让我们尝试手动查找富文本区块...');

            // Try clicking different sections until we find rich-text
            const foundRichText = await page.evaluate(() => {
                const sections = Array.from(document.querySelectorAll('[class*="border-2"]'));
                for (const section of sections) {
                    section.click();
                    // Give it时间to update
                    const panel = document.querySelector('.w-80');
                    if (panel && panel.textContent.includes('富文本内容')) {
                        return true;
                    }
                }
                return false;
            });

            if (!foundRichText) {
                throw new Error('未找到富文本区块。请手动添加一个富文本内容区块后重试。');
            }
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log('  ✓ 富文本属性面板已显示');

        // 5. Find the editor
        console.log('步骤 6: 定位 RichTextEditor');
        await page.waitForSelector('[contenteditable="true"]', { timeout: 5000 });
        const editor = await page.$('[contenteditable="true"]');

        if (!editor) {
            throw new Error('未找到编辑器');
        }
        console.log('  ✓ 编辑器已找到');

        // 6. Input test text
        console.log('步骤 7: 输入测试文本');
        await page.evaluate((el) => {
            el.innerHTML = '<p><strong>原始</strong>测试文本</p>';
            el.focus();
        }, editor);

        const initialContent = await page.evaluate(el => el.innerHTML, editor);
        console.log('  初始内容:', initialContent);
        await new Promise(r => setTimeout(r, 500));

        // 7. Select text
        console.log('步骤 8: 选中文本以触发 AI 按钮');
        await page.evaluate((el) => {
            const range = document.createRange();
            range.selectNodeContents(el);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            document.dispatchEvent(new Event('selectionchange'));
        }, editor);

        await new Promise(r => setTimeout(r, 2000));

        // 8. Find AI button
        console.log('步骤 9: 查找 AI 重写按钮');
        const buttons = await page.$$('button');
        let aiButton = null;

        for (const btn of buttons) {
            const text = await page.evaluate(el => el.textContent, btn);
            if (text && text.includes('AI') && text.includes('重写')) {
                aiButton = btn;
                break;
            }
        }

        if (!aiButton) {
            throw new Error('未找到 AI 重写按钮（可能文本未被正确选中）');
        }
        console.log('  ✓ AI 重写按钮已找到');

        // 9. Click AI button
        console.log('步骤 10: 打开 AI 重写面板');
        await aiButton.click();
        await new Promise(r => setTimeout(r, 1500));

        const panelOpened = await page.evaluate(() => {
            return document.body.textContent.includes('AI 辅助重写');
        });

        if (!panelOpened) {
            throw new Error('AI 重写面板未打开');
        }
        console.log('  ✓ AI 面板已打开');

        // 10. Setup API interception
        console.log('步骤 11: 配置 API 拦截');
        await page.setRequestInterception(true);

        let intercepted = false;
        page.on('request', request => {
            if (request.url().includes('/api/ai/rewrite') && !intercepted) {
                intercepted = true;
                console.log('  → 拦截 AI API，返回模拟数据');
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        rewrittenText: '<p><em>重写后的</em>测试内容</p>',
                        rewriteType: 'general',
                        mode: 'preserve'
                    })
                });
            } else {
                request.continue();
            }
        });

        // 11. Click start rewrite
        console.log('步骤 12: 点击"开始重写"');
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const startBtn = btns.find(b => b.textContent && b.textContent.includes('开始重写'));
            if (startBtn) startBtn.click();
        });

        await new Promise(r => setTimeout(r, 3000));

        // 12. Verify result
        const resultShown = await page.evaluate(() => {
            return document.body.textContent.includes('AI 重写结果');
        });

        if (resultShown) {
            console.log('  ✓ AI 重写结果已显示');
        } else {
            console.log('  ⚠️  未找到 "AI 重写结果"');
        }

        // 13. Click accept
        console.log('\n步骤 13: 测试替换功能');
        console.log('  替换前:', initialContent);

        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const acceptBtn = btns.find(b => b.textContent && b.textContent.includes('接受并替换'));
            if (acceptBtn) acceptBtn.click();
        });

        await new Promise(r => setTimeout(r, 2500));

        // 14. Check result
        const contentAfter = await page.evaluate((el) => el.innerHTML, editor);
        console.log('  替换后:', contentAfter);

        // Final verdict
        console.log('\n================================');
        console.log('测试结果');
        console.log('================================');

        if (!contentAfter || contentAfter.trim() === '' || contentAfter === '<br>') {
            console.log('❌ BUG 已复现：AI 重写后内容消失');
            console.log('\n原因分析：');
            console.log('  onAccept 回调可能没有正确更新编辑器内容');
            console.log('  或者内容被错误地设置为空值');
            process.exit(1);
        } else if (contentAfter.includes('重写后的')) {
            console.log('✅ 测试通过：内容正确替换');
            console.log('  新内容:', contentAfter);
        } else {
            console.log('⚠️  部分成功：内容存在但未完全匹配');
            console.log('  实际内容:', contentAfter);
            console.log('  预期包含: "重写后的"');
        }

        console.log('\n浏览器将在 5 秒后关闭...');
        await new Promise(r => setTimeout(r, 5000));

    } catch (e) {
        console.error('\n================================');
        console.error('❌ 测试失败');
        console.error('================================');
        console.error('错误:', e.message);
        console.error('\n浏览器将保持打开 60 秒以便调试...');
        await new Promise(r => setTimeout(r, 60000));
    } finally {
        await browser.close();
    }
})();
