import { registerSection } from '@/lib/sections/registry';
import { DataTable02Section } from './DataTable02Section';

registerSection({
    type: 'datatable-02', name: '现代数据表格', description: '圆角卡片式表格', category: 'data',
    component: DataTable02Section,
    defaultData: {
        title: '业绩报表', subtitle: '',
        headers: ['月份', '销售额', '订单数', '增长率'],
        rows: [
            { cells: ['1月', '¥120,000', '1,200', '+15%'] },
            { cells: ['2月', '¥135,000', '1,350', '+12%'] },
            { cells: ['3月', '¥150,000', '1,500', '+11%'] }
        ]
    },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            headers: { type: 'textarea', label: '表头（逗号分隔）' },
            rows: { type: 'list', label: '数据行', itemSchema: { cells: { type: 'textarea', label: '单元格（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
