import { registerSection } from '@/lib/sections/registry';
import { Testimonials01Section } from './Testimonials01Section';

registerSection({
    type: 'testimonials-01',
    name: '经典卡片评价',
    description: '三列卡片式客户评价展示',
    category: 'marketing',
    component: Testimonials01Section,
    defaultData: {
        title: '客户怎么说',
        subtitle: '来自真实客户的评价与反馈',
        testimonials: [
            {
                name: '张三',
                title: '产品经理',
                company: '科技有限公司',
                avatar: 'https://picsum.photos/100/100?random=1',
                content: '这个产品彻底改变了我们的工作流程，效率提升了50%以上。非常推荐！',
                rating: 5
            },
            {
                name: '李四',
                title: '创始人',
                company: '创业公司',
                avatar: 'https://picsum.photos/100/100?random=2',
                content: '客户服务非常专业，响应及时。产品功能强大且易于使用。',
                rating: 5
            },
            {
                name: '王五',
                title: '技术总监',
                company: '互联网公司',
                avatar: 'https://picsum.photos/100/100?random=3',
                content: '技术支持团队非常出色，帮助我们解决了很多技术难题。',
                rating: 4
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        cardBackground: '#ffffff',
        accentColor: '#3b82f6'
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
            accentColor: { type: 'color', label: '强调色(星星)' }
        }
    }
});
