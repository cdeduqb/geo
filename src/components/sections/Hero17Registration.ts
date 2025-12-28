import { registerSection } from '@/lib/sections/registry';
import { Hero17Section } from './Hero17Section';

registerSection({
    type: 'hero-17',
    name: '交互式路线图',
    description: '带有时间轴和进度条的步骤展示，支持点击切换详情',
    category: 'layout',
    component: Hero17Section,
    defaultData: {
        title: 'Roadmap',
        subtitle: 'Our journey through time.',
        steps: [
            { year: '2023', title: 'Foundation', description: 'We laid the groundwork for our future platform.', image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
            { year: '2024', title: 'Expansion', description: 'Expanding to new markets and territories.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
            { year: '2025', title: 'Innovation', description: 'Launching our AI-driven core technology.', image: 'https://images.unsplash.com/photo-1531297461136-82lw8e29e915?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' },
            { year: '2026', title: 'Global', description: 'Reaching users in every corner of the world.', image: 'https://images.unsplash.com/photo-1526304640152-d4619684e584?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80' }
        ]
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
            steps: {
                type: 'list',
                label: '路线节点列表',
                itemSchema: {
                    year: { type: 'text', label: '年份/标签' },
                    title: { type: 'text', label: '节点标题' },
                    description: { type: 'textarea', label: '节点描述' },
                    image: { type: 'image', label: '右侧配图' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '进度条高亮色' }
        }
    }
});
