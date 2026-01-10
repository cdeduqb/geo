import { db } from './src/lib/db';

async function runTests() {
    console.log('🧪 Starting Comprehensive Functional Backend Audit...\n');

    const testId = `test_${Date.now()}`;
    let errors = 0;

    async function testStep(name: string, fn: () => Promise<any>) {
        console.log(`Testing ${name}...`);
        try {
            await fn();
            console.log(`  ✅ Passed`);
        } catch (e: any) {
            console.error(`  ❌ Failed: ${e.message}`);
            errors++;
        }
    }

    const user = await (db.user as any).findFirst();
    if (!user) {
        console.error('❌ CRITICAL: No user found in database. Cannot run article tests.');
        process.exit(1);
    }
    const authorId = user.id;

    // 1. Pages CRUD
    await testStep('Page CRUD', async () => {
        const page = await (db.page as any).create({
            data: {
                title: `Test Page ${testId}`,
                slug: `test-slug-${testId}`,
                content: '<p>Test Content</p>',
                type: 'CUSTOM',
                status: 'PUBLISHED',
                lang: 'zh'
            }
        });
        await (db.page as any).update({ where: { id: page.id }, data: { title: `Updated Page` } });
        await (db.page as any).delete({ where: { id: page.id } });
    });

    // 2. Articles CRUD
    await testStep('Article CRUD', async () => {
        let category = await (db.category as any).findFirst();
        if (!category) {
            category = await (db.category as any).create({
                data: { name: 'Temp Cat', slug: `tc-${testId}` }
            });
        }
        const article = await (db.article as any).create({
            data: {
                title: `Test Article ${testId}`,
                slug: `test-art-${testId}`,
                content: 'Content',
                status: 'PUBLISHED',
                lang: 'zh',
                categoryId: category.id,
                authorId: authorId
            }
        });
        await (db.article as any).update({ where: { id: article.id }, data: { title: 'Updated Art' } });
        await (db.article as any).delete({ where: { id: article.id } });
    });

    // 3. Product CRUD
    await testStep('Product CRUD', async () => {
        let pcat = await (db.productCategory as any).findFirst();
        if (!pcat) {
            pcat = await (db.productCategory as any).create({
                data: { name: 'Temp PCat', slug: `tpc-${testId}` }
            });
        }
        const product = await (db.product as any).create({
            data: {
                name: `Test Product ${testId}`,
                slug: `test-prod-${testId}`,
                price: 99.99,
                stock: 10,
                status: 'PUBLISHED',
                lang: 'zh',
                categoryId: pcat.id
            }
        });
        await (db.product as any).update({ where: { id: product.id }, data: { price: 88.88 } });
        await (db.product as any).delete({ where: { id: product.id } });
    });

    // 4. Template CRUD
    await testStep('Template CRUD', async () => {
        const template = await (db.pageTemplate as any).create({
            data: {
                name: `Test Template ${testId}`,
                content: '<div>Tpl</div>',
                type: 'CUSTOM',
                moduleType: 'CUSTOM_PAGE'
            }
        });
        await (db.pageTemplate as any).delete({ where: { id: template.id } });
    });

    // 5. Public Routes Check (Fast check for 500)
    console.log('\nChecking Public Routes (Status Only)...');
    const publicRoutes = ['/', '/en'];
    for (const route of publicRoutes) {
        try {
            const response = await fetch(`http://localhost:3000${route}`);
            if (response.status >= 500) {
                console.error(`  ❌ ${route} returned ${response.status}`);
                errors++;
            } else {
                console.log(`  ✅ ${route} returned ${response.status}`);
            }
        } catch (e: any) {
            console.error(`  ❌ ${route} could not be reached: ${e.message}`);
            errors++;
        }
    }

    console.log('\n======================================');
    if (errors === 0) {
        console.log('✅ ALL FUNCTIONAL TESTS PASSED');
        process.exit(0);
    } else {
        console.log(`❌ ${errors} TESTS FAILED`);
        process.exit(1);
    }
}

runTests();
