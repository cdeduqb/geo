import { registerSection } from '@/lib/sections/registry';
import { DataTable03Section } from './DataTable03Section';

registerSection({
    type: 'datatable-03', name: '暗色数据表格', description: '暗色主题表格', category: 'data',
    component: DataTable03Section,
    defaultData: {
        title: '技术参数', subtitle: '',
        headers: ['参数', '规格', '说明'],
        rows: [
            { cells: ['处理器', 'Intel i9', '最新一代处理器'] },
            { cells: ['内存', '64GB DDR5', '高速内存'] },
            { cells: ['存储', '2TB NVMe', '超快SSD'] }
        ]
    },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#f59e0b' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            headers: { type: 'textarea', label: '表头（逗号分隔）' },
            rows: { type: 'list', label: '数据行', itemSchema: { cells: { type: 'textarea', label: '单元格（逗号分隔）' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
