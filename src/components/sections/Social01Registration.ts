import { registerSection } from '@/lib/sections/registry';
import { Social01Section } from './Social01Section';

registerSection({
    type: 'social-01',
    name: '图标网格',
    description: '经典社交媒体图标网格展示',
    category: 'contact',
    component: Social01Section,
    defaultData: {
        title: '关注我们',
        subtitle: '在社交媒体上与我们互动',
        socials: [
            { name: '微信公众号', platform: 'wechat', url: '#' },
            { name: '微博', platform: 'weibo', url: '#' },
            { name: '抖音', platform: 'douyin', url: '#' },
            { name: '小红书', platform: 'xiaohongshu', url: '#' },
            { name: 'B站', platform: 'bilibili', url: '#' },
            { name: '知乎', platform: 'zhihu', url: '#' }
        ]
    },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', iconColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            socials: { type: 'list', label: '社交媒体', itemSchema: { name: { type: 'text', label: '名称' }, platform: { type: 'select', label: '平台', options: [{ label: '微信', value: 'wechat' }, { label: '微博', value: 'weibo' }, { label: '抖音', value: 'douyin' }, { label: '小红书', value: 'xiaohongshu' }, { label: 'B站', value: 'bilibili' }, { label: '知乎', value: 'zhihu' }] }, url: { type: 'link', label: '链接' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, iconColor: { type: 'color', label: '图标颜色' } }
    }
});
