import { registerSection } from '@/lib/sections/registry';
import { Contact19Section } from './Contact19Section';

registerSection({
    type: 'contact-19', name: '表单+图片', description: '左侧表单右侧图片', category: 'contact',
    component: Contact19Section,
    defaultData: { title: '联系我们', subtitle: '期待与您合作', address: '北京市朝阳区xxx路', phone: '400-000-0000', buttonText: '提交留言', image: '' },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#ef4444' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, buttonText: { type: 'text', label: '按钮文字' }, image: { type: 'image', label: '右侧图片' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
