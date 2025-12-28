import { registerSection } from '@/lib/sections/registry';
import { Social02Section } from './Social02Section';

registerSection({
    type: 'social-02',
    name: '二维码卡片',
    description: '带二维码展示的社交媒体卡片',
    category: 'contact',
    component: Social02Section,
    defaultData: {
        title: '扫码关注',
        subtitle: '使用手机扫描二维码关注我们',
        socials: [
            { name: '微信公众号', qrcode: '', description: '扫码关注公众号', id: '', color: '#07c160' },
            { name: '企业微信', qrcode: '', description: '扫码添加客服', id: '', color: '#1890ff' },
            { name: '抖音', qrcode: '', description: '扫码关注抖音', id: '', color: '#000000' }
        ]
    },
    defaultStyle: { backgroundColor: '#f3f4f6', textColor: '#111827', cardBackground: '#ffffff' },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            socials: { type: 'list', label: '社交账号', itemSchema: { name: { type: 'text', label: '名称' }, qrcode: { type: 'image', label: '二维码' }, description: { type: 'text', label: '描述' }, id: { type: 'text', label: '账号ID' }, color: { type: 'color', label: '品牌色' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, cardBackground: { type: 'color', label: '卡片背景' } }
    }
});
