import { registerSection } from '@/lib/sections/registry';
import { Timeline04Section } from './Timeline04Section';

registerSection({
    type: 'timeline-04',
    name: '圆点连线时间轴',
    description: '圆点连线的时间轴展示',
    category: 'content',
    component: Timeline04Section,
    defaultData: {
        title: '历史沿革',
        subtitle: '见证每一个重要时刻',
        events: [
            { year: '2015', month: '03', title: '初创阶段', description: '几位志同道合的伙伴聚集在一起，开始了创业之旅', achievement: '种子用户50人' },
            { year: '2017', month: '09', title: '快速成长', description: '产品得到市场认可，用户量快速增长', achievement: '用户破万' },
            { year: '2020', month: '06', title: '规模化发展', description: '建立完善的运营体系，开启规模化发展', achievement: '团队突破200人' },
            { year: '2023', month: '12', title: '行业领先', description: '成为行业领军企业，市场份额第一', achievement: '年营收10亿+' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ede9fe',
        textColor: '#111827',
        accentColor: '#8b5cf6',
        dotColor: '#a78bfa'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            events: {
                type: 'list',
                label: '事件列表',
                itemSchema: {
                    year: { type: 'text', label: '年份' },
                    month: { type: 'text', label: '月份' },
                    title: { type: 'text', label: '事件标题' },
                    description: { type: 'textarea', label: '事件描述' },
                    achievement: { type: 'text', label: '成就标签' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            dotColor: { type: 'color', label: '圆点颜色' }
        }
    }
});
