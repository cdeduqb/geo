import { registerSection } from '@/lib/sections/registry';
import { Social03Section } from './Social03Section';

registerSection({
    type: 'social-03',
    name: '横向滚动',
    description: '可横向滚动的社交媒体卡片',
    category: 'contact',
    component: Social03Section,
    defaultData: {
        title: '我们的社交媒体',
        subtitle: '滑动查看更多平台',
        socials: [
            { name: '微信公众号', followers: '10万粉丝', description: '每日分享行业资讯', url: '#', color: '#07c160' },
            { name: '微博', followers: '50万粉丝', description: '热点话题互动', url: '#', color: '#e6162d' },
            { name: '抖音', followers: '100万粉丝', description: '短视频内容创作', url: '#', color: '#000000' },
            { name: '小红书', followers: '30万粉丝', description: '生活方式分享', url: '#', color: '#fe2c55' },
            { name: 'B站', followers: '20万粉丝', description: '深度内容创作', url: '#', color: '#00a1d6' }
        ]
    },
    defaultStyle: { backgroundColor: '#1f2937', textColor: '#ffffff', cardBackground: '#374151' },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            socials: { type: 'list', label: '社交账号', itemSchema: { name: { type: 'text', label: '名称' }, followers: { type: 'text', label: '粉丝数' }, description: { type: 'textarea', label: '描述' }, url: { type: 'link', label: '链接' }, color: { type: 'color', label: '品牌色' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, cardBackground: { type: 'color', label: '卡片背景' } }
    }
});
