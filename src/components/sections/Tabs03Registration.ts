import { registerSection } from '@/lib/sections/registry';
import { Tabs03Section } from './Tabs03Section';

registerSection({
    type: 'tabs-03',
    name: '胶囊式选项卡',
    description: '圆角胶囊样式的选项卡',
    category: 'content',
    component: Tabs03Section,
    defaultData: {
        title: '功能亮点',
        subtitle: '选择查看不同功能',
        tabs: [
            { label: '智能分析', contentTitle: 'AI驱动的智能分析', content: '利用人工智能技术，自动分析您的数据，提供有价值的洞察和建议。', buttonText: '了解更多' },
            { label: '自动化', contentTitle: '流程自动化', content: '告别繁琐的手动操作，让系统自动完成重复性工作，提高效率。', buttonText: '开始使用' },
            { label: '协作', contentTitle: '团队协作', content: '多人实时协作，信息同步更新，让团队配合更加默契高效。', buttonText: '免费试用' }
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
            tabs: {
                type: 'list',
                label: '选项卡列表',
                itemSchema: {
                    label: { type: 'text', label: '选项卡标签' },
                    contentTitle: { type: 'text', label: '内容标题' },
                    content: { type: 'textarea', label: '内容描述' },
                    buttonText: { type: 'text', label: '按钮文字' }
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
