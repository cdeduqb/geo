import { registerSection } from '@/lib/sections/registry';
import { Awards03Section } from './Awards03Section';

registerSection({
    name: '证书展示墙',
    type: 'awards-03',
    description: '图片证书展示，适合资质证书展示',
    category: 'content',
    component: Awards03Section,
    defaultData: {
        title: '资质证书',
        subtitle: '专业认证，品质保障',
        awards: [
            { title: 'ISO9001质量管理体系认证', image: '' },
            { title: 'ISO14001环境管理体系认证', image: '' },
            { title: 'OHSAS18001职业健康安全认证', image: '' },
            { title: '高新技术企业证书', image: '' },
        ],
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            awards: {
                type: 'list', label: '证书列表', itemSchema: {
                    title: { type: 'text', label: '证书名称' },
                    image: { type: 'image', label: '证书图片' },
                }
            },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
        }
    }
});
