import { registerSection, SectionProps } from '@/lib/sections/registry';

export const StatsSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { items } = data;
    const { backgroundColor = 'bg-white', padding = 'py-16' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100" itemScope itemType="http://schema.org/ItemList">
                    {items?.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="px-4"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/ListItem"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div itemProp="item" itemScope itemType="http://schema.org/PropertyValue">
                                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2" itemProp="value">
                                    {item.value}
                                </div>
                                <div className="text-gray-600 font-medium" itemProp="name">
                                    {item.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'stats-simple',
    name: '统计数据',
    description: '展示关键业务指标',
    category: 'data',
    component: StatsSection,
    defaultData: {
        items: [
            { value: '10k+', label: '活跃用户' },
            { value: '99.9%', label: '服务可用性' },
            { value: '24/7', label: '技术支持' },
            { value: '100+', label: '国家/地区' }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-16'
    },
    schema: {
        data: {
            items: { type: 'list', label: '数据项' }
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
