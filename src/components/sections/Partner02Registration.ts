import { registerSection } from '@/lib/sections/registry';
import { Partner02Section } from './Partner02Section';

registerSection({
    type: 'partner-02', name: '暗色合作伙伴', description: '暗色网格展示', category: 'marketing',
    component: Partner02Section,
    defaultData: { title: '我们的客户', subtitle: '', partners: [{ name: '公司A', logo: '' }, { name: '公司B', logo: '' }, { name: '公司C', logo: '' }, { name: '公司D', logo: '' }, { name: '公司E', logo: '' }, { name: '公司F', logo: '' }] },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, partners: { type: 'list', label: '合作伙伴', itemSchema: { name: { type: 'text', label: '名称' }, logo: { type: 'image', label: 'Logo' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
