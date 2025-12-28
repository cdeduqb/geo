import { registerSection } from '@/lib/sections/registry';
import { Partner03Section } from './Partner03Section';

registerSection({
    type: 'partner-03', name: '滚动合作伙伴', description: '无限滚动Logo', category: 'marketing',
    component: Partner03Section,
    defaultData: { title: '受到全球领先企业的信赖', partners: [{ name: 'Microsoft', logo: '' }, { name: 'Google', logo: '' }, { name: 'Amazon', logo: '' }, { name: 'Apple', logo: '' }, { name: 'Meta', logo: '' }, { name: 'Netflix', logo: '' }] },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, partners: { type: 'list', label: '合作伙伴', itemSchema: { name: { type: 'text', label: '名称' }, logo: { type: 'image', label: 'Logo' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
