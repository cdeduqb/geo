import { registerSection } from '@/lib/sections/registry';
import { Features06Section } from './Features06Section';

registerSection({
    type: 'features-06',
    name: '大图标背景卡片',
    description: '半透明大图标背景的现代暗色卡片式展示',
    category: 'content',
    component: Features06Section,
    defaultData: {
        title: '技术实力',
        subtitle: '领先的技术架构，优异的性能表现',
        features: [
            {
                title: '微服务架构',
                description: '采用云原生微服务架构，灵活扩展，高可用部署。',
                metric: '99.99%',
                metricLabel: '可用性保证'
            },
            {
                title: 'AI智能',
                description: '集成先进AI算法，智能分析，精准决策。',
                metric: '10倍',
                metricLabel: '效率提升'
            },
            {
                title: '全球CDN',
                description: '遍布全球的CDN节点，极速访问体验。',
                metric: '<100ms',
                metricLabel: '平均响应时间'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#06b6d4'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            features: {
                type: 'list',
                label: '功能列表',
                itemSchema: {
                    title: { type: 'text', label: '功能标题' },
                    description: { type: 'textarea', label: '功能描述' },
                    icon: { type: 'image', label: '图标图片' },
                    metric: { type: 'text', label: '指标数值' },
                    metricLabel: { type: 'text', label: '指标说明' }
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
