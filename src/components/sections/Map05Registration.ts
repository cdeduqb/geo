import { registerSection } from '@/lib/sections/registry';
import { Map05Section } from './Map05Section';

registerSection({
    type: 'map-05', name: '交通指南', description: '地图加交通方式说明', category: 'contact',
    component: Map05Section,
    defaultData: { title: '交通指南', subtitle: '多种方式轻松抵达', mapUrl: '', transportMethods: [{ name: '地铁', icon: '🚇', description: '乘坐地铁X号线，在XX站下车，B出口步行500米' }, { name: '公交', icon: '🚌', description: '乘坐XXX路公交车在XX站下车' }, { name: '自驾', icon: '🚗', description: '导航搜索"公司名称"即可，地下停车场可用' }] },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, mapUrl: { type: 'link', label: '地图嵌入链接' }, transportMethods: { type: 'list', label: '交通方式', itemSchema: { name: { type: 'text', label: '名称' }, icon: { type: 'text', label: '图标(emoji)' }, description: { type: 'textarea', label: '说明' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '图标背景色' } }
    }
});
