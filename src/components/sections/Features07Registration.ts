import { registerSection } from '@/lib/sections/registry';
import { Features07Section } from './Features07Section';

registerSection({
    type: 'features-07',
    name: '数字大标题式',
    description: '大号数字背景的功能展示',
    category: 'content',
    component: Features07Section,
    defaultData: {
        title: '我们的优势',
        subtitle: '专业团队，卓越服务',
        features: [
            { title: '专业团队', description: '10年行业经验的专业团队为您服务' },
            { title: '快速响应', description: '24小时内响应客户需求' },
            { title: '品质保证', description: '严格的质量管控流程' }
        ]
    },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#ef4444' },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            features: { type: 'list', label: '功能列表' } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' }
        }
    }
});
