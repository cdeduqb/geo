import { registerSection } from '@/lib/sections/registry';
import { Team15Section } from './Team15Section';

registerSection({
    type: 'team-15',
    name: '极简名录',
    description: '按分组展示的纯文字名单',
    category: 'contact',
    component: Team15Section,
    defaultData: {
        title: '特别鸣谢',
        subtitle: '感谢所有为项目做出贡献的伙伴',
        groups: [
            {
                groupName: 'Design Team',
                list: [
                    { name: 'Sarah J.', title: 'Lead' },
                    { name: 'Mike T.', title: 'Senior' },
                    { name: 'Jenny L.', title: 'Junior' }
                ]
            },
            {
                groupName: 'Engineering',
                list: [
                    { name: 'David C.', title: 'CTO' },
                    { name: 'Tom H.', title: 'Backend' },
                    { name: 'Lisa W.', title: 'Frontend' },
                    { name: 'Kevin B.', title: 'DevOps' }
                ]
            },
            {
                groupName: 'Product',
                list: [
                    { name: 'Rachel G.', title: 'VP' },
                    { name: 'Steve M.', title: 'PM' }
                ]
            }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        borderColor: '#e5e7eb'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            groups: {
                type: 'list',
                label: '分组列表',
                itemSchema: {
                    groupName: { type: 'text', label: '组名' },
                    list: {
                        type: 'list',
                        label: '名单',
                        itemSchema: { name: { type: 'text', label: '姓名' }, title: { type: 'text', label: '头衔' } }
                    }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            borderColor: { type: 'color', label: '边框颜色' }
        }
    }
});
