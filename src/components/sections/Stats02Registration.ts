import { registerSection } from '@/lib/sections/registry';
import { Stats02Section } from './Stats02Section';

registerSection({
    type: 'stats-02',
    name: '卡片统计',
    description: '带图标的卡片式统计',
    category: 'data',
    component: Stats02Section,
    defaultData: {
        title: '核心数据',
        subtitle: '用数据说话',
        stats: [
            { icon: '👥', value: '50K+', label: '注册用户' },
            { icon: '📈', value: '200%', label: '年增长率' },
            { icon: '🌍', value: '30+', label: '覆盖国家' },
            { icon: '⭐', value: '4.9', label: '用户评分' }
        ]
    },
    defaultStyle: { backgroundColor: '#f0f9ff', textColor: '#111827', accentColor: '#0ea5e9' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            stats: { type: 'list', label: '统计项', itemSchema: { icon: { type: 'text', label: '图标' }, value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
