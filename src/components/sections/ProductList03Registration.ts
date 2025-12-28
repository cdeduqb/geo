import { registerSection } from '@/lib/sections/registry';
import { ProductList03Section } from './ProductList03Section';

registerSection({
    type: 'productlist-03', name: '暗色产品列表', description: '暗色主题产品展示', category: 'data',
    component: ProductList03Section,
    defaultData: { title: '精选产品', subtitle: '', categoryId: '', limit: 3 },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#f59e0b' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, categoryId: { type: 'text', label: '分类ID' }, limit: { type: 'number', label: '显示数量' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
