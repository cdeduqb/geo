import { registerSection } from '@/lib/sections/registry';
import { Hero30Section } from './Hero30Section';

registerSection({
    type: 'hero-30',
    name: '粒子星空横幅',
    description: '背景漂浮互动的粒子网格，营造唯美科技氛围',
    category: 'layout',
    component: Hero30Section,
    defaultData: {
        title: 'CONNECTING THE DOTS',
        subtitle: '在这个万物互联的时代，我们为您构建最坚固的数字桥梁。',
        btnText: 'Start Connecting'
    },
    defaultStyle: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        accentColor: '#ffffff'
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
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '粒子/文字颜色' },
            accentColor: { type: 'color', label: '按钮边框色' }
        }
    }
});
