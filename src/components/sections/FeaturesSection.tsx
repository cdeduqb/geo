import { registerSection, SectionProps } from '@/lib/sections/registry';
import { CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, features } = data;
    const { backgroundColor = 'bg-gray-50', padding = 'py-16' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900  mb-4">
                            {title}
                        </h2>
                        {subtitle && (
                            <p className="text-lg text-gray-600  max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8" itemScope itemType="http://schema.org/ItemList">
                    {features?.map((feature: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white  p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="w-12 h-12 bg-blue-100  rounded-lg flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 " />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900  mb-2" itemProp="name">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 " itemProp="description">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'features-grid',
    name: '功能网格',
    description: '3列网格展示产品功能特性',
    category: 'content',
    component: FeaturesSection,
    defaultData: {
        title: '我们的优势',
        subtitle: '为您提供最优质的服务',
        features: [
            {
                title: '高效便捷',
                description: '简单易用的操作界面，快速上手'
            },
            {
                title: '安全可靠',
                description: '企业级安全保障，数据加密存储'
            },
            {
                title: '专业服务',
                description: '7x24小时技术支持，随时为您服务'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-gray-50',
        padding: 'py-16'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            features: { type: 'list', label: '功能列表' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' },
                    { label: '深色', value: 'bg-gray-900' }
                ]
            },
            padding: {
                type: 'select',
                label: '垂直间距',
                options: [
                    { label: '小', value: 'py-8' },
                    { label: '中', value: 'py-16' },
                    { label: '大', value: 'py-24' }
                ]
            }
        }
    }
});
