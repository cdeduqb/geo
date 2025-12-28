
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    // 1. Bypass Login
    const adminId = 'cmigqk57t0000ftprs67m5g1q';
    const sessionToken = `${adminId}:dummy_token_for_test`;
    await page.setCookie({
        name: 'session',
        value: sessionToken,
        domain: 'localhost',
        path: '/',
        httpOnly: true
    });

    // Capture logs
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));

    try {
        // 2. Navigate to Visual Editor
        console.log('Navigating to templates page...');
        await page.goto('http://localhost:3000/admin/templates', { waitUntil: 'networkidle0' });

        console.log('Clicking first visual edit button...');
        // Find the first "可视化编辑" link by title
        let editLink = await page.$('a[title="可视化编辑"]');

        if (!editLink) {
            console.log('Visual edit link not found, trying to create a new template...');
            // Create a new template if not found
            await page.goto('http://localhost:3000/admin/templates/create', { waitUntil: 'networkidle0' });

            await page.type('input[name="name"]', 'Auto Test Template ' + Date.now());
            await page.type('textarea[name="description"]', 'Created by automated test');

            // Select "Visual Builder" (assuming it's a radio or button)
            // We need to check the create page structure, but let's assume defaults or simple selection
            // If the create page is complex, this might fail. 
            // Let's just try to find the link again after a simple wait, maybe the page wasn't fully loaded?
            // Or better, just fail with a clear message if not found, and I will manually create one or check the page.
            throw new Error('Visual edit link not found. Please ensure at least one visual template exists.');
        }

        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
            editLink.click()
        ]);

        console.log('Waiting for editor to load...');
        const iframeElement = await page.waitForSelector('iframe#template-frame', { timeout: 30000 });
        const frame = await iframeElement.contentFrame();

        // 3. Ensure Rich Text Section exists
        console.log('Checking for Rich Text section...');
        await new Promise(r => setTimeout(r, 2000)); // Wait for frame content

        const richTextBtnHandle = await frame.evaluateHandle(() => {
            const spans = Array.from(document.querySelectorAll('span'));
            return spans.find(s => s.textContent.includes('富文本内容'));
        });

        if (richTextBtnHandle.asElement()) {
            console.log('Found Rich Text component in library. Clicking to add...');
            await frame.evaluate((span) => {
                span.parentElement.parentElement.click();
            }, richTextBtnHandle);
            await new Promise(r => setTimeout(r, 1000));
        }

        // 4. Select Rich Text Editor
        console.log('Selecting Rich Text section...');
        // Click on the section in the canvas (assuming it's the last one added)
        await frame.evaluate(() => {
            const sections = document.querySelectorAll('[data-section-id]');
            if (sections.length > 0) {
                const lastSection = sections[sections.length - 1];
                lastSection.click();
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        // 5. Input Text
        console.log('Inputting text into editor...');
        const editorSelector = '.prose[contenteditable="true"]';
        await page.waitForSelector(editorSelector);

        await page.evaluate((selector) => {
            const editor = document.querySelector(selector);
            editor.innerHTML = '<p>Original Content for Testing</p>';
            editor.focus();
        }, editorSelector);

        // 6. Select Text to trigger AI button
        console.log('Selecting text...');
        await page.evaluate((selector) => {
            const editor = document.querySelector(selector);
            const range = document.createRange();
            range.selectNodeContents(editor);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            // Trigger selectionchange
            document.dispatchEvent(new Event('selectionchange'));
        }, editorSelector);

        await new Promise(r => setTimeout(r, 1000));

        // 7. Click AI Rewrite Button
        console.log('Clicking AI Rewrite button...');
        const aiBtnSelector = 'button.bg-blue-600.rounded-full'; // Based on recent style change
        await page.waitForSelector(aiBtnSelector);
        await page.click(aiBtnSelector);

        // 8. Intercept API and Mock Response
        await page.setRequestInterception(true);
        page.on('request', request => {
            if (request.url().includes('/api/ai/rewrite')) {
                console.log('Intercepted AI rewrite request, returning mock response.');
                request.respond({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        rewrittenText: '<p>Rewritten Content Success</p>',
                        rewriteType: 'general',
                        mode: 'preserve'
                    })
                });
            } else {
                request.continue();
            }
        });

        // 9. Click "Start Rewrite" (or "开始重写")
        console.log('Clicking Start Rewrite...');
        // The button text might be "开始重写"
        const startBtn = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.find(b => b.textContent.includes('开始重写'));
        });
        if (startBtn.asElement()) {
            await startBtn.click();
        } else {
            throw new Error('Start Rewrite button not found');
        }

        // 10. Wait for "Accept" button
        console.log('Waiting for Accept button...');
        await new Promise(r => setTimeout(r, 1000)); // Wait for mock response processing

        const acceptBtn = await page.evaluateHandle(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            return btns.find(b => b.textContent.includes('接受并替换'));
        });

        if (!acceptBtn.asElement()) {
            throw new Error('Accept button not found');
        }

        console.log('Clicking Accept button...');
        await acceptBtn.click();

        // 11. Verify Content
        await new Promise(r => setTimeout(r, 1000));
        const finalContent = await page.evaluate((selector) => {
            const editor = document.querySelector(selector);
            return editor.innerHTML;
        }, editorSelector);

        console.log('Final Editor Content:', finalContent);

        if (finalContent.includes('Rewritten Content Success')) {
            console.log('SUCCESS: Content was correctly replaced.');
        } else if (finalContent.trim() === '' || finalContent === '<br>') {
            console.log('FAILURE: Content is empty!');
            process.exit(1);
        } else {
            console.log('FAILURE: Content mismatch. Expected "Rewritten Content Success", got:', finalContent);
            process.exit(1);
        }

    } catch (e) {
        console.error('Test failed:', e);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
