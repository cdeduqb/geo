import { registerSection } from '@/lib/sections/registry';
import { FAQ04Section } from './FAQ04Section';

registerSection({
    type: 'faq-04',
    name: '两列网格式FAQ',
    description: '两列网格布局的常见问题',
    category: 'content',
    component: FAQ04Section,
    defaultData: {
        title: '常见问题',
        subtitle: '解答您的疑问',
        faqs: [
            { question: '如何注册账号？', answer: '点击右上角注册按钮，填写基本信息即可完成注册。' },
            { question: '忘记密码怎么办？', answer: '在登录页面点击忘记密码，通过邮箱验证即可重置。' },
            { question: '支持哪些支付方式？', answer: '支持支付宝、微信支付、银联卡等多种支付方式。' },
            { question: '如何联系客服？', answer: '可通过在线客服、邮件或电话联系我们的客服团队。' }
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
