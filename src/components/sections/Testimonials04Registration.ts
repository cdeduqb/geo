import { registerSection } from '@/lib/sections/registry';
import { Testimonials04Section } from './Testimonials04Section';

registerSection({
    type: 'testimonials-04',
    name: '横向滚动评价',
    description: '可横向滚动的客户评价卡片',
    category: 'marketing',
    component: Testimonials04Section,
    defaultData: {
        title: '用户好评',
        subtitle: '查看更多真实用户的反馈',
        testimonials: [
            {
                name: '周九',
                title: '设计师',
                company: '设计工作室',
                avatar: 'https://picsum.photos/100/100?random=7',
                content: '界面设计非常精美，用户体验一流。每次使用都是一种享受。',
                rating: 5
            },
            {
                name: '吴十',
                title: '开发者',
                company: '软件公司',
                avatar: 'https://picsum.photos/100/100?random=8',
                content: 'API文档清晰，集成非常方便。技术支持响应迅速。',
                rating: 5
            },
            {
                name: '郑十一',
                title: '产品经理',
                company: '创业公司',
                avatar: 'https://picsum.photos/100/100?random=9',
                content: '功能全面且持续更新，能感受到团队的用心。',
                rating: 4
            },
            {
                name: '陈十二',
                title: '运营专员',
                company: '电商平台',
                avatar: 'https://picsum.photos/100/100?random=10',
                content: '后台操作简单直观，极大提升了我们的工作效率。',
                rating: 5
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f3f4f6',
        textColor: '#111827',
        cardBackground: '#ffffff',
        borderColor: '#e5e7eb'
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
            cardBackground: { type: 'color', label: '卡片背景色' },
            borderColor: { type: 'color', label: '边框颜色' }
        }
    }
});
