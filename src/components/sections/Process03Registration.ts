import { registerSection } from '@/lib/sections/registry';
import { Process03Section } from './Process03Section';

registerSection({
    type: 'process-03',
    name: '圆形图标步骤',
    description: '大圆形图标的步骤展示',
    category: 'content',
    component: Process03Section,
    defaultData: {
        title: '合作流程',
        subtitle: '简单明了的合作步骤',
        steps: [
            { title: '洽谈合作', description: '深入沟通，明确合作意向和目标', icon: '①', note: '免费咨询' },
            { title: '签订合同', description: '确定合作条款，签署正式协议', icon: '②', note: '法律保障' },
            { title: '开始服务', description: '启动项目，提供专业服务', icon: '③', note: '专业团队' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#fffbeb',
        textColor: '#111827',
        accentColor: '#f59e0b'
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
                    icon: { type: 'text', label: '图标文字' },
                    note: { type: 'text', label: '备注说明' }
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
