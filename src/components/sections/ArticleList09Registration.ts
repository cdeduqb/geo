import { registerSection } from '@/lib/sections/registry';
import { ArticleList09Section } from './ArticleList09Section';

registerSection({
    name: '极简卡片文章',
    type: 'article-list-09',
    description: '极简风格紧凑卡片',
    category: 'data',
    component: ArticleList09Section,
    defaultData: {
        title: '推荐阅读',
        categorySortOrder: '',
        pageSize: 4,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        cardStyle: 'minimal',
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#14b8a6',
        cardBackgroundColor: '#f9fafb',
        borderColor: '#e5e7eb',
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
            cardStyle: { type: 'select', label: '卡片风格', options: [{ label: '极简', value: 'minimal' }, { label: '边框', value: 'bordered' }, { label: '阴影', value: 'shadow' }] },
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
