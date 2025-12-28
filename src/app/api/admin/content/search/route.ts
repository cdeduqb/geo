import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json([]);
        }

        // Search Pages
        const pages = await db.page.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { slug: { contains: query } },
                ],
            },
            take: 10,
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
            },
        });

        // Search Articles
        const articles = await db.article.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { slug: { contains: query } },
                ],
            },
            take: 10,
            select: {
                id: true,
                title: true,
                slug: true,
                status: true,
            },
        });

        const formattedPages = pages.map((page) => ({
            id: page.id,
            title: page.title,
            type: "page",
            url: `/${page.slug}`,
            status: page.status,
            displayType: "页面"
        }));

        const formattedArticles = articles.map((article) => ({
            id: article.id,
            title: article.title,
            type: "article",
            url: `/articles/${article.slug}`,
            status: article.status,
            displayType: "文章"
        }));

        return NextResponse.json([...formattedPages, ...formattedArticles]);
    } catch (error) {
        console.error("[CONTENT_SEARCH_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
