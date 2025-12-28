import { registerSection } from '@/lib/sections/registry';
import { Team11Section } from './Team11Section';

registerSection({
    type: 'team-11',
    name: '轮播展示',
    description: '横向滚动展示多位团队成员',
    category: 'contact',
    component: Team11Section,
    defaultData: {
        title: '顾问委员会',
        subtitle: '汇聚全球顶尖智慧，引领行业发展方向',
        members: [
            { name: 'Dr. Alan Turing', role: '首席科学家', bio: '计算机科学之父，人工智能领域的奠基人。对算法和计算理论做出了巨大贡献。', image: '' },
            { name: 'Ada Lovelace', role: '算法顾问', bio: '历史上第一位程序员，预见到了计算机处理通用符号的能力。', image: '' },
            { name: 'Grace Hopper', role: '技术顾问', bio: '计算机编程语言先驱，COBOL语言之母。发明了第一个编译器。', image: '' },
            { name: 'John von Neumann', role: '架构顾问', bio: '博弈论创始人，现代计算机架构的提出者。', image: '' },
            { name: 'Claude Shannon', role: '通信顾问', bio: '信息论之父，奠定了现代数字通信的理论基础。', image: '' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        cardBgColor: '#f9fafb',
        arrowColor: '#111827'
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
            cardBgColor: { type: 'color', label: '卡片背景' },
            arrowColor: { type: 'color', label: '箭头颜色' }
        }
    }
});
