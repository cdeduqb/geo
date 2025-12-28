import { registerSection } from '@/lib/sections/registry';
import { Hero32Section } from './Hero32Section';

registerSection({
    type: 'hero-32',
    name: '电影感视频轮播',
    description: '全屏视频背景切换，带来沉浸式视觉体验，支持主副标题和按钮跳转',
    category: 'layout',
    component: Hero32Section,
    defaultData: {
        slides: [
            {
                title: 'CINEMATIC',
                subtitle: 'Experience the power of visual storytelling.',
                btnText: 'GET STARTED',
                btnLink: '#',
                image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
            }
        ]
    },
    defaultStyle: {
        overlayOpacity: 0.5,
        textColor: '#ffffff',
        accentColor: '#e11d48'
    },
    schema: {
        data: {
            slides: {
                type: 'list',
                label: '轮播项列表',
                itemSchema: {
                    title: { type: 'text', label: '主标题' },
                    subtitle: { type: 'textarea', label: '副标题' },
                    image: { type: 'image', label: '背景图片/视频封面' },
                    video: { type: 'text', label: '背景视频链接 (MP4)' },
                    btnText: { type: 'text', label: '按钮文案 (留空不显示)' },
                    btnLink: { type: 'link', label: '按钮链接' },
                    btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
                }
            } as any
        },
        style: {
            overlayOpacity: { type: 'number', label: '遮罩透明度 (0-1)' } as any,
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮/高亮色' }
        }
    }
});
