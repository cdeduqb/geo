import { registerSection } from '@/lib/sections/registry';
import { DownloadCenter02Section } from './DownloadCenter02Section';

registerSection({
    name: '分类下载中心',
    type: 'download-center-02',
    description: '按分类组织的下载列表',
    category: 'content',
    component: DownloadCenter02Section,
    defaultData: {
        title: '资料下载中心',
        categories: [
            {
                name: '产品资料', items: [
                    { title: '产品介绍', downloadUrl: '#', fileSize: '1.5MB' },
                    { title: '技术规格', downloadUrl: '#', fileSize: '800KB' },
                ]
            },
            {
                name: '使用帮助', items: [
                    { title: '快速入门指南', downloadUrl: '#', fileSize: '2MB' },
                    { title: '常见问题解答', downloadUrl: '#', fileSize: '500KB' },
                ]
            },
        ],
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#8b5cf6',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            categories: {
                type: 'list', label: '下载分类', itemSchema: {
                    name: { type: 'text', label: '分类名称' },
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
