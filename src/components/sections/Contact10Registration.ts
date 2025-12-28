import { registerSection } from '@/lib/sections/registry';
import { Contact10Section } from './Contact10Section';

registerSection({
    type: 'contact-10', name: '商务双栏', description: '高端商务风格左信息右表单', category: 'contact',
    component: Contact10Section,
    defaultData: { title: '联系我们', subtitle: '期待与您合作', address: '北京市朝阳区xxx路', phone: '400-000-0000', email: 'contact@company.com', hours: '周一至周五 9:00-18:00', buttonText: '发送咨询' },
    defaultStyle: { backgroundColor: '#faf5ff', textColor: '#6b21a8', accentColor: '#a855f7', cardBackground: '#ffffff' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, hours: { type: 'text', label: '营业时间' }, buttonText: { type: 'text', label: '按钮文字' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' }, cardBackground: { type: 'color', label: '卡片背景' } }
    }
});
