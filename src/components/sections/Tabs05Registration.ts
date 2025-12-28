import { registerSection } from '@/lib/sections/registry';
import { Tabs05Section } from './Tabs05Section';

registerSection({
    type: 'tabs-05',
    name: '图标选项卡',
    description: '带图标的选项卡切换',
    category: 'content',
    component: Tabs05Section,
    defaultData: {
        title: '核心能力',
        subtitle: '点击图标了解更多',
        tabs: [
            { icon: '⚡', label: '高效', contentTitle: '极致效率', content: '通过智能化工具和流程优化，大幅提升工作效率，让团队事半功倍。' },
            { icon: '🎯', label: '精准', contentTitle: '精准定位', content: '利用大数据分析，精准定位目标用户，实现营销效果最大化。' },
            { icon: '🔧', label: '灵活', contentTitle: '灵活配置', content: '高度可配置的系统架构，满足各种业务场景的个性化需求。' },
            { icon: '📊', label: '智能', contentTitle: '智能分析', content: 'AI驱动的智能分析系统，自动生成洞察报告，辅助决策。' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#fdf2f8',
        textColor: '#111827',
        accentColor: '#ec4899'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            tabs: {
                type: 'list',
                label: '选项卡列表',
                itemSchema: {
                    icon: { type: 'text', label: '图标(emoji)' },
                    label: { type: 'text', label: '选项卡标签' },
                    contentTitle: { type: 'text', label: '内容标题' },
                    content: { type: 'textarea', label: '内容描述' }
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
