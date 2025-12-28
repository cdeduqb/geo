import { registerSection } from '@/lib/sections/registry';
import { Map03Section } from './Map03Section';

registerSection({
    type: 'map-03', name: '多点切换', description: '可切换多个地点的地图', category: 'contact',
    component: Map03Section,
    defaultData: { title: '全国网点', subtitle: '点击查看各地网点', locations: [{ name: '北京总部', address: '北京市朝阳区xxx路', mapUrl: '' }, { name: '上海分公司', address: '上海市浦东新区xxx路', mapUrl: '' }] },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827', accentColor: '#3b82f6' },
    schema: {
        data: { title: { type: 'text', label: '标题' }, subtitle: { type: 'textarea', label: '副标题' }, locations: { type: 'list', label: '地点列表', itemSchema: { name: { type: 'text', label: '名称' }, address: { type: 'textarea', label: '地址' }, mapUrl: { type: 'link', label: '地图嵌入链接' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '选中颜色' } }
    }
});
