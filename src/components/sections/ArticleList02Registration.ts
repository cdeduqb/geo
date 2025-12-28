import { registerSection } from '@/lib/sections/registry';
import { ArticleList02Section } from './ArticleList02Section';

registerSection({
    name: '横向列表文章',
    type: 'article-list-02',
    description: '左图右文或右图左文横向布局',
    category: 'data',
    component: ArticleList02Section,
    defaultData: {
        title: '文章列表',
        subtitle: '最新发布',
        categoryId: '',
        pageSize: 5,
        showPagination: true,
        showImage: true,
        showDate: true,
        showCategory: true,
        showDescription: true,
        imagePosition: 'left',
        imageSize: 'medium',
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#8b5cf6',
        dividerColor: '#e5e7eb',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            categoryId: { type: 'text', label: '分类 UUID（复制后台分类管理中的 UUID，留空显示最新文章）' },
            pageSize: { type: 'number', label: '每页显示数量' },
            showPagination: { type: 'boolean', label: '显示分页' },
            showImage: { type: 'boolean', label: '显示封面图' },
            showDate: { type: 'boolean', label: '显示日期' },
            showCategory: { type: 'boolean', label: '显示分类' },
            showDescription: { type: 'boolean', label: '显示摘要' },
            imagePosition: { type: 'select', label: '图片位置', options: [{ label: '左侧', value: 'left' }, { label: '右侧', value: 'right' }] },
            imageSize: { type: 'select', label: '图片大小', options: [{ label: '小', value: 'small' }, { label: '中', value: 'medium' }, { label: '大', value: 'large' }] },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
            dividerColor: { type: 'color', label: '分割线颜色' },
        }
    }
});
