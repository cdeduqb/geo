import { registerSection } from '@/lib/sections/registry';
import { DataTable06Section } from './DataTable06Section';

registerSection({
    type: 'datatable-06', name: '边框强调表格', description: '底部边框强调', category: 'data',
    component: DataTable06Section,
    defaultData: {
        title: '功能列表', subtitle: '',
        headers: ['功能', '基础版', '专业版', '企业版'],
        rows: [
            { cells: ['用户数', '5人', '50人', '无限'] },
            { cells: ['存储空间', '10GB', '100GB', '1TB'] },
            { cells: ['API调用', '1000/天', '10000/天', '无限'] }
        ]
    },
    defaultStyle: { backgroundColor: '#fdf2f8', textColor: '#111827', accentColor: '#ec4899' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            headers: { type: 'textarea', label: '表头（逗号分隔）' },
            rows: { type: 'list', label: '数据行', itemSchema: { cells: { type: 'textarea', label: '单元格（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
