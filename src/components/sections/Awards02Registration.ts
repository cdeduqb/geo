import { registerSection } from '@/lib/sections/registry';
import { Awards02Section } from './Awards02Section';

registerSection({
    name: '勋章式荣誉',
    type: 'awards-02',
    description: '圆形勋章风格，暗色主题',
    category: 'content',
    component: Awards02Section,
    defaultData: {
        title: '企业荣誉',
        awards: [
            { title: '国家级高新技术企业', year: '2023', description: '获得国家科技部认证' },
            { title: '中国驰名商标', year: '2022', description: '品牌价值获官方认可' },
            { title: 'AAA级信用企业', year: '2023', description: '企业信用评级最高等级' },
        ],
    },
    defaultStyle: {
        backgroundColor: '#111827',
        textColor: '#f9fafb',
        accentColor: '#fbbf24',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            awards: {
                type: 'list', label: '荣誉列表', itemSchema: {
                    title: { type: 'text', label: '荣誉名称' },
                    year: { type: 'text', label: '年份' },
                    description: { type: 'textarea', label: '描述' },
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
