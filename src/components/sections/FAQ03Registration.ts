import { registerSection } from '@/lib/sections/registry';
import { FAQ03Section } from './FAQ03Section';

registerSection({
    type: 'faq-03',
    name: '极简FAQ',
    description: '线条分隔的极简风格常见问题',
    category: 'content',
    component: FAQ03Section,
    defaultData: {
        title: '常见问题',
        subtitle: '您想了解的都在这里',
        faqs: [
            {
                question: '产品有哪些特色功能？',
                answer: '我们的产品拥有强大的数据分析、智能推荐、团队协作等核心功能，帮助您提升工作效率。'
            },
            {
                question: '如何联系技术支持？',
                answer: '您可以通过邮件、在线客服或电话联系我们的技术支持团队，我们7x24小时为您服务。'
            },
            {
                question: '数据安全如何保障？',
                answer: '我们采用银行级加密技术，所有数据均存储在安全的云端服务器，定期备份，确保您的数据安全。'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#10b981'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            faqs: {
                type: 'list',
                label: '问题列表',
                itemSchema: {
                    question: { type: 'text', label: '问题' },
                    answer: { type: 'textarea', label: '答案' }
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
