import { registerSection } from '@/lib/sections/registry';
import { Stats03Section } from './Stats03Section';

registerSection({
    type: 'stats-03',
    name: '暗色统计',
    description: '暗色主题分隔线统计',
    category: 'data',
    component: Stats03Section,
    defaultData: {
        title: '业绩数据',
        subtitle: '持续增长',
        stats: [
            { value: '¥1.2亿', label: '年营收' },
            { value: '500+', label: '企业客户' },
            { value: '98%', label: '续费率' },
            { value: '15', label: '行业奖项' }
        ]
    },
    defaultStyle: { backgroundColor: '#0f172a', textColor: '#f1f5f9', accentColor: '#22c55e' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            stats: { type: 'list', label: '统计项', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
