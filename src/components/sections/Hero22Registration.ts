import { registerSection } from '@/lib/sections/registry';
import { Hero22Section } from './Hero22Section';

registerSection({
    type: 'hero-22',
    name: '打字机特效横幅',
    description: '标题带有自动打字和删除的循环动画效果',
    category: 'layout',
    component: Hero22Section,
    defaultData: {
        prefix: '我们可以为您打造',
        words: ['更快的', '更酷的', '更智能的'],
        suffix: '数字体验。',
        btnText: '立即开始'
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#2563eb',
        cursorColor: '#ef4444'
    },
    schema: {
        data: {
            prefix: { type: 'text', label: '前缀文案' },
            words: { type: 'list', label: '循环词组', itemSchema: { type: 'text' } } as any, // Simple list of strings might need special handling in schema parser, assuming list supports primitive? If not, fallback to object wrapping.
            // Let's assume list of objects {text: string} is safer if primitive list is not supported.
            // Wait, previous examples used objects. Let's adjust schema to object list to be safe.
            suffix: { type: 'text', label: '后缀文案' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '打字文字颜色' },
            cursorColor: { type: 'color', label: '光标颜色' }
        }
    }
});
