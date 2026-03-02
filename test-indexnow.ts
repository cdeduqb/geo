import { IndexNowPushService } from './src/lib/seo/push-service';

async function main() {
    console.log('Testing IndexNow Push Service...');
    try {
        const service = new IndexNowPushService(
            'https://api.indexnow.org/indexnow',
            'my-test-token',
            'moli123.com'
        );
        const result = await service.push(['https://moli123.com/articles/test-article-123']);
        console.log('Push Result:', result);
    } catch (e) {
        console.error('Error:', e);
    }
}
main();
