import { registerSection } from '@/lib/sections/registry';
import { Contact06Section } from './Contact06Section';

registerSection({
    type: 'contact-06', name: '背景表单', description: '全屏背景图+联系表单', category: 'contact',
    component: Contact06Section,
    defaultData: { title: '联系我们', subtitle: '我们期待您的来信', address: '北京市朝阳区xxx路xxx号', phone: '400-000-0000', buttonText: '发送留言', backgroundImage: '' },
    defaultStyle: { textColor: '#ffffff', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, buttonText: { type: 'text', label: '按钮文字' }, backgroundImage: { type: 'image', label: '背景图片' } },
        style: { textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
