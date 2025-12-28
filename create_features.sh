#!/bin/bash

# Features08
cat > src/components/sections/Features08Section.tsx << 'EOF'
'use client';
import { SectionProps } from '@/lib/sections/registry';

export const Features08Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, features = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>
                <div className="space-y-16">
                    {features.map((feature: any, index: number) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
                            <div className="md:w-1/2">
                                {feature.image && <img src={feature.image} alt={feature.title} className="rounded-2xl shadow-xl w-full" />}
                            </div>
                            <div className="md:w-1/2">
                                <h3 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{feature.title}</h3>
                                <p className="text-lg opacity-70 mb-6" style={{ color: textColor }}>{feature.description}</p>
                                {feature.link && (
                                    <a href={feature.link} className="inline-flex items-center gap-2 font-semibold" style={{ color: accentColor }}>
                                        {feature.linkText || '了解更多'} →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
EOF

cat > src/components/sections/Features08Registration.ts << 'EOF'
import { registerSection } from '@/lib/sections/registry';
import { Features08Section } from './Features08Section';

registerSection({
    type: 'features-08',
    name: '左右交替式',
    description: '图文左右交替展示的功能介绍',
    category: 'content',
    component: Features08Section,
    defaultData: {
        title: '产品特色',
        subtitle: '强大功能，助力业务增长',
        features: [
            { title: '智能分析', description: '基于AI的智能数据分析，洞察业务趋势', link: '#', linkText: '了解更多' },
            { title: '团队协作', description: '高效的团队协作工具，提升工作效率', link: '#', linkText: '了解更多' }
        ]
    },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            features: { type: 'list', label: '功能列表' } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' }
        }
    }
});
EOF

echo "Features08 created"
