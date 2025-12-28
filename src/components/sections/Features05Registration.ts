import { registerSection } from '@/lib/sections/registry';
import { Features05Section } from './Features05Section';

registerSection({
    type: 'features-05',
    name: '竖向时间线式',
    description: '左侧数字标记的竖向时间线式功能展示',
    category: 'content',
    component: Features05Section,
    defaultData: {
        title: '实施流程',
        subtitle: '清晰的步骤，高效的执行',
        features: [
            {
                title: '需求调研',
                description: '深入了解您的业务场景和具体需求，为项目奠定坚实基础。',
                badge: '第一步'
            },
            {
                title: '方案设计',
                description: '根据需求制定详细的技术方案和实施计划，确保项目顺利推进。',
                badge: '第二步'
            },
            {
                title: '开发实施',
                description: '采用敏捷开发模式，快速迭代，及时交付高质量产品。',
                badge: '第三步'
            },
            {
                title: '上线运维',
                description: '平滑上线部署，持续监控优化，确保系统稳定运行。',
                badge: '第四步'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#f59e0b',
        lineColor: '#d1d5db'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            features: {
                type: 'list',
                label: '步骤列表',
                itemSchema: {
                    title: { type: 'text', label: '步骤标题' },
                    description: { type: 'textarea', label: '步骤描述' },
                    icon: { type: 'image', label: '图标图片（留空显示序号）' },
                    badge: { type: 'text', label: '标签文字' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            lineColor: { type: 'color', label: '时间线颜色' }
        }
    }
});
