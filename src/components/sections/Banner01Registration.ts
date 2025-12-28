import { registerSection } from '@/lib/sections/registry';
import { Banner01Section } from './Banner01Section';

registerSection({
    name: '顶部通知条',
    type: 'banner-01',
    description: '顶部通知横幅，适合公告和促销',
    category: 'marketing',
    component: Banner01Section,
    defaultData: {
        text: '🎉 限时优惠！全场商品8折起，立即抢购',
        buttonText: '了解更多',
        buttonLink: '#',
        showCloseButton: true,
    },
    defaultStyle: {
        backgroundColor: '#3b82f6',
        textColor: '#ffffff',
    },
    schema: {
        data: {
            text: { type: 'text', label: '公告文字' },
            buttonText: { type: 'text', label: '按钮文字' },
            buttonLink: { type: 'link', label: '按钮链接' },
            showCloseButton: { type: 'boolean', label: '显示关闭按钮' },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
        }
    }
});
