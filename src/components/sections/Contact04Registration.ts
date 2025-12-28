import { registerSection } from '@/lib/sections/registry';
import { Contact04Section } from './Contact04Section';

registerSection({
    type: 'contact-04', name: '多分支联系', description: '多个分公司/门店的联系信息', category: 'contact',
    component: Contact04Section,
    defaultData: { title: '全国分支机构', subtitle: '覆盖全国主要城市', branches: [{ name: '北京总部', address: '北京市朝阳区xxx路', phone: '010-12345678', email: 'beijing@company.com', hours: '9:00-18:00' }, { name: '上海分公司', address: '上海市浦东新区xxx路', phone: '021-12345678', email: 'shanghai@company.com', hours: '9:00-18:00' }, { name: '广州分公司', address: '广州市天河区xxx路', phone: '020-12345678', email: 'guangzhou@company.com', hours: '9:00-18:00' }] },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', cardBackground: '#f9fafb', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, branches: { type: 'list', label: '分支机构', itemSchema: { name: { type: 'text', label: '名称' }, address: { type: 'textarea', label: '地址' }, phone: { type: 'text', label: '电话' }, email: { type: 'text', label: '邮箱' }, hours: { type: 'text', label: '营业时间' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, cardBackground: { type: 'color', label: '卡片背景' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
