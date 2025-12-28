import { registerSection } from '@/lib/sections/registry';
import { Hero35Section } from './Hero35Section';

registerSection({
    type: 'hero-35',
    name: '异形网格轮播',
    description: 'Bento Grid 风格的不规则网格布局，适合展示系列产品或案例',
    category: 'layout',
    component: Hero35Section,
    defaultData: {
        title: 'Project Gallery',
        subtitle: 'Explore our latest work across different industries.',
        items: [
            {
                size: 'large',
                image: 'https://images.unsplash.com/photo-1593642532742-9869525da26b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'Next Gen Tech',
                desc: 'Explore the future of computing.',
                link: '#'
            },
            {
                size: 'tall',
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'Security',
                desc: 'Protect what matters.',
                link: '#'
            },
            {
                size: 'small',
                image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'AI Core',
                desc: 'Intelligence built-in.',
                link: '#'
            },
            {
                size: 'small',
                image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'Cloud',
                desc: 'Scale infinitely.',
                link: '#'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f8fafc',
        textColor: '#0f172a',
        accentColor: '#3b82f6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            items: {
                type: 'list',
                label: '网格卡片列表',
                itemSchema: {
                    title: { type: 'text', label: '标题' },
                    desc: { type: 'text', label: '描述 (Hover显示)' },
                    image: { type: 'image', label: '背景图' },
                    link: { type: 'link', label: '跳转链接' },
                    size: {
                        type: 'select',
                        label: '卡片尺寸',
                        options: [
                            { label: '小方块 (1x1)', value: 'small' },
                            { label: '大方块 (2x2)', value: 'large' },
                            { label: '竖长条 (1x2)', value: 'tall' },
                            { label: '横长条 (2x1)', value: 'wide' }
                        ]
                    }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '图标高亮色' }
        }
    }
});
