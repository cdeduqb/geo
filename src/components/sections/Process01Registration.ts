import { registerSection } from '@/lib/sections/registry';
import { Process01Section } from './Process01Section';

registerSection({
    type: 'process-01',
    name: '横向步骤条',
    description: '横向进度条式步骤展示',
    category: 'content',
    component: Process01Section,
    defaultData: {
        title: '我们的流程',
        subtitle: '简单三步，轻松完成',
        steps: [
            { title: '注册账号', subtitle: '快速注册', description: '填写基本信息，创建您的专属账号' },
            { title: '配置设置', subtitle: '个性化', description: '根据需求配置系统参数和偏好' },
            { title: '开始使用', subtitle: '立即体验', description: '一切准备就绪，开启全新体验' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f0f9ff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        completedColor: '#10b981'
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
                    subtitle: { type: 'text', label: '步骤副标题' },
                    description: { type: 'textarea', label: '详细描述' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            completedColor: { type: 'color', label: '完成步骤颜色' }
        }
    }
});
