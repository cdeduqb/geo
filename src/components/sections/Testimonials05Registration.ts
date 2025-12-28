import { registerSection } from '@/lib/sections/registry';
import { Testimonials05Section } from './Testimonials05Section';

registerSection({
    type: 'testimonials-05',
    name: '瀑布流评价',
    description: '三列瀑布流布局的客户评价',
    category: 'marketing',
    component: Testimonials05Section,
    defaultData: {
        title: '真实反馈',
        subtitle: '来自各行各业的客户评价',
        testimonials: [
            {
                name: '林一',
                title: '品牌经理',
                company: '知名企业',
                avatar: 'https://picsum.photos/100/100?random=11',
                content: '专业、高效、值得信赖。这是我们长期合作的重要伙伴。',
            },
            {
                name: '黄二',
                title: '市场总监',
                company: '科技公司',
                avatar: 'https://picsum.photos/100/100?random=12',
                content: '帮助我们实现了品牌曝光和转化的双重增长，效果超出预期。这次合作非常愉快，期待下次继续。',
            },
            {
                name: '刘三',
                title: '销售经理',
                company: '贸易公司',
                avatar: 'https://picsum.photos/100/100?random=13',
                content: '客户管理功能太强大了！',
            },
            {
                name: '杨四',
                title: 'CTO',
                company: '互联网公司',
                avatar: 'https://picsum.photos/100/100?random=14',
                content: '技术架构先进，性能出色。完美满足了我们的高并发需求。',
            },
            {
                name: '朱五',
                title: '产品总监',
                company: '创业公司',
                avatar: 'https://picsum.photos/100/100?random=15',
                content: '用户研究深入，产品迭代快速。真正做到了以用户为中心的产品开发。',
            },
            {
                name: '许六',
                title: 'HR经理',
                company: '人力资源公司',
                avatar: 'https://picsum.photos/100/100?random=16',
                content: '培训体系完善，帮助我们的团队快速上手。',
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        cardBackground: '#1e293b',
        accentColor: '#38bdf8'
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
                    content: { type: 'textarea', label: '评价内容' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            cardBackground: { type: 'color', label: '卡片背景色' },
            accentColor: { type: 'color', label: '强调色' }
        }
    }
});
