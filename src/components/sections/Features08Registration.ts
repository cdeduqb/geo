import { registerSection } from '@/lib/sections/registry';
import { Features08Section } from './Features08Section';

registerSection({
    type: 'features-08',
    name: '左右交替式',
    description: '图文左右交替展示的功能介绍',
    category: 'content',
    component: Features08Section,
    defaultData: {
        title: '产品特色',
        subtitle: '强大功能，助力业务增长',
        features: [
            { title: '智能分析', description: '基于AI的智能数据分析，洞察业务趋势', link: '#', linkText: '了解更多' },
            { title: '团队协作', description: '高效的团队协作工具，提升工作效率', link: '#', linkText: '了解更多' }
        ]
    },
    defaultStyle: { backgroundColor: '#f9fafb', textColor: '#111827', accentColor: '#3b82f6' },
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
