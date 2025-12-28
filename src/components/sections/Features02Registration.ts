import { registerSection } from '@/lib/sections/registry';
import { Features02Section } from './Features02Section';

registerSection({
    type: 'features-02',
    name: '现代卡片功能网格',
    description: '带悬浮效果和图标的现代卡片式功能展示',
    category: 'content',
    component: Features02Section,
    defaultData: {
        title: '强大功能，助力业务增长',
        subtitle: '我们提供全方位的解决方案，帮助您的业务快速发展',
        features: [
            {
                title: '云端同步',
                description: '实时云端同步，随时随地访问您的数据，确保团队协作无缝衔接。',
                link: '#',
                linkText: '了解更多'
            },
            {
                title: '数据分析',
                description: '强大的数据分析工具，帮助您洞察业务趋势，做出明智决策。',
                link: '#',
                linkText: '了解更多'
            },
            {
                title: '团队协作',
                description: '高效的团队协作功能，让团队沟通更顺畅，项目管理更轻松。',
                link: '#',
                linkText: '了解更多'
            },
            {
                title: '安全保障',
                description: '企业级安全防护，多重加密技术，确保您的数据安全无虞。',
                link: '#',
                linkText: '了解更多'
            },
            {
                title: '移动优先',
                description: '完美适配各种设备，随时随地处理工作，提升工作效率。',
                link: '#',
                linkText: '了解更多'
            },
            {
                title: '7x24支持',
                description: '全天候专业技术支持，快速响应您的需求，解决您的问题。',
                link: '#',
                linkText: '了解更多'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        cardBackground: '#f9fafb'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            features: {
                type: 'list',
                label: '功能列表',
                itemSchema: {
                    title: { type: 'text', label: '功能标题' },
                    description: { type: 'textarea', label: '功能描述' },
                    icon: { type: 'image', label: '图标图片' },
                    link: { type: 'text', label: '链接地址' },
                    linkText: { type: 'text', label: '链接文字' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBackground: { type: 'color', label: '卡片背景色' }
        }
    }
});
