import { registerSection } from '@/lib/sections/registry';
import { FAQ02Section } from './FAQ02Section';

registerSection({
    type: 'faq-02',
    name: '卡片式FAQ',
    description: '带边框卡片设计的常见问题',
    category: 'content',
    component: FAQ02Section,
    defaultData: {
        title: '常见问题',
        subtitle: '快速找到您需要的答案',
        faqs: [
            {
                question: '如何开始使用？',
                answer: '您可以通过注册账号开始使用我们的服务。注册过程简单快捷，只需要几分钟即可完成。'
            },
            {
                question: '价格是多少？',
                answer: '我们提供多种定价方案以满足不同需求。基础版免费，专业版每月99元，企业版可联系我们定制。'
            },
            {
                question: '是否支持退款？',
                answer: '是的，我们提供30天无理由退款保证。如果您不满意我们的服务，可以随时申请全额退款。'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#3b82f6'
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
