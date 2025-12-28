import { registerSection } from '@/lib/sections/registry';
import { Awards01Section } from './Awards01Section';

registerSection({
    name: '荣誉资质',
    type: 'awards-01',
    description: '网格展示企业荣誉和资质认证',
    category: 'content',
    component: Awards01Section,
    defaultData: {
        title: '荣誉资质',
        subtitle: '我们的专业获得了广泛认可',
        awards: [
            { title: '高新技术企业', year: '2023', issuer: '科技部' },
            { title: 'ISO9001认证', year: '2022', issuer: '国际标准化组织' },
            { title: '行业十佳品牌', year: '2023', issuer: '中国行业协会' },
            { title: '最佳服务奖', year: '2023', issuer: '消费者协会' },
        ],
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#f59e0b',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            awards: {
                type: 'list', label: '荣誉列表', itemSchema: {
                    title: { type: 'text', label: '荣誉名称' },
                    year: { type: 'text', label: '年份' },
                    issuer: { type: 'text', label: '颁发机构' },
                    image: { type: 'image', label: '证书图片' },
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
