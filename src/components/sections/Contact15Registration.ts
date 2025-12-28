import { registerSection } from '@/lib/sections/registry';
import { Contact15Section } from './Contact15Section';

registerSection({
    type: 'contact-15', name: '浮动表单', description: '背景图+底部浮动表单', category: 'contact',
    component: Contact15Section,
    defaultData: { title: '联系我们', subtitle: '期待与您沟通', address: '北京市朝阳区xxx路', phone: '400-000-0000', email: 'contact@company.com', buttonText: '发送', backgroundImage: '' },
    defaultStyle: { accentColor: '#10b981' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, buttonText: { type: 'text', label: '按钮文字' }, backgroundImage: { type: 'image', label: '背景图片' } },
        style: { accentColor: { type: 'color', label: '按钮颜色' } }
    }
});
