import { registerSection } from '@/lib/sections/registry';
import { Hero14Section } from './Hero14Section';

registerSection({
    type: 'hero-14',
    name: '极光渐变横幅',
    description: '柔和流动的多色渐变背景，营造现代高级感',
    category: 'layout',
    component: Hero14Section,
    defaultData: {
        title: 'Luminous Design',
        subtitle: 'Unleash the power of color with our new gradient engine.',
        btnText: 'Explore More',
        btnLink: '#'
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#ffffff',
        accentColor: '#3b82f6',
        secondaryColor: '#ec4899',
        tertiaryColor: '#8b5cf6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '底部背景色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '极光色 1' },
            secondaryColor: { type: 'color', label: '极光色 2' },
            tertiaryColor: { type: 'color', label: '极光色 3' }
        }
    }
});
