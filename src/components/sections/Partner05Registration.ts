import { registerSection } from '@/lib/sections/registry';
import { Partner05Section } from './Partner05Section';

registerSection({
    type: 'partner-05', name: '列表合作伙伴', description: '带描述的列表', category: 'marketing',
    component: Partner05Section,
    defaultData: { title: '合作机构', subtitle: '', partners: [{ name: '科技公司A', description: '行业领先的科技企业', logo: '', url: '#' }, { name: '投资机构B', description: '知名风险投资机构', logo: '', url: '#' }, { name: '研究院C', description: '国家级研究机构', logo: '', url: '#' }] },
    defaultStyle: { backgroundColor: '#ecfdf5', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, partners: { type: 'list', label: '合作伙伴', itemSchema: { name: { type: 'text', label: '名称' }, description: { type: 'text', label: '描述' }, logo: { type: 'image', label: 'Logo' }, url: { type: 'link', label: '链接' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
