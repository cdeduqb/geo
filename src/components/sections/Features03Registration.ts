import { registerSection } from '@/lib/sections/registry';
import { Features03Section } from './Features03Section';

registerSection({
    type: 'features-03',
    name: '横向列表功能展示',
    description: '图标在左侧的横向列表式功能展示，支持标签和序号',
    category: 'content',
    component: Features03Section,
    defaultData: {
        title: '完整的解决方案',
        subtitle: '从规划到执行，我们为您提供端到端的专业服务',
        features: [
            {
                title: '需求分析',
                description: '深入了解您的业务需求，制定精准的解决方案，确保项目成功落地。',
                tags: ['咨询', '方案设计'],
                link: '#',
                linkText: '查看详情'
            },
            {
                title: '系统开发',
                description: '采用最新技术栈，构建高性能、可扩展的系统架构，满足业务增长需求。',
                tags: ['技术开发', '敏捷开发'],
                link: '#',
                linkText: '查看详情'
            },
            {
                title: '测试部署',
                description: '严格的质量把控和自动化测试，确保系统稳定可靠，快速上线。',
                tags: ['质量保证', 'DevOps'],
                link: '#',
                linkText: '查看详情'
            },
            {
                title: '运维支持',
                description: '7x24小时监控和技术支持，快速响应问题，保障系统持续稳定运行。',
                tags: ['技术支持', '监控告警'],
                link: '#',
                linkText: '查看详情'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#10b981',
        layout: 'two-column'
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
                    icon: { type: 'image', label: '图标图片（留空显示序号）' },
                    tags: { type: 'list', label: '标签列表' },
                    link: { type: 'text', label: '链接地址' },
                    linkText: { type: 'text', label: '链接文字' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            layout: {
                type: 'select',
                label: '布局方式',
                options: [
                    { value: 'single-column', label: '单列' },
                    { value: 'two-column', label: '双列' }
                ]
            }
        }
    }
});
