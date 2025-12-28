import { registerSection } from '@/lib/sections/registry';
import { Timeline01Section } from './Timeline01Section';

registerSection({
    type: 'timeline-01',
    name: '左侧垂直时间轴',
    description: '左侧圆点的垂直时间轴',
    category: 'content',
    component: Timeline01Section,
    defaultData: {
        title: '发展历程',
        subtitle: '我们的成长之路',
        events: [
            { date: '2020年1月', title: '公司成立', description: '在创新的道路上迈出第一步，开始我们的征程', tags: ['创业', '起步'] },
            { date: '2021年6月', title: '产品发布', description: '首款产品正式上线，获得市场广泛认可', tags: ['里程碑'] },
            { date: '2022年3月', title: '团队扩张', description: '团队规模突破100人，建立多个研发中心', tags: ['发展'] },
            { date: '2023年12月', title: '国际化', description: '业务拓展至海外市场，开启全球化战略', tags: ['扩张', '国际'] }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        lineColor: '#e5e7eb'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            events: {
                type: 'list',
                label: '事件列表',
                itemSchema: {
                    date: { type: 'text', label: '日期' },
                    title: { type: 'text', label: '事件标题' },
                    description: { type: 'textarea', label: '事件描述' },
                    tags: { type: 'textarea', label: '标签（逗号分隔）' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            lineColor: { type: 'color', label: '连线颜色' }
        }
    }
});
