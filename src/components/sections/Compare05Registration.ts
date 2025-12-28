import { registerSection } from '@/lib/sections/registry';
import { Compare05Section } from './Compare05Section';

registerSection({
    type: 'compare-05', name: '前后对比', description: '好坏对比展示', category: 'data',
    component: Compare05Section,
    defaultData: {
        title: '使用前后对比', subtitle: '',
        items: [
            { category: '效率提升', badLabel: '使用前', bad: '手动处理，耗时费力', goodLabel: '使用后', good: '自动化流程，效率提升300%' },
            { category: '成本控制', badLabel: '使用前', bad: '高昂的人力成本', goodLabel: '使用后', good: '成本降低60%' },
            { category: '数据准确', badLabel: '使用前', bad: '人为错误频发', goodLabel: '使用后', good: '准确率达99.9%' }
        ]
    },
    defaultStyle: { backgroundColor: '#ecfdf5', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            items: { type: 'list', label: '对比项', itemSchema: { category: { type: 'text', label: '分类' }, badLabel: { type: 'text', label: '差标签' }, bad: { type: 'textarea', label: '差描述' }, goodLabel: { type: 'text', label: '好标签' }, good: { type: 'textarea', label: '好描述' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
