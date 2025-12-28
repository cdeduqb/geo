import { registerSection } from '@/lib/sections/registry';
import { ProductList02Section } from './ProductList02Section';

registerSection({
    type: 'productlist-02', name: '现代产品列表', description: '现代风格产品卡片', category: 'data',
    component: ProductList02Section,
    defaultData: { title: '热门产品', subtitle: '', categoryId: '', limit: 4 },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, categoryId: { type: 'text', label: '分类ID' }, limit: { type: 'number', label: '显示数量' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
