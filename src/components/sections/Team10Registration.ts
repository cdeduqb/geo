import { registerSection } from '@/lib/sections/registry';
import { Team10Section } from './Team10Section';

registerSection({
    type: 'team-10',
    name: '紧凑目录',
    description: '适用于大型团队的紧凑型成员展示',
    category: 'contact',
    component: Team10Section,
    defaultData: {
        title: '全体成员',
        subtitle: '我们是一支由50+专业人士组成的全球团队',
        members: [
            { name: 'Alice Smith', role: '高级工程师', avatar: '', bio: '专注于React生态' },
            { name: 'Bob Johnson', role: '产品经理', avatar: '', bio: '以用户为中心' },
            { name: 'Carol Williams', role: 'UI设计师', avatar: '', bio: '设计系统专家' },
            { name: 'David Brown', role: '测试开发', avatar: '', bio: '质量保证' },
            { name: 'Eve Davis', role: '运维专家', avatar: '', bio: 'K8s大师' },
            { name: 'Frank Miller', role: '数据分析师', avatar: '', bio: '挖掘数据价值' },
            { name: 'Grace Wilson', role: '市场专员', avatar: '', bio: '品牌推广' },
            { name: 'Henry Moore', role: '客户支持', avatar: '', bio: '全天候服务' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        itemBgColor: '#f9fafb'
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
                    bio: { type: 'text', label: '简短描述' },
                    avatar: { type: 'image', label: '头像' }
                }
            } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            itemBgColor: { type: 'color', label: '项目背景色' }
        }
    }
});
