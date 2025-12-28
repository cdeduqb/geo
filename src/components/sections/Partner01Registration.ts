import { registerSection } from '@/lib/sections/registry';
import { Partner01Section } from './Partner01Section';

registerSection({
    type: 'partner-01', name: '简约合作伙伴', description: '灰度Logo展示', category: 'marketing',
    component: Partner01Section,
    defaultData: { title: '合作伙伴', subtitle: '值得信赖的企业选择', partners: [{ name: '阿里巴巴', logo: '' }, { name: '腾讯', logo: '' }, { name: '百度', logo: '' }, { name: '字节跳动', logo: '' }, { name: '华为', logo: '' }] },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, partners: { type: 'list', label: '合作伙伴', itemSchema: { name: { type: 'text', label: '名称' }, logo: { type: 'image', label: 'Logo' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
