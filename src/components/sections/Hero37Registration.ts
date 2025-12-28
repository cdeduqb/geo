import { registerSection } from '@/lib/sections/registry';
import { Hero37Section } from './Hero37Section';

registerSection({
    type: 'hero-37',
    name: '粗犷排版横幅',
    description: '巨大的文字排版，鼠标悬停时揭示背景图，极具视觉冲击力',
    category: 'layout',
    component: Hero37Section,
    defaultData: {
        title: 'BOLD MOVE',
        btnText: 'Make It Happen',
        btnLink: '#',
        revealImage: 'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    },
    defaultStyle: {
        backgroundColor: '#ef4444',
        textColor: '#ffffff',
        accentColor: '#000000'
    },
    schema: {
        data: {
            title: { type: 'text', label: '超大标题 (推荐简短大写)' },
            revealImage: { type: 'image', label: '悬停揭示背景图' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '默认背景色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮颜色' }
        }
    }
});
