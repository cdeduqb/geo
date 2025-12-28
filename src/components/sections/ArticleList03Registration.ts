import { registerSection } from '@/lib/sections/registry';
import { ArticleList03Section } from './ArticleList03Section';

registerSection({
    name: '特色大图文章',
    type: 'article-list-03',
    description: '左侧大图特色文章+右侧列表',
    category: 'data',
    component: ArticleList03Section,
    defaultData: {
        title: '精选内容',
        subtitle: '',
        categorySortOrder: '',
        pageSize: 5,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
        featuredLayout: true,
    },
    defaultStyle: {
        backgroundColor: '#f9fafb',
        textColor: '#111827',
        accentColor: '#ef4444',
        cardBackgroundColor: '#ffffff',
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
            featuredLayout: { type: 'boolean', label: '首页突出显示第一篇' },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBackgroundColor: { type: 'color', label: '卡片背景色' },
        }
    }
});
