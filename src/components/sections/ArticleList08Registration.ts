import { registerSection } from '@/lib/sections/registry';
import { ArticleList08Section } from './ArticleList08Section';

registerSection({
    name: '暗色科技文章',
    type: 'article-list-08',
    description: '暗色科技风格带渐变背景',
    category: 'data',
    component: ArticleList08Section,
    defaultData: {
        title: '技术博客',
        subtitle: '',
        categorySortOrder: '',
        pageSize: 6,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
        showGradient: true,
    },
    defaultStyle: {
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        accentColor: '#22d3ee',
        cardBackgroundColor: '#1e293b',
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
            showGradient: { type: 'boolean', label: '显示渐变背景' },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBackgroundColor: { type: 'color', label: '卡片背景色' },
        }
    }
});
