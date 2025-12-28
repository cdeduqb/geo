import { registerSection } from '@/lib/sections/registry';
import { Stats01Section } from './Stats01Section';

registerSection({
    type: 'stats-01',
    name: '简约统计',
    description: '简洁的数字统计展示',
    category: 'data',
    component: Stats01Section,
    defaultData: {
        title: '数据一览',
        subtitle: '我们的成就',
        stats: [
            { value: '10K+', label: '用户数量', description: '活跃用户' },
            { value: '99%', label: '满意度', description: '客户好评' },
            { value: '50+', label: '团队成员', description: '专业团队' },
            { value: '24/7', label: '技术支持', description: '全天候服务' }
        ]
    },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            stats: { type: 'list', label: '统计项', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' }, description: { type: 'text', label: '描述' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
