
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const product = await prisma.product.findFirst({
        where: { status: 'PUBLISHED' }
    });

    if (product) {
        console.log(`FOUND_SLUG: ${product.slug}`);
    } else {
        console.log('NO_PRODUCT_FOUND');
        // Create one for testing
        const newProduct = await prisma.product.create({
            data: {
                name: 'Test Product for GEO',
                slug: 'test-product-geo',
                price: 99.99,
                description: 'This is a test product for structured data verification.',
                status: 'PUBLISHED'
            }
        });
        console.log(`CREATED_SLUG: ${newProduct.slug}`);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
