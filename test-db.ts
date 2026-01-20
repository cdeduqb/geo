import { PrismaClient } from '@prisma/client'

async function main() {
    const prisma = new PrismaClient()
    try {
        const projectCount = await prisma.articleAutomationProject.count()
        console.log('Project count:', projectCount)

        // Test if we can find a project with mode field
        const projects = await prisma.articleAutomationProject.findMany({
            take: 1
        })
        console.log('Sample project:', JSON.stringify(projects[0], null, 2))
    } catch (e) {
        console.error('Test failed:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
