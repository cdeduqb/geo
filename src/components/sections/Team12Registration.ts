import { registerSection } from '@/lib/sections/registry';
import { Team12Section } from './Team12Section';

registerSection({
    type: 'team-12',
    name: '弹窗详情',
    description: '点击头像弹出详细模态框',
    category: 'contact',
    component: Team12Section,
    defaultData: {
        title: '合伙人团队',
        subtitle: '点击头像查看详细履历',
        members: [
            {
                name: 'Michael Scott',
                role: '区域经理',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
                fullBio: '拥有超过20年的纸张销售管理经验。曾连续5年获得"年度最佳经理"奖项。\n\n他的管理哲学是"原本我想让员工既怕我又爱我，但我更希望他们怕我对其爱的程度"。',
                projects: 'Dunder Mifflin Scranton分公司业绩翻倍\n创办Scott\'s Tots基金会（待定）\n编写并主演电影《Threat Level Midnight》'
            },
            {
                name: 'Dwight Schrute',
                role: '助理区域经理',
                avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
                fullBio: '除了是顶尖的销售员，他还是一位成功的甜菜农场主和B&B经营者。\n\n拥有空手道黑带，并担任志愿警长副手。',
                projects: '连续10年获得销售冠军\n成功防御多次针对公司的假想敌袭击'
            },
            { name: 'Jim Halpert', role: '高级销售', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=600' },
            { name: 'Pam Beesly', role: '办公室管理员', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=600' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        modalOverlayColor: 'rgba(0,0,0,0.5)'
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
                    avatar: { type: 'image', label: '头像' },
                    fullBio: { type: 'textarea', label: '详细简介' },
                    projects: { type: 'textarea', label: '项目/成就' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '页面背景色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            modalOverlayColor: { type: 'color', label: '遮罩层颜色' }
        }
    }
});
