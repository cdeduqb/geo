import { registerSection } from '@/lib/sections/registry';
import { ArticleList06Section } from './ArticleList06Section';

registerSection({
    name: '杂志风格文章',
    type: 'article-list-06',
    description: '暗色主题杂志风格布局',
    category: 'data',
    component: ArticleList06Section,
    defaultData: {
        title: '热门文章',
        subtitle: '',
        categorySortOrder: '',
        pageSize: 7,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
    },
    defaultStyle: {
        backgroundColor: '#1f2937',
        textColor: '#ffffff',
        accentColor: '#f59e0b',
        cardBackgroundColor: '#374151',
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
