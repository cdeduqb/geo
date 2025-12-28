import { registerSection } from '@/lib/sections/registry';
import { Hero31Section } from './Hero31Section';

registerSection({
    type: 'hero-31',
    name: '沉浸式全屏轮播',
    description: '全屏背景且带有淡入淡出动画的轮播，视觉冲击力强',
    category: 'layout',
    component: Hero31Section,
    defaultData: {
        slides: [
            {
                image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                title: '探索无限可能',
                subtitle: '在广阔的自然中寻找灵感，开启属于你的冒险之旅。',
                btnText: '了解更多'
            },
            {
                image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
                title: '宁静致远',
                subtitle: '远离城市的喧嚣，感受内心的平静与祥和。',
                btnText: ''
            }
        ]
    },
    defaultStyle: {
        textColor: '#ffffff',
        accentColor: '#3b82f6',
        overlayOpacity: 0.3
    },
    schema: {
        data: {
            slides: {
                type: 'list',
                label: '轮播项列表',
                itemSchema: {
                    image: { type: 'image', label: '背景图片' },
                    title: { type: 'text', label: '主标题' },
                    subtitle: { type: 'textarea', label: '副标题' },
                    btnText: { type: 'text', label: '按钮文案 (留空不显示)' },
                    btnLink: { type: 'link', label: '按钮链接' },
                    btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
                }
            } as any
        },
        style: {
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮/指示器颜色' },
            overlayOpacity: { type: 'number', label: '遮罩透明度(0-1)' } as any
        }
    }
});
