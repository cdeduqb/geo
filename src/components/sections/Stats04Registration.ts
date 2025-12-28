import { registerSection } from '@/lib/sections/registry';
import { Stats04Section } from './Stats04Section';

registerSection({
    type: 'stats-04',
    name: '增长统计',
    description: '带变化趋势的统计',
    category: 'data',
    component: Stats04Section,
    defaultData: {
        title: '增长指标',
        subtitle: '持续向好',
        stats: [
            { value: '128%', label: '用户增长', change: '+28%' },
            { value: '¥5.6M', label: '月度营收', change: '+15%' },
            { value: '4.8', label: '产品评分', change: '+0.3' }
        ]
    },
    defaultStyle: { backgroundColor: '#fef3c7', textColor: '#111827', accentColor: '#f59e0b' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            stats: { type: 'list', label: '统计项', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' }, change: { type: 'text', label: '变化' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
