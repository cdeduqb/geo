import { registerSection, SectionProps } from '@/lib/sections/registry';

export const TimelineSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, items } = data;
    const { backgroundColor = 'bg-gray-50', padding = 'py-20' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900  mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600  max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Center Line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gray-200 " />

                    <div className="space-y-12" itemScope itemType="http://schema.org/ItemList">
                        {items?.map((item: any, index: number) => (
                            <div
                                key={index}
                                className={`relative flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}
                                itemProp="itemListElement"
                                itemScope
                                itemType="http://schema.org/ListItem"
                            >
                                <meta itemProp="position" content={String(index + 1)} />
                                {/* Content */}
                                <div className="w-1/2 px-8">
                                    <div className={`bg-white  p-6 rounded-xl shadow-sm border border-gray-100  ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                                        <span className="inline-block px-3 py-1 bg-blue-100  text-blue-600  text-sm font-bold rounded-full mb-3">
                                            {item.date}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900  mb-2" itemProp="name">{item.title}</h3>
                                        <p className="text-gray-600  text-sm" itemProp="description">{item.description}</p>
                                    </div>
                                </div>

                                {/* Dot */}
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white  shadow-sm z-10" />

                                {/* Empty space for balance */}
                                <div className="w-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'timeline',
    name: '时间轴',
    description: '展示发展历程或路线图',
    category: 'content',
    component: TimelineSection,
    defaultData: {
        title: '我们的发展历程',
        subtitle: '从创立之初到现在的每一个重要里程碑',
        items: [
            {
                date: '2024 Q1',
                title: '全球化扩张',
                description: '在北美和欧洲设立分公司，正式开启全球化战略布局。'
            },
            {
                date: '2023 Q4',
                title: '用户突破百万',
                description: '注册用户数突破100万大关，成为行业领先的解决方案提供商。'
            },
            {
                date: '2023 Q1',
                title: 'A轮融资成功',
                description: '获得顶级风投机构数千万美元投资，加速产品研发和市场推广。'
            },
            {
                date: '2022',
                title: '公司成立',
                description: '核心团队组建完成，发布产品 1.0 版本，获得首批种子用户。'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-gray-50',
        padding: 'py-20'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            items: { type: 'list', label: '时间节点列表' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '浅灰', value: 'bg-gray-50' },
                    { label: '白色', value: 'bg-white' }
                ]
            }
        }
    }
});
