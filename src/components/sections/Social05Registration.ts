import { registerSection } from '@/lib/sections/registry';
import { Social05Section } from './Social05Section';

registerSection({
    type: 'social-05',
    name: '底部横条',
    description: '适合放在页面底部的社交媒体横条',
    category: 'contact',
    component: Social05Section,
    defaultData: {
        title: '关注我们',
        socials: [
            { name: '微信公众号', url: '#', color: '#07c160' },
            { name: '微博', url: '#', color: '#e6162d' },
            { name: '抖音', url: '#', color: '#000000' },
            { name: '小红书', url: '#', color: '#fe2c55' }
        ]
    },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#ffffff', hoverColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            socials: { type: 'list', label: '社交媒体', itemSchema: { name: { type: 'text', label: '名称' }, url: { type: 'link', label: '链接' }, color: { type: 'color', label: '图标颜色' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, hoverColor: { type: 'color', label: '悬浮颜色' } }
    }
});
