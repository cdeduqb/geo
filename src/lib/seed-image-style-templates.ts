import { PrismaClient, ModuleType, PageType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('开始生成图片风格模版...');

    const templates = [
        // 1. 页眉 (Header)
        {
            name: '极简风格页眉 (图片同款)',
            description: '参考用户图片设计的极简风格页眉，包含Logo、导航、搜索和登录按钮',
            moduleType: ModuleType.HEADER,
            type: PageType.CUSTOM,
            content: `
<header class="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- Left: Logo & Nav -->
            <div class="flex items-center gap-8">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        G
                    </div>
                    <span class="text-xl font-bold text-gray-900 tracking-tight">GeoCMS</span>
                </a>

                <!-- Navigation -->
                <nav class="hidden md:flex items-center gap-6">
                    <a href="/" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">首页</a>
                    <a href="/articles" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">文章</a>
                    <a href="/products" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">产品</a>
                    <a href="/about" class="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">关于我们</a>
                </nav>
            </div>

            <!-- Right: Search & Actions -->
            <div class="flex items-center gap-4">
                <div class="relative hidden sm:block">
                    <input 
                        type="text" 
                        placeholder="搜索文章..." 
                        class="w-64 pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none text-gray-600 placeholder-gray-400"
                    >
                    <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <a href="/login" class="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-full transition-colors">
                    登录
                </a>
            </div>
        </div>
    </div>
</header>
            `,
            style: '',
            isActive: true, // 激活此模版
            isDefault: false
        },

        // 2. 页脚 (Footer)
        {
            name: '多列布局页脚 (图片同款)',
            description: '参考用户图片设计的多列布局页脚，包含Logo、Slogan、社交图标和链接列表',
            moduleType: ModuleType.FOOTER,
            type: PageType.CUSTOM,
            content: `
<footer class="bg-white border-t border-gray-100 pt-16 pb-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
            <!-- Brand Column -->
            <div class="md:col-span-4 space-y-6">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        G
                    </div>
                    <span class="text-xl font-bold text-gray-900 tracking-tight">GeoCMS</span>
                </div>
                <p class="text-gray-500 text-sm leading-relaxed">
                    企业级内容管理系统，为您提供强大的内容发布和管理解决方案。
                    <br>汇集最新的技术见解、行业趋势和深度思考。
                </p>
                <div class="flex items-center gap-4 text-gray-400">
                    <a href="#" class="hover:text-gray-600 transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
                    <a href="#" class="hover:text-gray-600 transition-colors"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg></a>
                </div>
            </div>

            <!-- Links Columns -->
            <div class="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">产品</h3>
                    <ul class="space-y-3">
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">功能特性</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">解决方案</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">定价策略</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">更新日志</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">资源</h3>
                    <ul class="space-y-3">
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">技术博客</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">帮助中心</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">开发者文档</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">社区论坛</a></li>
                    </ul>
                </div>
                <div>
                    <h3 class="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">公司</h3>
                    <ul class="space-y-3">
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">关于我们</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">加入我们</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">联系方式</a></li>
                        <li><a href="#" class="text-sm text-gray-500 hover:text-blue-600 transition-colors">隐私政策</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</footer>
            `,
            style: '',
            isActive: true, // 激活此模版
            isDefault: false
        },

        // 3. 文章列表页 (Article List)
        {
            name: '探索发现风格文章列表 (图片同款)',
            description: '参考用户图片设计的文章列表页，包含Hero区域、分类筛选、搜索栏和卡片列表',
            moduleType: ModuleType.ARTICLE_PAGE, // 或者 HOME_PAGE，视用途而定，这里作为通用内容模版
            type: PageType.ARTICLE_LIST,
            content: `
<div class="bg-white min-h-screen">
    <!-- Hero Section -->
    <div class="pt-24 pb-16 text-center px-4">
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">探索与发现</h1>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">
            汇集最新的技术见解、行业趋势和深度思考，助您保持领先。
        </p>
    </div>

    <!-- Toolbar -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <!-- Tabs -->
            <div class="flex p-1 bg-gray-50 rounded-xl">
                <button class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm transition-all">全部</button>
                <button class="px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">科技</button>
                <button class="px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-all">新闻</button>
            </div>

            <!-- Search -->
            <div class="relative w-full sm:w-72">
                <input 
                    type="text" 
                    placeholder="搜索文章..." 
                    class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none"
                >
                <svg class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Article Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Card 1 -->
            <article class="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <div class="flex items-center gap-3 mb-6">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">科技</span>
                    <span class="flex items-center text-gray-400 text-xs">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        2025/11/27 09:40
                    </span>
                </div>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    <a href="#">刚回家看那么难</a>
                </h2>
                <p class="text-gray-500 mb-8 line-clamp-2 leading-relaxed">
                    后刚回家吗mm就解决...
                </p>

                <div class="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">A</div>
                        <span class="text-sm font-medium text-gray-700">Admin</span>
                    </div>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        阅读全文 
                        <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                </div>
            </article>

            <!-- Card 2 -->
            <article class="group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-gray-200 transition-all duration-300">
                <div class="flex items-center gap-3 mb-6">
                    <span class="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">新闻</span>
                    <span class="flex items-center text-gray-400 text-xs">
                        <svg class="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        2025/11/27 09:38
                    </span>
                </div>
                
                <h2 class="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    <a href="#">刚回家看</a>
                </h2>
                <p class="text-gray-500 mb-8 line-clamp-2 leading-relaxed">
                    很健康
                </p>

                <div class="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-500">A</div>
                        <span class="text-sm font-medium text-gray-700">Admin</span>
                    </div>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                        阅读全文 
                        <svg class="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                    </a>
                </div>
            </article>
        </div>
    </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: false
        }
    ];

    // 1. 停用所有旧的 Header 和 Footer
    await prisma.pageTemplate.updateMany({
        where: {
            moduleType: {
                in: [ModuleType.HEADER, ModuleType.FOOTER]
            }
        },
        data: { isActive: false }
    });

    // 2. 创建新模版
    for (const template of templates) {
        await prisma.pageTemplate.create({
            data: template as any,
        });
        console.log(`已创建模版: ${template.name}`);
    }

    console.log('图片风格模版生成完成！');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
