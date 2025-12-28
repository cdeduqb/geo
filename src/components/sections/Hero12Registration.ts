import { registerSection } from '@/lib/sections/registry';
import { Hero12Section } from './Hero12Section';

registerSection({
    type: 'hero-12',
    name: '视频弹窗横幅',
    description: '包含封面图和弹窗播放功能的视频展示区',
    category: 'layout',
    component: Hero12Section,
    defaultData: {
        title: '看见未来的无限可能',
        subtitle: '通过短短两分钟的视频，了解我们如何改变行业规则。',
        coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
        btnText: '观看宣传片'
    },
    defaultStyle: {
        backgroundColor: '#111827',
        textColor: '#ffffff',
        accentColor: '#3b82f6',
        overlayOpacity: 0.3
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            coverImage: { type: 'image', label: '视频封面图' },
            videoUrl: { type: 'text', label: '视频嵌入链接 (URL)' },
            btnText: { type: 'text', label: '播放按钮文案' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮颜色' },
            overlayOpacity: { type: 'number', label: '封面遮罩透明度 (0-1)' } as any
        }
    }
});
