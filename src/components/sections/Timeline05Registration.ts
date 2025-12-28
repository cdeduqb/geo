import { registerSection } from '@/lib/sections/registry';
import { Timeline05Section } from './Timeline05Section';

registerSection({
    type: 'timeline-05',
    name: '卡片式时间轴',
    description: '网格卡片展示的时间轴',
    category: 'content',
    component: Timeline05Section,
    defaultData: {
        title: '成长轨迹',
        subtitle: '每一步都值得纪念',
        events: [
            { period: '创业初期', date: '2019.01', title: '项目启动', description: '团队组建完成，正式开始产品研发', keywords: ['创新', '梦想'] },
            { period: '产品上线', date: '2019.08', title: 'V1.0发布', description: '首个产品版本上线，开始服务用户', keywords: ['里程碑'] },
            { period: '快速增长', date: '2020.05', title: '用户增长', description: '用户数量突破10万，获得市场认可', keywords: ['突破'] },
            { period: '融资成功', date: '2021.03', title: 'A轮融资', description: '完成A轮融资，加速业务拓展', keywords: ['资本', '发展'] },
            { period: '市场拓展', date: '2022.11', title: '全国布局', description: '在主要城市设立分公司，完成全国布局', keywords: ['扩张'] },
            { period: '行业领先', date: '2024.01', title: '市场第一', description: '成为行业领导者，市场份额第一', keywords: ['领先', '成功'] }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#ec4899',
        cardBgColor: '#ffffff'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            events: {
                type: 'list',
                label: '事件列表',
                itemSchema: {
                    period: { type: 'text', label: '阶段' },
                    date: { type: 'text', label: '日期' },
                    title: { type: 'text', label: '事件标题' },
                    description: { type: 'textarea', label: '事件描述' },
                    keywords: { type: 'textarea', label: '关键词（逗号分隔）' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBgColor: { type: 'color', label: '卡片背景色' }
        }
    }
});
