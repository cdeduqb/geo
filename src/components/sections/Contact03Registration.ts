import { registerSection } from '@/lib/sections/registry';
import { Contact03Section } from './Contact03Section';

registerSection({
    type: 'contact-03', name: '带留言表单', description: '联系信息+在线留言表单', category: 'contact',
    component: Contact03Section,
    defaultData: { title: '在线咨询', subtitle: '留下您的信息，我们会尽快回复', address: '北京市朝阳区xxx路xxx号', phone: '400-000-0000', email: 'contact@company.com' },
    defaultStyle: { backgroundColor: '#1f2937', textColor: '#ffffff', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '按钮颜色' } }
    }
});
