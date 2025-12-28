import { registerSection } from '@/lib/sections/registry';
import { ProductList01Section } from './ProductList01Section';

registerSection({
    type: 'productlist-01',
    name: '卡片式产品',
    description: '三列卡片式产品展示',
    category: 'data',
    component: ProductList01Section,
    defaultData: { title: '产品展示', subtitle: '精选产品', categoryId: '', limit: 6 },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, categoryId: { type: 'text', label: '分类ID' }, limit: { type: 'number', label: '显示数量' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
