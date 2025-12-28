import { registerSection } from '@/lib/sections/registry';
import { Compare06Section } from './Compare06Section';

registerSection({
    type: 'compare-06', name: '现代对比表', description: '圆角现代对比', category: 'data',
    component: Compare06Section,
    defaultData: {
        title: '功能对比', subtitle: '',
        columns: [{ name: '免费版' }, { name: '专业版' }, { name: '企业版' }],
        features: [
            { name: '基础功能', values: ['✓', '✓', '✓'] },
            { name: '高级分析', values: ['✗', '✓', '✓'] },
            { name: 'API接口', values: ['✗', '✓', '✓'] },
            { name: '定制服务', values: ['✗', '✗', '✓'] },
            { name: '技术支持', values: ['社区', '工作日', '7×24'] }
        ]
    },
    defaultStyle: { backgroundColor: '#fdf2f8', textColor: '#111827', accentColor: '#ec4899' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' },
            columns: { type: 'list', label: '版本列', itemSchema: { name: { type: 'text', label: '版本名' } } } as any,
            features: { type: 'list', label: '功能行', itemSchema: { name: { type: 'text', label: '功能名' }, values: { type: 'textarea', label: '各版本值' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
