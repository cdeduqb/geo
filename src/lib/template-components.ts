export interface TemplateComponent {
    id: string;
    name: string;
    category: 'layout' | 'content' | 'media' | 'form';
    description: string;
    code: string;
}

export const TEMPLATE_COMPONENTS: TemplateComponent[] = [
    {
        id: 'hero-simple',
        name: '简约横幅',
        category: 'layout',
        description: '包含标题、副标题和按钮的居中横幅',
        code: `<section class="bg-white  py-20">
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold text-gray-900  mb-6">
            {{title}}
        </h1>
        <p class="text-xl text-gray-600  mb-8 max-w-2xl mx-auto">
            {{description}}
        </p>
        <div class="flex justify-center gap-4">
            <a href="#" class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                开始使用
            </a>
            <a href="#" class="px-8 py-3 bg-gray-100  text-gray-900  rounded-lg font-medium hover:bg-gray-200 :bg-gray-700 transition-colors">
                了解更多
            </a>
        </div>
    </div>
</section>`
    },
    {
        id: 'feature-grid',
        name: '特性网格',
        category: 'content',
        description: '三列布局的特性展示',
        code: `<section class="py-16 bg-gray-50 ">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold text-gray-900  mb-4">核心特性</h2>
            <p class="text-gray-600 ">为什么选择我们</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Feature 1 -->
            <div class="bg-white  p-6 rounded-xl shadow-sm border border-gray-100 ">
                <div class="w-12 h-12 bg-blue-100  rounded-lg flex items-center justify-center mb-4 text-blue-600 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900  mb-2">特性一</h3>
                <p class="text-gray-600 ">描述这个特性的优势和价值。</p>
            </div>
            <!-- Feature 2 -->
            <div class="bg-white  p-6 rounded-xl shadow-sm border border-gray-100 ">
                <div class="w-12 h-12 bg-green-100  rounded-lg flex items-center justify-center mb-4 text-green-600 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900  mb-2">特性二</h3>
                <p class="text-gray-600 ">描述这个特性的优势和价值。</p>
            </div>
            <!-- Feature 3 -->
            <div class="bg-white  p-6 rounded-xl shadow-sm border border-gray-100 ">
                <div class="w-12 h-12 bg-purple-100  rounded-lg flex items-center justify-center mb-4 text-purple-600 ">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <h3 class="text-xl font-bold text-gray-900  mb-2">特性三</h3>
                <p class="text-gray-600 ">描述这个特性的优势和价值。</p>
            </div>
        </div>
    </div>
</section>`
    },
    {
        id: 'header-nav',
        name: '导航栏',
        category: 'layout',
        description: '响应式顶部导航栏',
        code: `<header class="bg-white  border-b border-gray-200  sticky top-0 z-50">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2 font-bold text-xl text-gray-900 ">
            <div class="w-8 h-8 bg-blue-600 rounded-lg"></div>
            Logo
        </div>
        <nav class="hidden md:flex items-center gap-8">
            <a href="#" class="text-gray-600  hover:text-blue-600 :text-blue-400 font-medium">首页</a>
            <a href="#" class="text-gray-600  hover:text-blue-600 :text-blue-400 font-medium">产品</a>
            <a href="#" class="text-gray-600  hover:text-blue-600 :text-blue-400 font-medium">服务</a>
            <a href="#" class="text-gray-600  hover:text-blue-600 :text-blue-400 font-medium">关于</a>
        </nav>
        <div class="flex items-center gap-4">
            <button class="hidden md:block px-4 py-2 text-blue-600  font-medium hover:bg-blue-50 :bg-blue-900/20 rounded-lg">登录</button>
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">注册</button>
        </div>
    </div>
</header>`
    },
    {
        id: 'footer-simple',
        name: '简约页脚',
        category: 'layout',
        description: '包含链接和版权信息的页脚',
        code: `<footer class="bg-gray-50  border-t border-gray-200  py-12">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
                <h3 class="font-bold text-gray-900  mb-4">关于我们</h3>
                <p class="text-gray-600  text-sm">我们致力于提供最优质的服务和解决方案。</p>
            </div>
            <div>
                <h3 class="font-bold text-gray-900  mb-4">产品</h3>
                <ul class="space-y-2 text-sm text-gray-600 ">
                    <li><a href="#" class="hover:text-blue-600">产品一</a></li>
                    <li><a href="#" class="hover:text-blue-600">产品二</a></li>
                </ul>
            </div>
            <div>
                <h3 class="font-bold text-gray-900  mb-4">资源</h3>
                <ul class="space-y-2 text-sm text-gray-600 ">
                    <li><a href="#" class="hover:text-blue-600">文档</a></li>
                    <li><a href="#" class="hover:text-blue-600">博客</a></li>
                </ul>
            </div>
            <div>
                <h3 class="font-bold text-gray-900  mb-4">联系</h3>
                <ul class="space-y-2 text-sm text-gray-600 ">
                    <li>contact@example.com</li>
                    <li>+86 123 4567 8900</li>
                </ul>
            </div>
        </div>
        <div class="pt-8 border-t border-gray-200  text-center text-sm text-gray-500 ">
            &copy; 2024 Company Name. All rights reserved.
        </div>
    </div>
</footer>`
    }
];
