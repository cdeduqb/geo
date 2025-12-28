'use client';

import { SectionProps } from '@/lib/sections/registry';

interface DownloadCategory {
    name: string;
    items: { title: string; downloadUrl: string; fileSize?: string }[];
}

export const DownloadCenter02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, categories = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    const defaultCategories: DownloadCategory[] = categories.length > 0 ? categories : [
        {
            name: '产品资料', items: [
                { title: '产品介绍', downloadUrl: '#', fileSize: '1.5MB' },
                { title: '技术规格', downloadUrl: '#', fileSize: '800KB' },
            ]
        },
        {
            name: '使用帮助', items: [
                { title: '快速入门指南', downloadUrl: '#', fileSize: '2MB' },
                { title: '常见问题解答', downloadUrl: '#', fileSize: '500KB' },
            ]
        },
    ];

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: textColor }}>{title}</h2>}
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {defaultCategories.map((category, index) => (
                        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                            <h3 className="font-bold text-xl mb-4 pb-4 border-b border-gray-100" style={{ color: textColor }}>{category.name}</h3>
                            <ul className="space-y-3">
                                {category.items.map((item, idx) => (
                                    <li key={idx}>
                                        <a href={item.downloadUrl} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <span style={{ color: accentColor }}>📄</span>
                                                <span style={{ color: textColor }}>{item.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
                                                {item.fileSize && <span className="text-sm opacity-60" style={{ color: textColor }}>{item.fileSize}</span>}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
