import { registerSection } from '@/lib/sections/registry';
import { Map01Section } from './Map01Section';

registerSection({
    type: 'map-01', name: '全宽地图', description: '全宽嵌入式地图', category: 'contact',
    component: Map01Section,
    defaultData: { title: '', mapUrl: '', height: '400' },
    defaultStyle: { backgroundColor: '#ffffff', textColor: '#111827' },
    schema: {
        data: { title: { type: 'text', label: '标题（可选）' }, mapUrl: { type: 'link', label: '地图嵌入链接' }, height: { type: 'text', label: '高度(px)' } },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' } }
    }
});
