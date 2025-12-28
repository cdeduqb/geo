import { registerSection } from '@/lib/sections/registry';
import { Features04Section } from './Features04Section';

registerSection({
    type: 'features-04',
    name: '图标居中简约卡片',
    description: '图标居中在顶部的简约卡片式功能展示',
    category: 'content',
    component: Features04Section,
    defaultData: {
        title: '核心优势',
        subtitle: '为您的业务提供全方位支持',
        features: [
            {
                title: '快速部署',
                description: '一键部署，3分钟即可上线，无需复杂配置。'
            },
            {
                title: '高性能',
                description: '毫秒级响应，支持高并发访问，稳定可靠。'
            },
            {
                title: '易扩展',
                description: '模块化架构，轻松添加新功能和集成。'
            },
            {
                title: '专业支持',
                description: '专业团队7x24小时技术支持和咨询服务。'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#fafafa',
        textColor: '#1f2937',
        accentColor: '#8b5cf6',
        cardBorderColor: '#e5e7eb'
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
                    icon: { type: 'image', label: '图标图片' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBorderColor: { type: 'color', label: '卡片边框色' }
        }
    }
});
