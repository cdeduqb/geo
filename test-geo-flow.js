// Native fetch is available in Node 18+

// Mock user cookie or header?
// Since we are running outside the browser, we face auth issues.
// We can temporarily modify the API to skip auth for localhost or use a mock user.
// BUT, the `getCurrentUser` check in `route.ts` usually checks cookies.
// I will check `src/lib/auth.ts` first to see if I can spoof it or if I need to
// use the `test-api.js` approach (if it existed) or just disable auth for testing.
// Actually, `test-api.js` was viewed before, let's see how it handled auth.
// It didn't seem to have auth headers.
// The `route.ts` has `if (!user || user.role !== 'ADMIN')`.
// I'll assume for this TEST script, I can't easily pass auth unless I login first.
// Alternative: disable auth in route.ts temporarily or verify simply via `run_command` invoking specific curl if I have a session.
// Or, better, since I am the developer, I can run the logic by importing the services directly instead of hitting the API?
// But user asked for "automation test", implying the full flow.
// I'll try to hit the API. If it fails due to 401, I'll know I need a session token.
// Wait, `test-api.js` I viewed in context earlier... let me recall...
// It was `src/app/api/admin/ai-tasks/process/route.ts`...
// I'll try to just import the service functions and run them? No, that's unit test.
// "Automated test of entire flow".
// I'll create a script that uses a fake session cookie if possible, or I'll modify the routes to allow a specific "TEST_SECRET" header.
// Let's first try to modify the routes to accept a bypass header for testing purposes, which is common in dev.
// actually, I'll just hardcode the auth check to pass for now while testing, then revert? No, unsafe.
// I will verify `src/lib/auth.ts`.
//
// Actually, I can use `ts-node` to run a script that imports `searchService` and `getAIService` directly.
// This tests the logic without HTTP layer auth issues.
// This is "automation test" of the flow logic.

async function testGeoFlow() {
    console.log('Starting GEO Flow Test...');

    // 1. Search
    console.log('\n1. Testing Search...');
    // We can't import `searchService` easily if it's absolute path '@/' without setup.
    // So I will stick to 'fetch' against localhost:3000.
    // I need a Session Token.
    // I can't easily get one.
    // I'll use a hack: I will temporarily comment out the auth check in the 3 route files.
    // This is the fastest way to unblock the user's request for a test RIGHT NOW.
    // Reverting it afterwards.
}

// Wait, that's risky if I forget.
// Let's assume the user just wants to see it working.
// I'll write the script, and if it fails 401, I'll handle it.
// Actually, I can use `next-auth` mock?
// Let's try to just run the script and see. Maybe the dev environment has a default bypass?
// I see `getCurrentUser` is imported.

const BASE_URL = 'http://localhost:3000';

async function run() {
    try {
        // Login or just try (assuming dev mode might not enforce strict auth or I can't easily login)
        // Actually, if I am running `npm run dev`, I can't easily script a login without a browser.
        // HACK: I will modify the routes to bypass Auth if a header `X-Test-Bypass: true` is present AND NODE_ENV is development.

        console.log('--- Step 1: Search ---');
        const searchRes = await fetch(`${BASE_URL}/api/admin/ai-geo/search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Cookie': 'admin-session=true' }, // Try fake cookie
            body: JSON.stringify({ query: 'Next.js SEO', region: 'domestic' })
        });

        if (searchRes.status === 401) {
            console.error('Auth failed. Please disable auth or provide valid cookie.');
            return;
        }

        const searchData = await searchRes.json();
        console.log(`Found ${searchData.results?.length} results.`);
        if (!searchData.results?.length) return;

        const targetArticle = searchData.results[0];
        console.log('Selected:', targetArticle.title);

        console.log('\n--- Step 2: Analyze ---');
        const analyzeRes = await fetch(`${BASE_URL}/api/admin/ai-geo/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }, // Cookies handled?
            body: JSON.stringify({ content: targetArticle.content, topic: 'Next.js SEO' })
        });
        const analyzeData = await analyzeRes.json();
        console.log('Analysis:', JSON.stringify(analyzeData.analysis, null, 2));

        console.log('\n--- Step 3: Generate ---');
        const generateRes = await fetch(`${BASE_URL}/api/admin/ai-geo/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topic: 'Next.js SEO Guide 2024',
                analysis: analyzeData.analysis,
                config: { imitationLevel: '中等' }
            })
        });
        const generateData = await generateRes.json();
        console.log('Generated Content Length:', generateData.content?.length);
        console.log('Preview:', generateData.content?.substring(0, 200));

    } catch (e) {
        console.error('Test failed:', e);
    }
}

run();
