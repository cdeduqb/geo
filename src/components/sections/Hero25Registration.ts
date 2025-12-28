import { registerSection } from '@/lib/sections/registry';
import { Hero25Section } from './Hero25Section';

registerSection({
    type: 'hero-25',
    name: '悬浮透视卡片',
    description: '鼠标互动控制卡片3D旋转，增强视觉深度和趣味性',
    category: 'layout',
    component: Hero25Section,
    defaultData: {
        title: 'Design at Scale',
        subtitle: 'Experience the next dimension of interface design.',
        btnText: 'Get Started',
        btnLink: '#',
        cardImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#8b5cf6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            cardImage: { type: 'image', label: '3D卡片主图' },
            badgeText: { type: 'text', label: '悬浮徽章文案' },
            statLabel: { type: 'text', label: '统计卡片标签' },
            statValue: { type: 'text', label: '统计卡片数值' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮/装饰色' }
        }
    }
});
