import { registerSection } from '@/lib/sections/registry';
import { Testimonials03Section } from './Testimonials03Section';

registerSection({
    type: 'testimonials-03',
    name: '居中大评价',
    description: '单个居中展示的大型客户评价',
    category: 'marketing',
    component: Testimonials03Section,
    defaultData: {
        title: '客户心声',
        subtitle: '听听他们怎么说',
        testimonials: [
            {
                name: '孙八',
                title: '市场总监',
                company: '知名品牌',
                avatar: 'https://picsum.photos/100/100?random=6',
                content: '这是我们合作过的最专业的团队。他们不仅理解我们的需求，还能提供超越期望的解决方案。从策略到执行，每一步都让我们感到安心。',
                rating: 5
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#8b5cf6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            testimonials: {
                type: 'list',
                label: '评价列表',
                itemSchema: {
                    name: { type: 'text', label: '客户姓名' },
                    title: { type: 'text', label: '职位' },
                    company: { type: 'text', label: '公司' },
                    avatar: { type: 'image', label: '头像' },
                    content: { type: 'textarea', label: '评价内容' },
                    rating: { type: 'number', label: '评分(1-5)' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' }
        }
    }
});
