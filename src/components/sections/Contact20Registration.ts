import { registerSection } from '@/lib/sections/registry';
import { Contact20Section } from './Contact20Section';

registerSection({
    type: 'contact-20', name: '极简CTA', description: '极简底部CTA式表单', category: 'contact',
    component: Contact20Section,
    defaultData: { title: '开始合作', subtitle: '联系我们，开启成功之旅', phone: '400-000-0000', buttonText: '提交' },
    defaultStyle: { backgroundColor: '#18181b', textColor: '#fafafa', accentColor: '#a855f7' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, phone: { type: 'text', label: '电话' }, buttonText: { type: 'text', label: '按钮文字' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
