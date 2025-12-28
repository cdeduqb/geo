import { db } from '@/lib/db';
import Link from 'next/link';
import { Plus, Check, LayoutGrid, Calendar, Code, Layout } from 'lucide-react';
import TemplateStatusButton from './_components/TemplateStatusButton';
import DeleteTemplateButton from './_components/DeleteTemplateButton';
import TemplateCategoryNav from './_components/TemplateCategoryNav';
import { ModuleType } from '@prisma/client';

const MODULE_TYPE_LABELS: Record<string, string> = {
    HEADER: '页眉',
    FOOTER: '页脚',
    HOME_PAGE: '首页页面',
    ARTICLE_PAGE: '文章页面',
    ABOUT_PAGE: '关于我们',
    CONTACT_PAGE: '联系我们',
    PRODUCT_PAGE: '产品页面',
    SERVICE_PAGE: '服务页面',
    FAQ_PAGE: '常见问题',
    CUSTOM_PAGE: '自定义页面',
};

interface TemplatesPageProps {
    searchParams: Promise<{ category?: string }>;
}

export default async function TemplatesPage({ searchParams }: TemplatesPageProps) {
    const { category } = await searchParams;
    const currentCategory = category || 'ALL';

    // 构建查询条件
    const where = currentCategory !== 'ALL'
        ? { moduleType: currentCategory as ModuleType }
        : {};

    const templates = await db.pageTemplate.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }],
        select: {
            id: true,
            name: true,
            description: true,
            content: true,
            style: true,
            type: true,
            moduleType: true,
            version: true,
            preview: true,
            isDefault: true,
            isActive: true,
            isAIGenerated: true,
            sections: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // 如果是全部模式，仍然按类型分组显示；如果是特定分类，则直接显示列表
    const isAll = currentCategory === 'ALL';

    // 按模块类型分组 (仅在 ALL 模式下使用)
    const groupedTemplates = isAll
        ? templates.reduce((acc: Record<string, typeof templates>, template) => {
            const type = template.moduleType;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(template);
            return acc;
        }, {} as Record<string, typeof templates>)
        : { [currentCategory]: templates };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutGrid className="w-8 h-8 text-blue-600" />
                        模板管理
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理和定制您的网站页面模版、组件和布局风格
                    </p>
                </div>
                <Link href="/admin/templates/create" className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    新建模板
                </Link>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* 左侧导航 */}
                <TemplateCategoryNav />

                {/* 右侧内容 */}
                <div className="flex-1 min-w-0 space-y-6">
                    {/* 提示卡片：全局页眉页脚请到站点设置 */}
                    {(currentCategory === 'ALL' || currentCategory === 'HEADER' || currentCategory === 'FOOTER') && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                                    <Layout className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                        全局页眉/页脚配置
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        推荐在「站点设置」中配置全局页眉和页脚，所有页面将自动继承
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/admin/settings/site"
                                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                前往设置
                            </Link>
                        </div>
                    )}
                    {Object.entries(groupedTemplates).map(([moduleType, groupTemplates]) => (
                        <div key={moduleType} className="space-y-3">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    {MODULE_TYPE_LABELS[moduleType] || moduleType}
                                    <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                        {groupTemplates.length}
                                    </span>
                                </h2>
                                {isAll && (
                                    <Link
                                        href={`/admin/templates?category=${moduleType}`}
                                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        查看全部 &rarr;
                                    </Link>
                                )}
                            </div>

                            {groupTemplates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {groupTemplates.map((template) => {
                                        // 判断创建方式
                                        const creationMethod = template.isAIGenerated ? 'ai' : 'visual';

                                        return (
                                            <div
                                                key={template.id}
                                                className="group relative flex flex-col bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                            >
                                                {/* Preview Area Placeholder - Reduced height */}
                                                <div className="h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg border-b border-gray-100 flex items-center justify-center relative overflow-hidden group-hover:from-blue-50 group-hover:to-blue-100 transition-colors">
                                                    <div className="text-gray-300">
                                                        <LayoutGrid className="w-8 h-8 opacity-40" />
                                                    </div>

                                                    {/* Creation Method Badge */}
                                                    <div className="absolute top-2 right-2">
                                                        {creationMethod === 'visual' ? (
                                                            <span className="px-2 py-0.5 bg-purple-500 text-white rounded text-xs font-medium shadow-sm flex items-center gap-1">
                                                                <Layout className="w-3 h-3" />
                                                                可视化搭建
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded text-xs font-medium shadow-sm flex items-center gap-1">
                                                                <Code className="w-3 h-3" />
                                                                AI 智能生成
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="absolute bottom-2 left-2">
                                                        <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded text-xs font-medium text-gray-600 border border-gray-200/50">
                                                            v{template.version}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content Area - Reduced padding */}
                                                <div className="p-4 flex-1 flex flex-col">
                                                    <div className="mb-3">
                                                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1 text-sm" title={template.name}>
                                                            {template.name}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                            {template.description || '暂无描述信息...'}
                                                        </p>
                                                    </div>

                                                    <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between gap-2">
                                                        <div className="flex items-center text-xs text-gray-400 gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(template.createdAt).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                                                        </div>

                                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {/* Smart edit button */}
                                                            {creationMethod === 'visual' ? (
                                                                <Link
                                                                    href={`/admin/templates/edit/${template.id}`}
                                                                    className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                                                    title="可视化编辑"
                                                                >
                                                                    <Layout className="w-4 h-4" />
                                                                </Link>
                                                            ) : (
                                                                <Link
                                                                    href={`/admin/templates/${template.id}`}
                                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                                    title="编辑代码"
                                                                >
                                                                    <Code className="w-4 h-4" />
                                                                </Link>
                                                            )}

                                                            <DeleteTemplateButton id={template.id} name={template.name} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                                            <LayoutGrid className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                                            暂无 {MODULE_TYPE_LABELS[moduleType]} 模板
                                        </h3>
                                        <p className="text-xs text-gray-500 mb-4">
                                            还没有创建任何模板，点击下方按钮开始创建
                                        </p>
                                        <Link
                                            href="/admin/templates/create"
                                            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-3 h-3 mr-1.5" />
                                            创建 {MODULE_TYPE_LABELS[moduleType]} 模板
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {Object.keys(groupedTemplates).length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <LayoutGrid className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">没有找到相关模板</h3>
                            <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
                                当前分类下还没有任何模板数据。您可以创建一个新模板来开始。
                            </p>
                            <Link
                                href="/admin/templates/create"
                                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                创建新模板
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
