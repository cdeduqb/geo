import { registerSection } from '@/lib/sections/registry';
import { Map04Section } from './Map04Section';

registerSection({
    type: 'map-04', name: '静态标注', description: '静态地图图片带标注点', category: 'contact',
    component: Map04Section,
    defaultData: { title: '业务覆盖', subtitle: '全国主要城市网点分布', mapImage: '', markers: [{ name: '北京', description: '总部', x: 60, y: 30 }, { name: '上海', description: '华东分部', x: 70, y: 50 }] },
    defaultStyle: { backgroundColor: '#1f2937', textColor: '#ffffff', accentColor: '#f59e0b' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, mapImage: { type: 'image', label: '地图图片' }, markers: { type: 'list', label: '标注点', itemSchema: { name: { type: 'text', label: '名称' }, description: { type: 'text', label: '描述' }, x: { type: 'number', label: 'X坐标(%)' }, y: { type: 'number', label: 'Y坐标(%)' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '标注颜色' } }
    }
});
