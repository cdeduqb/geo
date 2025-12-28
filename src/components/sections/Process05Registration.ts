import { registerSection } from '@/lib/sections/registry';
import { Process05Section } from './Process05Section';

registerSection({
    type: 'process-05',
    name: '垂直连线步骤',
    description: '垂直连接线的详细步骤展示',
    category: 'content',
    component: Process05Section,
    defaultData: {
        title: '项目周期',
        subtitle: '完整的项目实施路线图',
        steps: [
            {
                title: '需求调研',
                description: '深入了解客户需求，分析业务场景，制定项目目标',
                icon: '1',
                duration: '1-2周',
                highlights: ['需求分析', '可行性研究', '目标制定']
            },
            {
                title: '设计规划',
                description: '制定详细技术方案，设计系统架构，规划项目时间表',
                icon: '2',
                duration: '2-3周',
                highlights: ['架构设计', '原型设计', '计划制定']
            },
            {
                title: '开发实施',
                description: '按照设计方案进行开发，定期沟通进度，及时调整',
                icon: '3',
                duration: '4-8周',
                highlights: ['编码开发', '测试验证', '迭代优化']
            },
            {
                title: '上线运维',
                description: '项目部署上线，提供技术支持，持续优化改进',
                icon: '4',
                duration: '持续',
                highlights: ['部署上线', '监控运维', '持续优化']
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#fdf2f8',
        textColor: '#111827',
        accentColor: '#ec4899',
        lineColor: '#e5e7eb'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            steps: {
                type: 'list',
                label: '步骤列表',
                itemSchema: {
                    title: { type: 'text', label: '步骤标题' },
                    description: { type: 'textarea', label: '步骤描述' },
                    icon: { type: 'text', label: '图标文字' },
                    duration: { type: 'text', label: '所需时间' },
                    highlights: { type: 'textarea', label: '亮点标签（逗号分隔）' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            lineColor: { type: 'color', label: '连线颜色' }
        }
    }
});
