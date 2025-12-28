import { registerSection } from '@/lib/sections/registry';
import { ArticleList05Section } from './ArticleList05Section';

registerSection({
    name: '简约列表文章',
    type: 'article-list-05',
    description: '极简的标题列表样式',
    category: 'data',
    component: ArticleList05Section,
    defaultData: {
        title: '文章列表',
        categorySortOrder: '',
        pageSize: 10,
        showPagination: true,
        showDate: true,
        showCategory: true,
        showDivider: true,
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#6366f1',
        dividerColor: '#f3f4f6',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            categorySortOrder: { type: 'text', label: '分类编号（留空显示最新文章）' },
            pageSize: { type: 'number', label: '每页显示数量' },
            showPagination: { type: 'boolean', label: '显示分页' },
            showDate: { type: 'boolean', label: '显示日期' },
            showCategory: { type: 'boolean', label: '显示分类' },
            showDivider: { type: 'boolean', label: '显示分割线' },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            dividerColor: { type: 'color', label: '分割线颜色' },
        }
    }
});
