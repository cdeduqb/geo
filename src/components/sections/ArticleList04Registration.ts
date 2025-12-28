import { registerSection } from '@/lib/sections/registry';
import { ArticleList04Section } from './ArticleList04Section';

registerSection({
    name: '时间线文章',
    type: 'article-list-04',
    description: '时间线样式文章列表',
    category: 'data',
    component: ArticleList04Section,
    defaultData: {
        title: '文章时间线',
        categorySortOrder: '',
        pageSize: 6,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#10b981',
        lineColor: '#e5e7eb',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
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
            lineColor: { type: 'color', label: '时间线颜色' },
        }
    }
});
