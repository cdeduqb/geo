import { registerSection } from '@/lib/sections/registry';
import { ServiceArea02Section } from './ServiceArea02Section';

registerSection({
    name: '服务区域图标版',
    type: 'service-area-02',
    description: '图标化展示服务类型和区域',
    category: 'content',
    component: ServiceArea02Section,
    defaultData: {
        title: '配送服务',
        subtitle: '多种配送方式满足您的需求',
        regions: [
            { name: '全国配送', description: '覆盖31个省市自治区，送货上门', icon: '🚚' },
            { name: '极速达', description: '北上广深同城当日达', icon: '⚡' },
            { name: '海外直邮', description: '支持港澳台及部分海外地区', icon: '🌏' },
        ],
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#22c55e',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            regions: {
                type: 'list', label: '服务项', itemSchema: {
                    name: { type: 'text', label: '名称' },
                    description: { type: 'textarea', label: '描述' },
                    icon: { type: 'text', label: '图标(emoji)' },
                }
            },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
        }
    }
});
