import { registerSection } from '@/lib/sections/registry';
import { Contact12Section } from './Contact12Section';

registerSection({
    type: 'contact-12', name: '分割背景', description: '左深右浅分割布局', category: 'contact',
    component: Contact12Section,
    defaultData: { title: '联系我们', subtitle: '期待与您合作', address: '北京市朝阳区xxx路', phone: '400-000-0000', email: 'contact@company.com', buttonText: '提交咨询' },
    defaultStyle: { leftBackground: '#1e40af', rightBackground: '#f8fafc', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, buttonText: { type: 'text', label: '按钮文字' } },
        style: { leftBackground: { type: 'color', label: '左侧背景' }, rightBackground: { type: 'color', label: '右侧背景' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '按钮颜色' } }
    }
});
