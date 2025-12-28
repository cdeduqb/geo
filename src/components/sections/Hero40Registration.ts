import { registerSection } from '@/lib/sections/registry';
import { Hero40Section } from './Hero40Section';

registerSection({
    type: 'hero-40',
    name: '倒计时注册横幅',
    description: '活动倒计时配合注册按钮，适合发布会或限时促销',
    category: 'layout',
    component: Hero40Section,
    defaultData: {
        title: 'Limited Time Offer',
        subtitle: 'Ends soon. Don\'t miss out.',
        targetDate: '2025-12-31T23:59:59',
        btnText: 'Register Now',
        btnLink: '#'
    },
    defaultStyle: {
        backgroundColor: '#1e1b4b',
        textColor: '#ffffff',
        accentColor: '#f59e0b'
    },
    schema: {
        data: {
            title: { type: 'text', label: '活动标题' },
            subtitle: { type: 'textarea', label: '活动描述' },
            targetDate: { type: 'text', label: '截止日期 (YYYY-MM-DD)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            topBadge: { type: 'text', label: '顶部标签' },
            daysLabel: { type: 'text', label: '天数标签' },
            hoursLabel: { type: 'text', label: '小时标签' },
            minutesLabel: { type: 'text', label: '分钟标签' },
            secondsLabel: { type: 'text', label: '秒数标签' }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '高亮/按钮色' }
        }
    }
});
