import { registerSection } from '@/lib/sections/registry';
import { Team09Section } from './Team09Section';

registerSection({
    type: 'team-09',
    name: '悬停覆盖',
    description: '极简风格，鼠标悬停显示详细信息',
    category: 'contact',
    component: Team09Section,
    defaultData: {
        title: '幕后英雄',
        subtitle: '点击了解更多关于我们的故事',
        members: [
            { name: 'Eva Green', role: 'UI 设计师', bio: '热衷于极简主义设计，追求像素级的完美体验。', image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600' },
            { name: 'Frank Zhou', role: '后端开发', bio: '专注于构建高可用、高并发的服务端架构。', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
            { name: 'Grace Ho', role: '人事经理', bio: '致力于打造开放包容的团队文化，让每个人都能发光。', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' },
            { name: 'Hank Lee', role: '销售总监', bio: '以客户成功为导向，带领团队屡创销售佳绩。', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        overlayColor: 'rgba(59, 130, 246, 0.9)',
        overlayTextColor: '#ffffff'
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
                    bio: { type: 'textarea', label: '简介' },
                    image: { type: 'image', label: '照片' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            overlayColor: { type: 'color', label: '覆盖层背景' },
            overlayTextColor: { type: 'color', label: '覆盖层文字' }
        }
    }
});
