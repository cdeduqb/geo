import { registerSection } from '@/lib/sections/registry';
import { DataTable01Section } from './DataTable01Section';

registerSection({
    type: 'datatable-01', name: '简约数据表格', description: '基础表格样式', category: 'data',
    component: DataTable01Section,
    defaultData: {
        title: '数据概览', subtitle: '',
        headers: ['项目', '数量', '单价', '总计'],
        rows: [
            { cells: ['产品A', '100', '¥50', '¥5,000'] },
            { cells: ['产品B', '200', '¥30', '¥6,000'] },
            { cells: ['产品C', '150', '¥40', '¥6,000'] }
        ]
    },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            headers: { type: 'textarea', label: '表头（逗号分隔）' },
            rows: { type: 'list', label: '数据行', itemSchema: { cells: { type: 'textarea', label: '单元格（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
