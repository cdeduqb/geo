import { registerSection } from '@/lib/sections/registry';
import { ArticleList10Section } from './ArticleList10Section';

registerSection({
    name: '新闻门户文章',
    type: 'article-list-10',
    description: '新闻门户风格，日期突出显示',
    category: 'data',
    component: ArticleList10Section,
    defaultData: {
        title: '新闻中心',
        subtitle: '了解公司最新动态',
        categorySortOrder: '',
        pageSize: 8,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
        layout: 'portal',
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#dc2626',
        cardBackgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            categorySortOrder: { type: 'text', label: '分类编号（留空显示最新文章）' },
            pageSize: { type: 'number', label: '每页显示数量' },
            showPagination: { type: 'boolean', label: '显示分页' },
            showImage: { type: 'boolean', label: '显示封面图' },
            showDate: { type: 'boolean', label: '显示日期' },
            showCategory: { type: 'boolean', label: '显示分类' },
            showDescription: { type: 'boolean', label: '显示摘要' },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBackgroundColor: { type: 'color', label: '卡片背景色' },
            borderColor: { type: 'color', label: '边框颜色' },
        }
    }
});
