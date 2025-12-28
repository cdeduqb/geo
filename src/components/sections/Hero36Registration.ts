import { registerSection } from '@/lib/sections/registry';
import { Hero36Section } from './Hero36Section';

registerSection({
    type: 'hero-36',
    name: 'SaaS仪表盘展示',
    description: '模拟浏览器窗口展示SaaS后台或应用截图，适合B端产品',
    category: 'layout',
    component: Hero36Section,
    defaultData: {
        title: 'Analytics Simplified',
        subtitle: 'Stop wrestling with spreadsheets. Start visualizing your success.',
        btnText: 'Start Free Trial',
        btnLink: '#',
        dashboardImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2600&q=80'
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#2563eb'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            dashboardImage: { type: 'image', label: '仪表盘/系统截图' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮颜色' }
        }
    }
});
