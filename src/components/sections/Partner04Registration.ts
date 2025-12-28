import { registerSection } from '@/lib/sections/registry';
import { Partner04Section } from './Partner04Section';

registerSection({
    type: 'partner-04', name: '卡片合作伙伴', description: '卡片式Logo展示', category: 'marketing',
    component: Partner04Section,
    defaultData: { title: '战略合作伙伴', subtitle: '与行业领导者携手共创', partners: [{ name: '合作A', logo: '' }, { name: '合作B', logo: '' }, { name: '合作C', logo: '' }, { name: '合作D', logo: '' }, { name: '合作E', logo: '' }] },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, partners: { type: 'list', label: '合作伙伴', itemSchema: { name: { type: 'text', label: '名称' }, logo: { type: 'image', label: 'Logo' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
