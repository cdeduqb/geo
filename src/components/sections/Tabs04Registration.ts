import { registerSection } from '@/lib/sections/registry';
import { Tabs04Section } from './Tabs04Section';

registerSection({
    type: 'tabs-04',
    name: '下划线选项卡',
    description: '暗色主题下划线选项卡',
    category: 'content',
    component: Tabs04Section,
    defaultData: {
        title: '产品特性',
        subtitle: '探索我们的核心功能',
        tabs: [
            { label: '性能', contentTitle: '极致性能优化', content: '采用最新技术架构，确保系统在高并发场景下依然保持卓越性能。', advantages: ['毫秒级响应', '99.99%可用性', '弹性扩展', '智能负载均衡'] },
            { label: '安全', contentTitle: '银行级安全保障', content: '多层安全防护体系，严格的数据加密机制，确保您的数据万无一失。', advantages: ['数据加密', '权限管理', '审计日志', '合规认证'] },
            { label: '集成', contentTitle: '开放API生态', content: '丰富的API接口，轻松对接第三方系统，构建您的专属解决方案。', advantages: ['RESTful API', 'Webhook支持', '第三方集成', '自定义开发'] }
        ]
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#f1f5f9',
        accentColor: '#f59e0b'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            tabs: {
                type: 'list',
                label: '选项卡列表',
                itemSchema: {
                    label: { type: 'text', label: '选项卡标签' },
                    contentTitle: { type: 'text', label: '内容标题' },
                    content: { type: 'textarea', label: '内容描述' },
                    advantages: { type: 'textarea', label: '优势列表（逗号分隔）' }
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
