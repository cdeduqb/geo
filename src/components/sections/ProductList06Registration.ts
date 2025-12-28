import { registerSection } from '@/lib/sections/registry';
import { ProductList06Section } from './ProductList06Section';

registerSection({
    type: 'productlist-06', name: '大卡片产品', description: '大图展示产品详情', category: 'data',
    component: ProductList06Section,
    defaultData: { title: '主打产品', subtitle: '', categoryId: '', limit: 3 },
    defaultStyle: { backgroundColor: '#fdf2f8', textColor: '#111827', accentColor: '#ec4899' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, categoryId: { type: 'text', label: '分类ID' }, limit: { type: 'number', label: '显示数量' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
