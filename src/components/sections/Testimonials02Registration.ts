import { registerSection } from '@/lib/sections/registry';
import { Testimonials02Section } from './Testimonials02Section';

registerSection({
    type: 'testimonials-02',
    name: '大引号评价',
    description: '双列大引号装饰式客户评价',
    category: 'marketing',
    component: Testimonials02Section,
    defaultData: {
        title: '他们的故事',
        subtitle: '看看我们的客户是如何评价我们的',
        testimonials: [
            {
                name: '赵六',
                title: 'CEO',
                company: '电商平台',
                avatar: 'https://picsum.photos/100/100?random=4',
                content: '合作三年以来，他们始终如一地提供优质服务。这种专业和承诺让我们的业务蓬勃发展。',
                rating: 5
            },
            {
                name: '钱七',
                title: '运营总监',
                company: '新媒体公司',
                avatar: 'https://picsum.photos/100/100?random=5',
                content: '从0到1搭建了完整的内容管理体系，帮助我们节省了大量人力成本。强烈推荐！',
                rating: 5
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
        quoteColor: '#3b82f6'
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
            quoteColor: { type: 'color', label: '引号/强调色' }
        }
    }
});
