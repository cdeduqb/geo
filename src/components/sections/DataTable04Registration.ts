import { registerSection } from '@/lib/sections/registry';
import { DataTable04Section } from './DataTable04Section';

registerSection({
    type: 'datatable-04', name: '居中数据表格', description: '内容居中的表格', category: 'data',
    component: DataTable04Section,
    defaultData: {
        title: '对比数据', subtitle: '',
        headers: ['指标', '上季度', '本季度', '同比'],
        rows: [
            { cells: ['收入', '¥500万', '¥650万', '+30%'] },
            { cells: ['用户', '10万', '15万', '+50%'] },
            { cells: ['转化率', '2.5%', '3.2%', '+28%'] }
        ]
    },
    defaultStyle: { backgroundColor: '#ede9fe', textColor: '#111827', accentColor: '#8b5cf6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            headers: { type: 'textarea', label: '表头（逗号分隔）' },
            rows: { type: 'list', label: '数据行', itemSchema: { cells: { type: 'textarea', label: '单元格（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
