'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Layout, Type, FileText, Box, Home, Info, Phone, HelpCircle, ShoppingBag, Server, File } from 'lucide-react';

const CATEGORY_GROUPS = [
    {
        title: '概览',
        items: [
            { id: 'ALL', label: '全部模版', icon: Layout },
        ]
    },
    {
        title: '基础组件',
        items: [
            { id: 'HEADER', label: '页眉', icon: Type },
            { id: 'FOOTER', label: '页脚', icon: Box },
        ]
    },
    {
        title: '页面布局',
        items: [
            { id: 'HOME_PAGE', label: '首页页面', icon: Home },
            { id: 'ARTICLE_PAGE', label: '文章页面', icon: FileText },
            { id: 'ABOUT_PAGE', label: '关于我们', icon: Info },
            { id: 'CONTACT_PAGE', label: '联系我们', icon: Phone },
            { id: 'PRODUCT_PAGE', label: '产品页面', icon: ShoppingBag },
            { id: 'SERVICE_PAGE', label: '服务页面', icon: Server },
            { id: 'FAQ_PAGE', label: '常见问题', icon: HelpCircle },
            { id: 'CUSTOM_PAGE', label: '自定义页面', icon: File },
        ]
    }
];

export default function TemplateCategoryNav() {
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category') || 'ALL';

    return (
        <div className="w-64 flex-shrink-0">
            <div className="sticky top-6 space-y-8">
                {CATEGORY_GROUPS.map((group, groupIndex) => (
                    <div key={groupIndex}>
                        {group.title && (
                            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {group.title}
                            </h3>
                        )}
                        <nav className="space-y-1">
                            {group.items.map((category) => {
                                const Icon = category.icon;
                                const isActive = currentCategory === category.id;

                                return (
                                    <Link
                                        key={category.id}
                                        href={category.id === 'ALL' ? '/admin/templates' : `/admin/templates?category=${category.id}`}
                                        className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <Icon
                                            className={`flex-shrink-0 -ml-0.5 mr-3 h-4 w-4 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                                                }`}
                                        />
                                        <span className="truncate">{category.label}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                ))}
            </div>
        </div>
    );
}
