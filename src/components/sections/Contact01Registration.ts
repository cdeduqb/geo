import { registerSection } from '@/lib/sections/registry';
import { Contact01Section } from './Contact01Section';

registerSection({
    type: 'contact-01', name: '经典三栏', description: '地址+电话+邮箱三栏布局', category: 'contact',
    component: Contact01Section,
    defaultData: { title: '联系我们', subtitle: '我们随时为您提供支持', address: '北京市朝阳区xxx路xxx号', phone: '400-000-0000', email: 'contact@company.com', hours: '周一至周五 9:00-18:00' },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, hours: { type: 'text', label: '营业时间' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
