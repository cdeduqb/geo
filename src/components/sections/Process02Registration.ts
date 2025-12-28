import { registerSection } from '@/lib/sections/registry';
import { Process02Section } from './Process02Section';

registerSection({
    type: 'process-02',
    name: '卡片步骤流程',
    description: '卡片式步骤流程，带箭头连接',
    category: 'content',
    component: Process02Section,
    defaultData: {
        title: '服务流程',
        subtitle: '专业高效的服务体验',
        steps: [
            { title: '咨询需求', description: '了解您的需求和目标', icon: '1' },
            { title: '方案设计', description: '定制专属解决方案', icon: '2' },
            { title: '项目实施', description: '高效执行落地', icon: '3' },
            { title: '后续支持', description: '持续优化服务', icon: '4' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ecfdf5',
        textColor: '#111827',
        accentColor: '#10b981'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            steps: {
                type: 'list',
                label: '步骤列表',
                itemSchema: {
                    title: { type: 'text', label: '步骤标题' },
                    description: { type: 'textarea', label: '步骤描述' },
                    icon: { type: 'text', label: '图标文字或数字' }
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
