'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { Check } from 'lucide-react';

export const PricingSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, plans } = data;
    const { backgroundColor = 'bg-white', padding = 'py-24' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900  mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600  max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" itemScope itemType="http://schema.org/OfferCatalog">
                    {plans?.map((plan: any, index: number) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${plan.isPopular
                                ? 'border-blue-600 shadow-xl bg-white '
                                : 'border-gray-200  bg-white '
                                }`}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Offer"
                        >
                            <meta itemProp="url" content="#" />
                            <meta itemProp="priceCurrency" content="CNY" />
                            <meta itemProp="price" content={String(plan.price)} />
                            {plan.isPopular && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">{t('pricing.mostPopular')}</div>
                            )}
                            <h3 className="text-xl font-bold text-gray-900  mb-2" itemProp="name">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-gray-900 ">¥{plan.price}</span>
                                <span className="text-gray-500">/{plan.period}</span>
                            </div>
                            <p className="text-gray-600  mb-8 text-sm" itemProp="description">{plan.description}</p>

                            <ul className="space-y-4 mb-8">
                                {plan.features?.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 ">
                                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 rounded-lg font-medium transition-colors ${plan.isPopular
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-100  text-gray-900  hover:bg-gray-200 :bg-gray-600'
                                }`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'pricing-cards',
    name: '价格表',
    description: '展示产品定价方案',
    category: 'marketing',
    component: PricingSection,
    defaultData: {
        title: '简单的定价',
        subtitle: '选择最适合您的方案',
        plans: [
            {
                name: '基础版',
                price: '99',
                period: '月',
                description: '适合个人开发者和小型项目',
                buttonText: '开始试用',
                isPopular: false,
                features: ['1 个项目', '基础 AI 生成', '社区支持']
            },
            {
                name: '专业版',
                price: '299',
                period: '月',
                description: '适合成长型团队和企业',
                buttonText: '立即购买',
                isPopular: true,
                features: ['10 个项目', '高级 AI 模型', '优先技术支持', '自定义域名']
            },
            {
                name: '企业版',
                price: '999',
                period: '月',
                description: '适合大规模部署和定制需求',
                buttonText: '联系销售',
                isPopular: false,
                features: ['无限项目', '私有化部署', '专属客户经理', 'SLA 保障']
            }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-24'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            plans: { type: 'list', label: '价格方案' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' }
                ]
            }
        }
    }
});
