import { PrismaClient, ModuleType, PageType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('开始生成文章列表模版...');

    const templates = [
        // 1. 经典博客布局 (Classic Blog)
        {
            name: '文章列表 - 经典博客风格',
            description: '左侧大图文章列表，右侧包含侧边栏（模拟）的经典布局',
            moduleType: ModuleType.ARTICLE_PAGE,
            type: PageType.ARTICLE_LIST,
            content: `
<div class="bg-gray-50 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-12">
                <!-- Article 1 -->
                <article class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div class="aspect-video w-full overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&auto=format&fit=crop&w=3603&q=80" alt="Article Cover" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-8">
                        <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-full font-medium">科技</span>
                            <span>2025年11月28日</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                            <a href="#">AI 如何重塑内容创作的未来</a>
                        </h2>
                        <p class="text-gray-600 leading-relaxed mb-6">
                            人工智能正在改变我们创作、分发和消费内容的方式。从自动生成草稿到智能SEO优化，AI工具正在成为创作者的得力助手...
                        </p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">A</div>
                                <span class="font-medium text-gray-900">Admin</span>
                            </div>
                            <a href="#" class="text-blue-600 font-medium hover:text-blue-700">阅读全文 &rarr;</a>
                        </div>
                    </div>
                </article>

                <!-- Article 2 -->
                <article class="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div class="aspect-video w-full overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=3540&q=80" alt="Article Cover" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
                    </div>
                    <div class="p-8">
                        <div class="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span class="px-3 py-1 bg-green-50 text-green-600 rounded-full font-medium">数据</span>
                            <span>2025年11月27日</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                            <a href="#">2025年企业数据安全趋势报告</a>
                        </h2>
                        <p class="text-gray-600 leading-relaxed mb-6">
                            随着数字化转型的深入，数据安全已成为企业面临的首要挑战。本报告深入分析了最新的安全威胁和应对策略...
                        </p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">A</div>
                                <span class="font-medium text-gray-900">Admin</span>
                            </div>
                            <a href="#" class="text-blue-600 font-medium hover:text-blue-700">阅读全文 &rarr;</a>
                        </div>
                    </div>
                </article>
            </div>

            <!-- Sidebar -->
            <div class="space-y-8">
                <!-- Search Widget -->
                <div class="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">搜索</h3>
                    <div class="relative">
                        <input type="text" placeholder="搜索文章..." class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all">
                        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                </div>

                <!-- Categories Widget -->
                <div class="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 class="text-lg font-bold text-gray-900 mb-4">分类</h3>
                    <ul class="space-y-3">
                        <li><a href="#" class="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors"><span>科技</span><span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-500">12</span></a></li>
                        <li><a href="#" class="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors"><span>设计</span><span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-500">8</span></a></li>
                        <li><a href="#" class="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors"><span>商业</span><span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-500">5</span></a></li>
                        <li><a href="#" class="flex items-center justify-between text-gray-600 hover:text-blue-600 transition-colors"><span>生活</span><span class="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-500">3</span></a></li>
                    </ul>
                </div>

                <!-- Newsletter Widget -->
                <div class="bg-blue-600 p-6 rounded-2xl shadow-sm text-white">
                    <h3 class="text-lg font-bold mb-2">订阅更新</h3>
                    <p class="text-blue-100 text-sm mb-4">每周获取最新的行业洞察和技术干货。</p>
                    <input type="email" placeholder="您的邮箱地址" class="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg placeholder-blue-200 text-white focus:outline-none focus:bg-white/20 mb-3">
                    <button class="w-full py-2 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors">订阅</button>
                </div>
            </div>
        </div>
    </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: false
        },

        // 2. 杂志网格风格 (Magazine Grid)
        {
            name: '文章列表 - 杂志网格风格',
            description: '强调视觉冲击力的网格布局，适合展示多图内容',
            moduleType: ModuleType.ARTICLE_PAGE,
            type: PageType.ARTICLE_LIST,
            content: `
<div class="bg-white py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">精选专题</h2>
            <p class="mt-4 text-lg text-gray-500">探索我们精心策划的深度内容系列</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Card 1 -->
            <div class="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
                <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-8">
                    <span class="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-bold tracking-wider uppercase rounded-full mb-3">团队</span>
                    <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors">如何构建高效的远程协作团队</h3>
                    <div class="flex items-center text-gray-300 text-sm">
                        <span>5 分钟阅读</span>
                        <span class="mx-2">&bull;</span>
                        <span>2025/11/28</span>
                    </div>
                </div>
            </div>

            <!-- Card 2 -->
            <div class="group relative h-96 rounded-2xl overflow-hidden cursor-pointer lg:mt-12">
                <img src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-8">
                    <span class="inline-block px-3 py-1 bg-purple-600 text-white text-xs font-bold tracking-wider uppercase rounded-full mb-3">生产力</span>
                    <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">提升工作效率的 10 个习惯</h3>
                    <div class="flex items-center text-gray-300 text-sm">
                        <span>3 分钟阅读</span>
                        <span class="mx-2">&bull;</span>
                        <span>2025/11/27</span>
                    </div>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="group relative h-96 rounded-2xl overflow-hidden cursor-pointer">
                <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div class="absolute bottom-0 left-0 p-8">
                    <span class="inline-block px-3 py-1 bg-orange-600 text-white text-xs font-bold tracking-wider uppercase rounded-full mb-3">灵感</span>
                    <h3 class="text-2xl font-bold text-white mb-2 group-hover:text-orange-200 transition-colors">设计师的周末灵感指南</h3>
                    <div class="flex items-center text-gray-300 text-sm">
                        <span>4 分钟阅读</span>
                        <span class="mx-2">&bull;</span>
                        <span>2025/11/26</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
            `,
            style: '',
            isActive: true,
            isDefault: false
        },

        // 3. 极简列表风格 (Minimal List)
        {
            name: '文章列表 - 极简列表风格',
            description: '干净简洁的列表布局，适合新闻资讯或技术文档',
            moduleType: ModuleType.ARTICLE_PAGE,
            type: PageType.ARTICLE_LIST,
            content: `
<div class="bg-white py-16">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="border-b border-gray-100 pb-10 mb-10">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">最新动态</h1>
            <div class="flex items-center gap-4">
                <button class="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-1">全部</button>
                <button class="text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 transition-colors">公司新闻</button>
                <button class="text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 transition-colors">产品更新</button>
                <button class="text-sm font-medium text-gray-500 hover:text-gray-900 pb-1 transition-colors">媒体报道</button>
            </div>
        </div>

        <div class="space-y-10">
            <!-- Item 1 -->
            <article class="group flex flex-col sm:flex-row gap-8 items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span class="font-medium text-blue-600">公司新闻</span>
                        <span>&bull;</span>
                        <span>2025/11/28</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        <a href="#">企业官网 完成 A 轮融资，加速全球化布局</a>
                    </h3>
                    <p class="text-gray-500 leading-relaxed line-clamp-2">
                        我们很高兴地宣布，企业官网 已完成由顶级风投领投的 A 轮融资。这笔资金将用于扩大我们的研发团队，并加速在北美和欧洲市场的业务拓展...
                    </p>
                </div>
                <div class="w-full sm:w-48 aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1632&q=80" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                </div>
            </article>

            <!-- Item 2 -->
            <article class="group flex flex-col sm:flex-row gap-8 items-start pt-10 border-t border-gray-100">
                <div class="flex-1">
                    <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span class="font-medium text-blue-600">产品更新</span>
                        <span>&bull;</span>
                        <span>2025/11/25</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        <a href="#">版本 2.0 发布：引入 AI 智能助手</a>
                    </h3>
                    <p class="text-gray-500 leading-relaxed line-clamp-2">
                        全新的 2.0 版本带来了革命性的 AI 智能助手，可以帮助您自动生成文章摘要、优化 SEO 关键词，并提供写作建议...
                    </p>
                </div>
                <div class="w-full sm:w-48 aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                </div>
            </article>

            <!-- Item 3 -->
            <article class="group flex flex-col sm:flex-row gap-8 items-start pt-10 border-t border-gray-100">
                <div class="flex-1">
                    <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span class="font-medium text-blue-600">媒体报道</span>
                        <span>&bull;</span>
                        <span>2025/11/20</span>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        <a href="#">TechCrunch: 企业官网 正在重新定义企业内容管理</a>
                    </h3>
                    <p class="text-gray-500 leading-relaxed line-clamp-2">
                        知名科技媒体 TechCrunch 对 企业官网 进行了深度报道，称赞其创新的模块化设计和强大的 AI 集成能力...
                    </p>
                </div>
                <div class="w-full sm:w-48 aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 shrink-0">
                    <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
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

    for (const template of templates) {
        await prisma.pageTemplate.create({
            data: template as any,
        });
        console.log(`已创建模版: ${template.name}`);
    }

    console.log('文章列表模版生成完成！');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
