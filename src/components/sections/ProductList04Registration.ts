import { registerSection } from '@/lib/sections/registry';
import { ProductList04Section } from './ProductList04Section';

registerSection({
    type: 'productlist-04', name: '横向产品列表', description: '横向排列产品卡片', category: 'data',
    component: ProductList04Section,
    defaultData: { title: '产品推荐', subtitle: '', categoryId: '', limit: 4 },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, categoryId: { type: 'text', label: '分类ID' }, limit: { type: 'number', label: '显示数量' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
