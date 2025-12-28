import { registerSection } from '@/lib/sections/registry';
import { Team07Section } from './Team07Section';

registerSection({
    type: 'team-07',
    name: '交错图文',
    description: '详细展示团队成员的图文交错布局',
    category: 'contact',
    component: Team07Section,
    defaultData: {
        title: '遇见我们的专家',
        subtitle: '每一位成员都是其领域的佼佼者',
        members: [
            {
                name: 'Sarah Jie',
                role: '设计总监',
                bio: '拥有超过10年的UI/UX设计经验，曾在硅谷多家知名科技公司任职。她相信好的设计应该是隐形的，让用户在不知不觉中获得愉悦的体验。\n\n目前专注于设计系统的搭建和团队培养。',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
                socialLinks: [{ platform: 'Dribbble', url: '#' }, { platform: 'LinkedIn', url: '#' }]
            },
            {
                name: 'David Chen',
                role: '首席架构师',
                bio: '全栈开发专家，开源社区活跃贡献者。对于高性能分布式系统有深入研究。\n\n热衷于探索前沿技术，并将其应用到实际业务场景中，解决复杂的技术挑战。',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800',
                socialLinks: [{ platform: 'GitHub', url: '#' }, { platform: 'Twitter', url: '#' }]
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        roleColor: '#3b82f6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            members: {
                type: 'list',
                label: '成员列表',
                itemSchema: {
                    name: { type: 'text', label: '姓名' },
                    role: { type: 'text', label: '职位' },
                    bio: { type: 'textarea', label: '详细简介' },
                    image: { type: 'image', label: '照片' },
                    socialLinks: { type: 'list', label: '社交链接', itemSchema: { platform: { type: 'text', label: '平台' }, url: { type: 'link', label: '链接' } } } as any
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            roleColor: { type: 'color', label: '职位颜色' }
        }
    }
});
