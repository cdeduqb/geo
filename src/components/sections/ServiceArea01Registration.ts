import { registerSection } from '@/lib/sections/registry';
import { ServiceArea01Section } from './ServiceArea01Section';

registerSection({
    name: '服务区域',
    type: 'service-area-01',
    description: '按区域分组展示服务覆盖城市',
    category: 'content',
    component: ServiceArea01Section,
    defaultData: {
        title: '服务覆盖区域',
        subtitle: '我们的服务已覆盖全国主要城市',
        regions: [
            { name: '华东地区', cities: ['上海', '南京', '杭州', '苏州', '宁波'] },
            { name: '华北地区', cities: ['北京', '天津', '石家庄', '济南', '青岛'] },
            { name: '华南地区', cities: ['广州', '深圳', '东莞', '佛山', '珠海'] },
            { name: '西南地区', cities: ['成都', '重庆', '昆明', '贵阳'] },
        ],
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            regions: {
                type: 'list', label: '服务区域', itemSchema: {
                    name: { type: 'text', label: '区域名称' },
                    cities: { type: 'text', label: '城市(逗号分隔)' },
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
