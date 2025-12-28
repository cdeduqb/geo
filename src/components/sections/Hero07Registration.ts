import { registerSection } from '@/lib/sections/registry';
import { Hero07Section } from './Hero07Section';

registerSection({
    type: 'hero-07',
    name: '3D插画横幅',
    description: '活泼的3D风格插画横幅，适合创意类网站',
    category: 'layout',
    component: Hero07Section,
    defaultData: {
        title: '让灵感<br/>自由飞翔',
        subtitle: '全域魔力助您突破想象边界，创造令人惊叹的数字艺术。',
        btnText: '开始创作',
        illustration: 'https://cdni.iconscout.com/illustration/premium/thumb/3d-business-startup-2974954-2477430.png'
    },
    defaultStyle: {
        backgroundColor: '#fdf4ff',
        textColor: '#4a044e',
        accentColor: '#d946ef'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题 (支持<br/>)' },
            subtitle: { type: 'text', label: '副标题' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            illustration: { type: 'image', label: '插画图片' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮颜色' }
        }
    }
});
