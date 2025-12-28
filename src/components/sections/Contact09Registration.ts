import { registerSection } from '@/lib/sections/registry';
import { Contact09Section } from './Contact09Section';

registerSection({
    type: 'contact-09', name: '简约居中', description: '居中信息+圆角表单', category: 'contact',
    component: Contact09Section,
    defaultData: { title: '联系我们', subtitle: '有任何问题欢迎留言', address: '北京市朝阳区xxx路', phone: '400-000-0000', buttonText: '提交留言' },
    defaultStyle: { backgroundColor: '#f0fdf4', textColor: '#166534', accentColor: '#22c55e' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, buttonText: { type: 'text', label: '按钮文字' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
