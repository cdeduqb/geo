import { registerSection } from '@/lib/sections/registry';
import { FAQ05Section } from './FAQ05Section';

registerSection({
    type: 'faq-05',
    name: '图标标记式FAQ',
    description: '带图标标记的卡片式FAQ',
    category: 'content',
    component: FAQ05Section,
    defaultData: {
        title: '常见问题',
        subtitle: '解决您的困惑',
        faqs: [
            { question: '产品有试用期吗？', answer: '是的，我们提供14天免费试用期，无需信用卡。' },
            { question: '如何升级套餐？', answer: '在账户设置中选择升级，选择合适的套餐即可。' },
            { question: '数据如何备份？', answer: '我们每天自动备份，您也可以手动导出数据。' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#fafafa',
        textColor: '#111827',
        accentColor: '#f59e0b'
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
