import { registerSection } from '@/lib/sections/registry';
import { Contact02Section } from './Contact02Section';

registerSection({
    type: 'contact-02', name: '左信息右地图', description: '左侧联系信息右侧嵌入地图', category: 'contact',
    component: Contact02Section,
    defaultData: { title: '来访指南', subtitle: '欢迎莅临参观', address: '北京市朝阳区xxx路xxx号', phone: '400-000-0000', email: 'contact@company.com', mapUrl: '', contacts: [{ name: '张经理', phone: '138-0000-0000' }] },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, mapUrl: { type: 'link', label: '地图嵌入链接' }, contacts: { type: 'list', label: '联系人', itemSchema: { name: { type: 'text', label: '姓名' }, phone: { type: 'text', label: '电话' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
