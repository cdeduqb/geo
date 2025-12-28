import { registerSection } from '@/lib/sections/registry';
import { Partner06Section } from './Partner06Section';

registerSection({
    type: 'partner-06', name: '统计合作伙伴', description: '带统计的双列', category: 'marketing',
    component: Partner06Section,
    defaultData: { title: '备受信赖', subtitle: '与众多企业建立了长期合作关系', stats: [{ value: '500+', label: '合作企业' }, { value: '50+', label: '行业覆盖' }], partners: [{ name: 'A', logo: '' }, { name: 'B', logo: '' }, { name: 'C', logo: '' }, { name: 'D', logo: '' }, { name: 'E', logo: '' }, { name: 'F', logo: '' }] },
    defaultStyle: { backgroundColor: '#fdf2f8', textColor: '#111827', accentColor: '#ec4899' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, stats: { type: 'list', label: '统计', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' } } } as any, partners: { type: 'list', label: '合作伙伴', itemSchema: { name: { type: 'text', label: '名称' }, logo: { type: 'image', label: 'Logo' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
