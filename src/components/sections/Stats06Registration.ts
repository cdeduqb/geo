import { registerSection } from '@/lib/sections/registry';
import { Stats06Section } from './Stats06Section';

registerSection({
    type: 'stats-06',
    name: '圆形统计',
    description: '圆形卡片统计展示',
    category: 'data',
    component: Stats06Section,
    defaultData: {
        title: '成就展示',
        subtitle: '我们的荣誉',
        stats: [
            { value: '15+', label: '年行业经验' },
            { value: '1000+', label: '服务客户' },
            { value: '50+', label: '技术专利' },
            { value: '30+', label: '行业奖项' }
        ]
    },
    defaultStyle: { backgroundColor: '#fdf2f8', textColor: '#111827', accentColor: '#ec4899' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            stats: { type: 'list', label: '统计项', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' } } } as any
        },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
