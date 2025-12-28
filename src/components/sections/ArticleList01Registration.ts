import { registerSection } from '@/lib/sections/registry';
import { ArticleList01Section } from './ArticleList01Section';

registerSection({
    name: '网格卡片文章',
    type: 'article-list-01',
    description: '经典网格卡片布局，支持分页和分类筛选',
    category: 'data',
    component: ArticleList01Section,
    defaultData: {
        title: '最新文章',
        subtitle: '了解我们的最新动态',
        categoryId: '',
        pageSize: 6,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
        columnCount: '3',
        imageRatio: '16/9',
        buttonText: '阅读全文',
        cardRadius: '12',
        cardShadow: true,
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
        cardBackgroundColor: '#f9fafb',
        titleColor: '',
        descriptionColor: '',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            categoryId: { type: 'text', label: '分类 UUID（复制后台分类管理中的 UUID，留空显示最新文章）' },
            pageSize: { type: 'number', label: '每页显示数量' },
            showPagination: { type: 'boolean', label: '显示分页' },
            showImage: { type: 'boolean', label: '显示封面图' },
            showDate: { type: 'boolean', label: '显示日期' },
            showCategory: { type: 'boolean', label: '显示分类' },
            showDescription: { type: 'boolean', label: '显示摘要' },
            columnCount: { type: 'select', label: '列数', options: [{ label: '2列', value: '2' }, { label: '3列', value: '3' }, { label: '4列', value: '4' }] },
            imageRatio: { type: 'select', label: '图片比例', options: [{ label: '16:9', value: '16/9' }, { label: '4:3', value: '4/3' }, { label: '1:1', value: '1/1' }] },
            buttonText: { type: 'text', label: '按钮文字' },
            cardRadius: { type: 'text', label: '卡片圆角(px)' },
            cardShadow: { type: 'boolean', label: '显示阴影' },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            cardBackgroundColor: { type: 'color', label: '卡片背景色' },
            titleColor: { type: 'color', label: '标题颜色' },
            descriptionColor: { type: 'color', label: '摘要颜色' },
        }
    }
});
