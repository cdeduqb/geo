import { registerSection } from '@/lib/sections/registry';
import { Map02Section } from './Map02Section';

registerSection({
    type: 'map-02', name: '地图+信息', description: '地图加侧边联系信息', category: 'contact',
    component: Map02Section,
    defaultData: { title: '来访指南', subtitle: '欢迎莅临参观', mapUrl: '', address: '北京市朝阳区xxx路xxx号', phone: '400-000-0000', email: 'contact@company.com', hours: '周一至周五 9:00-18:00' },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, mapUrl: { type: 'link', label: '地图嵌入链接' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, hours: { type: 'text', label: '营业时间' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
