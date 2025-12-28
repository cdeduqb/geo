import { registerSection } from '@/lib/sections/registry';
import { FAQ06Section } from './FAQ06Section';

registerSection({
    type: 'faq-06',
    name: '暗色主题Q&A式',
    description: 'Q&A标记的暗色主题FAQ',
    category: 'content',
    component: FAQ06Section,
    defaultData: {
        title: '常见问题',
        subtitle: '您需要知道的一切',
        faqs: [
            { question: '如何开始使用本产品？', answer: '注册账户后，按照引导完成初始设置，即可开始使用所有功能。' },
            { question: '提供哪些技术支持？', answer: '我们提供邮件、在线聊天和电话支持，响应时间通常在24小时内。' },
            { question: '是否支持团队协作？', answer: '是的，企业版支持无限团队成员和协作功能。' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#06b6d4'
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
