import { registerSection } from '@/lib/sections/registry';
import { Hero21Section } from './Hero21Section';

registerSection({
    type: 'hero-21',
    name: '图片对比横幅',
    description: '通过拖动滑块直观展示两张图片前后的差异',
    category: 'layout',
    component: Hero21Section,
    defaultData: {
        title: '肉眼可见的改变',
        description: '我们的后期处理技术能让您的照片瞬间焕发生机。',
        beforeImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', // Darker/Raw
        afterImage: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80&sat=100&bri=50', // Edited? (Just using same for mock, user should replace)
        beforeLabel: '处理前',
        afterLabel: '处理后'
    },
    defaultStyle: {
        backgroundColor: '#111827',
        textColor: '#ffffff',
        accentColor: '#3b82f6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            description: { type: 'textarea', label: '描述' },
            beforeImage: { type: 'image', label: 'Before 图片 (左侧)' },
            afterImage: { type: 'image', label: 'After 图片 (右侧)' },
            beforeLabel: { type: 'text', label: '左侧标签' },
            afterLabel: { type: 'text', label: '右侧标签' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色/滑块颜色' }
        }
    }
});
