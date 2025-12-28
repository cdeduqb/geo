import { registerSection } from '@/lib/sections/registry';
import { Team08Section } from './Team08Section';

registerSection({
    type: 'team-08',
    name: '瀑布流卡片',
    description: '自适应高度的瀑布流团队展示',
    category: 'contact',
    component: Team08Section,
    defaultData: {
        title: '多元化的团队',
        subtitle: '我们来自不同的背景，但拥有共同的愿景',
        members: [
            { name: 'Alex Wong', role: '创意总监', bio: '总是有着天马行空的想象力，喜欢摄影和滑板。在他的带领下，团队斩获了多个国际设计大奖。', image: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=600' },
            { name: 'Bella Liu', role: '文案策划', bio: '文字的魔术师，能用最简单的语言打动人心。热爱阅读古典文学，也关注流行文化。', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600' },
            { name: 'Chris Evans', role: '前端工程师', bio: '代码洁癖患者，像素级还原设计稿。业余时间是一个不知名的独立游戏开发者。', image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&q=80&w=600' },
            { name: 'Diana Prince', role: '项目经理', bio: '团队的大管家，确保每个项目都能按时高质量交付。擅长沟通协调，是连接客户与团队的桥梁。', image: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?auto=format&fit=crop&q=80&w=600' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#f3f4f6',
        textColor: '#111827',
        cardBgColor: '#ffffff'
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
            cardBgColor: { type: 'color', label: '卡片背景' }
        }
    }
});
