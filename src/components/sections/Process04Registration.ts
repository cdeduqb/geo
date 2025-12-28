import { registerSection } from '@/lib/sections/registry';
import { Process04Section } from './Process04Section';

registerSection({
    type: 'process-04',
    name: '箭头式步骤',
    description: '箭头连接的步骤流程展示',
    category: 'content',
    component: Process04Section,
    defaultData: {
        title: '实施步骤',
        subtitle: '清晰的执行路径',
        steps: [
            { title: '需求分析', description: '详细了解业务需求和目标' },
            { title: '方案设计', description: '制定完整的解决方案' },
            { title: '开发实施', description: '按计划实施和开发' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#faf5ff',
        textColor: '#111827',
        accentColor: '#8b5cf6'
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
                    description: { type: 'textarea', label: '步骤描述' }
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
