import { registerSection } from '@/lib/sections/registry';
import { DataTable05Section } from './DataTable05Section';

registerSection({
    type: 'datatable-05', name: '卡片式表格', description: '每行为独立卡片', category: 'data',
    component: DataTable05Section,
    defaultData: {
        title: '排行榜', subtitle: '',
        headers: ['名称', '分数', '排名', '变化'],
        rows: [
            { cells: ['团队A', '98分', '第1名', '↑2'] },
            { cells: ['团队B', '95分', '第2名', '↓1'] },
            { cells: ['团队C', '92分', '第3名', '→'] }
        ]
    },
    defaultStyle: { backgroundColor: '#ecfdf5', textColor: '#111827', accentColor: '#10b981' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            headers: { type: 'textarea', label: '表头（逗号分隔）' },
            rows: { type: 'list', label: '数据行', itemSchema: { cells: { type: 'textarea', label: '单元格（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
