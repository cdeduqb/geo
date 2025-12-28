import { registerSection } from '@/lib/sections/registry';
import { CTA06Section } from './CTA06Section';

registerSection({
    type: 'cta-06', name: '渐变号召', description: '渐变背景带统计', category: 'marketing',
    component: CTA06Section,
    defaultData: { title: '加入数百万用户的行列', subtitle: '体验下一代产品带来的效率革命', primaryButtonText: '立即开始', primaryButtonUrl: '#', secondaryButtonText: '观看演示', secondaryButtonUrl: '#', stats: [{ value: '10M+', label: '活跃用户' }, { value: '99.9%', label: '服务稳定性' }, { value: '24/7', label: '技术支持' }] },
    defaultStyle: { backgroundColor: '#ec4899', textColor: '#ffffff', accentColor: '#be185d' },
    schema: {
        data: { title: { type: 'text', label: '主标题' }, subtitle: { type: 'textarea', label: '副标题' }, primaryButtonText: { type: 'text', label: '主按钮文字' }, primaryButtonUrl: { type: 'link', label: '主按钮链接' }, secondaryButtonText: { type: 'text', label: '次按钮文字' }, secondaryButtonUrl: { type: 'link', label: '次按钮链接' }, stats: { type: 'list', label: '统计数据', itemSchema: { value: { type: 'text', label: '数值' }, label: { type: 'text', label: '标签' } } } as any },
        style: { backgroundColor: { type: 'color', label: '背景颜色' }, textColor: { type: 'color', label: '文字颜色' }, accentColor: { type: 'color', label: '强调色' } }
    }
});
