import { registerSection } from '@/lib/sections/registry';
import { ArticleList07Section } from './ArticleList07Section';

registerSection({
    name: '瀑布流文章',
    type: 'article-list-07',
    description: '瀑布流/砖石布局',
    category: 'data',
    component: ArticleList07Section,
    defaultData: {
        title: '全部文章',
        subtitle: '',
        categorySortOrder: '',
        pageSize: 9,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
    },
    defaultStyle: {
        backgroundColor: '#f3f4f6',
        textColor: '#111827',
        accentColor: '#ec4899',
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
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBackgroundColor: { type: 'color', label: '卡片背景色' },
        }
    }
});
