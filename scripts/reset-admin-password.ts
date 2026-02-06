
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
    const email = 'admin@example.com';
    const password = 'admin123';
    const hashedPassword = hashPassword(password);

    console.log(`Resetting password for ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
        },
        create: {
            email,
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log(`User ${user.email} updated/created. ID: ${user.id}`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
