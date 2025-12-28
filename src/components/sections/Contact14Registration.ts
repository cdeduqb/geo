import { registerSection } from '@/lib/sections/registry';
import { Contact14Section } from './Contact14Section';

registerSection({
    type: 'contact-14', name: '步骤指引', description: '左侧步骤右侧表单', category: 'contact',
    component: Contact14Section,
    defaultData: { title: '联系流程', subtitle: '三步轻松咨询', steps: [{ title: '发送留言', description: '填写表单' }, { title: '获得回复', description: '1日内回复' }, { title: '沟通方案', description: '制定方案' }], buttonText: '提交' },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#6366f1' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, steps: { type: 'list', label: '步骤', itemSchema: { title: { type: 'text', label: '标题' }, description: { type: 'text', label: '描述' } } } as any, buttonText: { type: 'text', label: '按钮文字' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
