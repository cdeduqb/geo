import { registerSection } from '@/lib/sections/registry';
import { Contact13Section } from './Contact13Section';

registerSection({
    type: 'contact-13', name: '玻璃态', description: '玻璃拟态风格表单', category: 'contact',
    component: Contact13Section,
    defaultData: { title: '联系我们', subtitle: '期待您的来信', address: '北京市朝阳区xxx路', phone: '400-000-0000', buttonText: '提交', backgroundImage: '' },
    defaultStyle: { accentColor: '#ec4899' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, buttonText: { type: 'text', label: '按钮文字' }, backgroundImage: { type: 'image', label: '背景图片' } },
        style: { accentColor: { type: 'color', label: '按钮颜色' } }
    }
});
