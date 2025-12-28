import { registerSection } from '@/lib/sections/registry';
import { Hero41Section } from './Hero41Section';

registerSection({
    type: 'hero-41',
    name: '交互式多屏滑动',
    description: '左侧文字导航与右侧图片联动，适合展示流程或系列产品',
    category: 'layout',
    component: Hero41Section,
    defaultData: {
        title: 'WORKFLOW',
        items: [
            {
                image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'Design',
                text: 'Crafting pixel perfect experiences.',
                link: '#',
                linkText: 'Learn more'
            },
            {
                image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'Develop',
                text: 'Building robust scalable systems.',
                link: '#',
                linkText: 'Learn more'
            },
            {
                image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
                title: 'Deploy',
                text: 'Shipping global products instantly.',
                link: '#',
                linkText: 'Learn more'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        accentColor: '#ffffff'
    },
    schema: {
        data: {
            title: { type: 'text', label: '区域标题' },
            items: {
                type: 'list',
                label: '滑动项列表',
                itemSchema: {
                    title: { type: 'text', label: '标题' },
                    text: { type: 'textarea', label: '描述' },
                    image: { type: 'image', label: '配图' },
                    link: { type: 'link', label: '跳转链接' },
                    linkText: { type: 'text', label: '跳转链接文本' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '高亮/链接色' }
        }
    }
});
