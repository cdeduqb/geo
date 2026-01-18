import { PrismaClient } from '@prisma/client'
import * as crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function main() {
    const hashedPassword = hashPassword('admin123');

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {
            username: 'admin',
            password: hashedPassword,
        },
        create: {
            email: 'admin@example.com',
            username: 'admin',
            name: 'Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log({ admin })

    // 创建示例页眉模板
    const headerTemplate1 = await prisma.pageTemplate.upsert({
        where: { id: 'header-classic' },
        update: {},
        create: {
            id: 'header-classic',
            name: '经典导航栏（暗色）',
            description: '现代化的暗色主题导航栏，适合企业官网',
            moduleType: 'HEADER',
            type: 'CUSTOM',
            version: 1,
            isActive: true,
            content: `<header class="header-classic">
    <div class="container">
        <div class="logo">GeoCMS</div>
        <nav class="nav-links">
            <a href="/">首页</a>
            <a href="/articles">文章</a>
            <a href="/about">关于我们</a>
            <a href="/contact">联系我们</a>
        </nav>
    </div>
</header>`,
            style: `.header-classic { background: #1a202c; color: white; padding: 1rem 0; }
.header-classic .container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.header-classic .logo { font-size: 1.5rem; font-weight: bold; }
.header-classic .nav-links a { color: white; margin-left: 2rem; text-decoration: none; transition: color 0.3s; }
.header-classic .nav-links a:hover { color: #60a5fa; }`
        }
    })

    const headerTemplate2 = await prisma.pageTemplate.upsert({
        where: { id: 'header-light' },
        update: {},
        create: {
            id: 'header-light',
            name: '简约顶部栏（白色）',
            description: '清爽的白色主题导航，适合内容型网站',
            moduleType: 'HEADER',
            type: 'CUSTOM',
            version: 1,
            isActive: false,
            content: `<header class="header-light">
    <div class="container">
        <div class="logo">GeoCMS</div>
        <nav class="nav-links">
            <a href="/">首页</a>
            <a href="/articles">文章</a>
            <a href="/about">关于</a>
        </nav>
    </div>
</header>`,
            style: `.header-light { background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
.header-light .container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.header-light .logo { font-size: 1.5rem; font-weight: bold; color: #111827; }
.header-light .nav-links a { color: #374151; margin-left: 2rem; text-decoration: none; }
.header-light .nav-links a:hover { color: #2563eb; }`
        }
    })

    // 创建示例页脚模板
    const footerTemplate1 = await prisma.pageTemplate.upsert({
        where: { id: 'footer-classic' },
        update: {},
        create: {
            id: 'footer-classic',
            name: '经典三栏页脚',
            description: '包含公司信息、快速链接和联系方式的三栏布局',
            moduleType: 'FOOTER',
            type: 'CUSTOM',
            version: 1,
            isActive: true,
            content: `<footer class="footer-classic">
    <div class="container">
        <div class="footer-col">
            <h4>关于我们</h4>
            <p>GeoCMS 是一款企业级内容管理系统，提供强大的功能和灵活的扩展性。</p>
        </div>
        <div class="footer-col">
            <h4>快速链接</h4>
            <ul>
                <li><a href="/about">关于我们</a></li>
                <li><a href="/articles">文章列表</a></li>
                <li><a href="/contact">联系我们</a></li>
            </ul>
        </div>
        <div class="footer-col">
            <h4>联系方式</h4>
            <p>邮箱: info@geocms.com</p>
            <p>电话: 400-123-4567</p>
        </div>
    </div>
    <div class="copyright">
        © 2024 GeoCMS. All rights reserved.
    </div>
</footer>`,
            style: `.footer-classic { background: #1f2937; color: white; padding: 3rem 0 1rem; }
.footer-classic .container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.footer-classic h4 { margin-bottom: 1rem; color: #60a5fa; }
.footer-classic ul { list-style: none; padding: 0; }
.footer-classic a { color: #9ca3af; text-decoration: none; }
.footer-classic a:hover { color: white; }
.footer-classic .copyright { text-align: center; margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #374151; color: #9ca3af; }`
        }
    })

    console.log({ headerTemplate1, headerTemplate2, footerTemplate1 })

    // 添加更多页眉模板
    const headerTemplate3 = await prisma.pageTemplate.upsert({
        where: { id: 'header-modern' },
        update: {},
        create: {
            id: 'header-modern',
            name: '现代透明导航',
            description: '透明背景的现代导航栏，适合图片背景的首页',
            moduleType: 'HEADER',
            type: 'CUSTOM',
            version: 1,
            isActive: false,
            content: `<header class="header-modern">
    <div class="container">
        <div class="brand">
            <span class="logo-icon">🚀</span>
            <span class="brand-name">GeoCMS</span>
        </div>
        <nav class="nav-menu">
            <a href="/">首页</a>
            <a href="/articles">文章</a>
            <a href="/products">产品</a>
            <a href="/about">关于</a>
            <a href="/contact" class="contact-btn">联系我们</a>
        </nav>
    </div>
</header>`,
            style: `.header-modern { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); padding: 1.5rem 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
.header-modern .container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
.header-modern .brand { display: flex; align-items: center; gap: 0.75rem; font-weight: 700; font-size: 1.5rem; }
.header-modern .logo-icon { font-size: 2rem; }
.header-modern .nav-menu { display: flex; gap: 2rem; align-items: center; }
.header-modern .nav-menu a { color: #1f2937; text-decoration: none; font-weight: 500; transition: color 0.3s; }
.header-modern .nav-menu a:hover { color: #3b82f6; }
.header-modern .contact-btn { background: #3b82f6; color: white !important; padding: 0.5rem 1.5rem; border-radius: 0.5rem; }
.header-modern .contact-btn:hover { background: #2563eb; }`
        }
    })

    // 添加更多页脚模板
    const footerTemplate2 = await prisma.pageTemplate.upsert({
        where: { id: 'footer-minimal' },
        update: {},
        create: {
            id: 'footer-minimal',
            name: '简约单栏页脚',
            description: '简洁的单栏页脚，居中对齐',
            moduleType: 'FOOTER',
            type: 'CUSTOM',
            version: 1,
            isActive: false,
            content: `<footer class="footer-minimal">
    <div class="container">
        <div class="footer-content">
            <div class="brand">GeoCMS</div>
            <nav class="footer-nav">
                <a href="/about">关于我们</a>
                <a href="/privacy">隐私政策</a>
                <a href="/terms">使用条款</a>
                <a href="/contact">联系我们</a>
            </nav>
            <div class="social-links">
                <a href="#" aria-label="微信">📱</a>
                <a href="#" aria-label="微博">🐦</a>
                <a href="#" aria-label="GitHub">💻</a>
            </div>
        </div>
        <div class="copyright">
            © 2024 GeoCMS. 版权所有 | ICP备案号：京ICP备12345678号
        </div>
    </div>
</footer>`,
            style: `.footer-minimal { background: #f9fafb; border-top: 1px solid #e5e7eb; padding: 3rem 0 1.5rem; }
.footer-minimal .container { max-width: 800px; margin: 0 auto; text-align: center; }
.footer-minimal .brand { font-size: 1.5rem; font-weight: 700; color: #111827; margin-bottom: 1.5rem; }
.footer-minimal .footer-nav { display: flex; justify-content: center; gap: 2rem; margin-bottom: 1.5rem; }
.footer-minimal .footer-nav a { color: #6b7280; text-decoration: none; }
.footer-minimal .footer-nav a:hover { color: #111827; }
.footer-minimal .social-links { display: flex; justify-content: center; gap: 1rem; font-size: 1.5rem; margin-bottom: 2rem; }
.footer-minimal .social-links a { transition: transform 0.2s; }
.footer-minimal .social-links a:hover { transform: scale(1.2); }
.footer-minimal .copyright { color: #9ca3af; font-size: 0.875rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }`
        }
    })

    const footerTemplate3 = await prisma.pageTemplate.upsert({
        where: { id: 'footer-social' },
        update: {},
        create: {
            id: 'footer-social',
            name: '社交媒体风格页脚',
            description: '突出社交媒体图标的页脚设计',
            moduleType: 'FOOTER',
            type: 'CUSTOM',
            version: 1,
            isActive: false,
            content: `<footer class="footer-social">
    <div class="container">
        <div class="footer-main">
            <div class="about-section">
                <h3>GeoCMS</h3>
                <p>企业级内容管理系统，提供强大的功能和灵活的扩展性。</p>
            </div>
            <div class="social-section">
                <h4>关注我们</h4>
                <div class="social-grid">
                    <a href="#" class="social-card">
                        <span class="icon">📱</span>
                        <span class="label">微信</span>
                    </a>
                    <a href="#" class="social-card">
                        <span class="icon">🐦</span>
                        <span class="label">微博</span>
                    </a>
                    <a href="#" class="social-card">
                        <span class="icon">💼</span>
                        <span class="label">LinkedIn</span>
                    </a>
                    <a href="#" class="social-card">
                        <span class="icon">💻</span>
                        <span class="label">GitHub</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            © 2024 GeoCMS. All rights reserved.
        </div>
    </div>
</footer>`,
            style: `.footer-social { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 4rem 0 2rem; }
.footer-social .container { max-width: 1200px; margin: 0 auto; }
.footer-social .footer-main { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; margin-bottom: 3rem; }
.footer-social h3 { font-size: 2rem; margin-bottom: 1rem; }
.footer-social h4 { font-size: 1.25rem; margin-bottom: 1.5rem; }
.footer-social p { color: rgba(255,255,255,0.9); line-height: 1.6; }
.footer-social .social-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.footer-social .social-card { background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.75rem; text-decoration: none; color: white; backdrop-filter: blur(10px); transition: all 0.3s; }
.footer-social .social-card:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }
.footer-social .icon { font-size: 1.5rem; }
.footer-social .footer-bottom { text-align: center; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }`
        }
    })

    // 添加文章布局模板
    const articleLayout1 = await prisma.pageTemplate.upsert({
        where: { id: 'article-layout-wide' },
        update: {},
        create: {
            id: 'article-layout-wide',
            name: '宽屏阅读布局',
            description: '无边栏的宽屏文章布局，适合长文阅读',
            moduleType: 'ARTICLE_PAGE',
            type: 'ARTICLE_LIST',
            version: 1,
            isActive: true,
            content: `<article class="article-wide">
    <header class="article-header">
        <h1 class="article-title">{{title}}</h1>
        <div class="article-meta">
            <span class="author">作者：{{author}}</span>
            <span class="date">{{date}}</span>
            <span class="views">浏览：{{views}}</span>
        </div>
    </header>
    <div class="article-content">
        {{content}}
    </div>
</article>`,
            style: `.article-wide { max-width: 800px; margin: 0 auto; padding: 3rem 1rem; }
.article-wide .article-header { margin-bottom: 3rem; }
.article-wide .article-title { font-size: 2.5rem; font-weight: 800; line-height: 1.2; margin-bottom: 1.5rem; color: #111827; }
.article-wide .article-meta { display: flex; gap: 2rem; color: #6b7280; font-size: 0.875rem; }
.article-wide .article-content { font-size: 1.125rem; line-height: 1.8; color: #374151; }
.article-wide .article-content p { margin-bottom: 1.5rem; }
.article-wide .article-content h2 { font-size: 1.875rem; font-weight: 700; margin: 3rem 0 1.5rem; }
.article-wide .article-content h3 { font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem; }
.article-wide .article-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 2rem 0; }`
        }
    })

    const articleLayout2 = await prisma.pageTemplate.upsert({
        where: { id: 'article-layout-sidebar' },
        update: {},
        create: {
            id: 'article-layout-sidebar',
            name: '侧边栏布局',
            description: '带右侧边栏的文章布局，可显示推荐内容',
            moduleType: 'ARTICLE_PAGE',
            type: 'ARTICLE_LIST',
            version: 1,
            isActive: false,
            content: `<div class="article-sidebar-layout">
    <article class="main-article">
        <h1 class="title">{{title}}</h1>
        <div class="meta">{{date}} · {{author}}</div>
        <div class="content">{{content}}</div>
    </article>
    <aside class="sidebar">
        <div class="widget">
            <h3>推荐阅读</h3>
            <ul class="related-posts">
                <li><a href="#">相关文章标题1</a></li>
                <li><a href="#">相关文章标题2</a></li>
                <li><a href="#">相关文章标题3</a></li>
            </ul>
        </div>
        <div class="widget">
            <h3>标签云</h3>
            <div class="tag-cloud">
                <a href="#">前端</a>
                <a href="#">后端</a>
                <a href="#">数据库</a>
            </div>
        </div>
    </aside>
</div>`,
            style: `.article-sidebar-layout { max-width: 1200px; margin: 0 auto; padding: 2rem; display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; }
.article-sidebar-layout .main-article { }
.article-sidebar-layout .title { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
.article-sidebar-layout .meta { color: #6b7280; margin-bottom: 2rem; }
.article-sidebar-layout .content { line-height: 1.8; }
.article-sidebar-layout .sidebar { }
.article-sidebar-layout .widget { background: #f9fafb; padding: 1.5rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
.article-sidebar-layout .widget h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; }
.article-sidebar-layout .related-posts { list-style: none; padding: 0; }
.article-sidebar-layout .related-posts li { margin-bottom: 0.75rem; }
.article-sidebar-layout .related-posts a { color: #374151; text-decoration: none; }
.article-sidebar-layout .related-posts a:hover { color: #2563eb; }
.article-sidebar-layout .tag-cloud { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.article-sidebar-layout .tag-cloud a { padding: 0.25rem 0.75rem; background: white; border-radius: 0.25rem; text-decoration: none; color: #6b7280; font-size: 0.875rem; }
.article-sidebar-layout .tag-cloud a:hover { background: #e5e7eb; }`
        }
    })

    console.log({ headerTemplate3, footerTemplate2, footerTemplate3, articleLayout1, articleLayout2 })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
