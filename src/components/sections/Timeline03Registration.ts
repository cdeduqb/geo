import { registerSection } from '@/lib/sections/registry';
import { Timeline03Section } from './Timeline03Section';

registerSection({
    type: 'timeline-03',
    name: '横向时间轴',
    description: '横向展示的时间轴',
    category: 'content',
    component: Timeline03Section,
    defaultData: {
        title: '产品路线图',
        subtitle: '持续创新，不断进步',
        events: [
            { date: 'Q1 2024', title: '功能升级', description: '推出全新UI设计和核心功能优化' },
            { date: 'Q2 2024', title: 'AI集成', description: '引入人工智能技术，提升用户体验' },
            { date: 'Q3 2024', title: '移动端', description: '发布移动应用，随时随地使用' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#fef3c7',
        textColor: '#111827',
        accentColor: '#f59e0b'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            events: {
                type: 'list',
                label: '事件列表',
                itemSchema: {
                    date: { type: 'text', label: '日期/阶段' },
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
