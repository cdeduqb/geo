import { registerSection } from '@/lib/sections/registry';
import { Tabs01Section } from './Tabs01Section';

registerSection({
    type: 'tabs-01',
    name: '水平选项卡',
    description: '水平排列的选项卡切换',
    category: 'content',
    component: Tabs01Section,
    defaultData: {
        title: '我们的服务',
        subtitle: '点击选项卡查看详情',
        tabs: [
            { label: '产品服务', contentTitle: '专业的产品服务', content: '我们提供全方位的产品解决方案，从设计到开发再到维护，一站式服务让您省心省力。' },
            { label: '技术支持', contentTitle: '7x24技术支持', content: '专业的技术团队全天候为您服务，任何问题都能得到及时响应和解决。' },
            { label: '培训服务', contentTitle: '定制化培训', content: '根据您的需求提供定制化培训方案，帮助团队快速上手使用产品。' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6'
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
