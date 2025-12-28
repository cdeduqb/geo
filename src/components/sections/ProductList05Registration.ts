import { registerSection } from '@/lib/sections/registry';
import { ProductList05Section } from './ProductList05Section';

registerSection({
    type: 'productlist-05', name: '网格产品列表', description: '紧凑网格产品展示', category: 'data',
    component: ProductList05Section,
    defaultData: { title: '全部产品', subtitle: '', categoryId: '', limit: 6 },
    defaultStyle: { backgroundColor: '#ecfdf5', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, categoryId: { type: 'text', label: '分类ID' }, limit: { type: 'number', label: '显示数量' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
