import { registerSection } from '@/lib/sections/registry';
import { Timeline02Section } from './Timeline02Section';

registerSection({
    type: 'timeline-02',
    name: '中心线对称时间轴',
    description: '中心线对称布局的时间轴',
    category: 'content',
    component: Timeline02Section,
    defaultData: {
        title: '企业大事记',
        subtitle: '重要时刻回顾',
        events: [
            { date: '2018', title: '品牌创立', description: '怀揣梦想，正式成立品牌，开启创业之路' },
            { date: '2019', title: '首轮融资', description: '获得知名投资机构千万级天使轮融资' },
            { date: '2020', title: '用户突破', description: '注册用户突破100万，市场份额持续扩大' },
            { date: '2021', title: '技术创新', description: '获得多项技术专利，引领行业技术革新' },
            { date: '2022', title: '战略合作', description: '与多家世界500强企业建立战略合作关系' },
            { date: '2023', title: '上市准备', description: '启动IPO计划，迈向资本市场新征程' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#10b981'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            events: {
                type: 'list',
                label: '事件列表',
                itemSchema: {
                    date: { type: 'text', label: '日期' },
                    title: { type: 'text', label: '事件标题' },
                    description: { type: 'textarea', label: '事件描述' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' }
        }
    }
});
