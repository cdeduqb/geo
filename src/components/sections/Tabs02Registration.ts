import { registerSection } from '@/lib/sections/registry';
import { Tabs02Section } from './Tabs02Section';

registerSection({
    type: 'tabs-02',
    name: '垂直选项卡',
    description: '左侧垂直排列的选项卡',
    category: 'content',
    component: Tabs02Section,
    defaultData: {
        title: '解决方案',
        subtitle: '选择适合您的方案',
        tabs: [
            { label: '企业版', contentTitle: '企业级解决方案', content: '为大型企业量身定制的解决方案，支持无限用户和高级功能。', features: ['无限用户', '高级安全', '专属客服', '定制开发'] },
            { label: '专业版', contentTitle: '专业版功能', content: '适合中小型企业的专业解决方案，功能齐全价格合理。', features: ['50用户', '标准安全', '在线客服', '月度报告'] },
            { label: '基础版', contentTitle: '基础版功能', content: '入门级解决方案，适合个人和小团队使用。', features: ['5用户', '基础安全', '邮件支持', '周报告'] }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#10b981'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            tabs: {
                type: 'list',
                label: '选项卡列表',
                itemSchema: {
                    label: { type: 'text', label: '选项卡标签' },
                    contentTitle: { type: 'text', label: '内容标题' },
                    content: { type: 'textarea', label: '内容描述' },
                    features: { type: 'textarea', label: '功能列表（逗号分隔）' }
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
