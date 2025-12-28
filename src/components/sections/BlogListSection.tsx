'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/use-translation';

export const BlogListSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();

    const { title, subtitle, posts } = data;
    const { backgroundColor = 'bg-white', padding = 'py-20', columns = 'grid-cols-3', accentColor = '#3b82f6' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900  mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600  max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className={`grid md:${columns} gap-8`} itemScope itemType="http://schema.org/ItemList">
                    {posts?.map((post: any, index: number) => (
                        <article
                            key={index}
                            className="bg-white  rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100  flex flex-col"
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Article"
                        >
                            <meta itemProp="position" content={String(index + 1)} />
                            <div className="aspect-video bg-gray-200  relative overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    itemProp="image"
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {post.category}
                                </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-sm text-gray-500  mb-3">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <time itemProp="datePublished" dateTime={post.date}>{post.date}</time>
                                    </div>
                                    <div className="flex items-center gap-1" itemProp="author" itemScope itemType="http://schema.org/Person">
                                        <User className="w-4 h-4" />
                                        <span itemProp="name">{post.author === '管理员' || post.author === 'Admin' ? t('common.admin') : post.author}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900  mb-3 line-clamp-2" itemProp="headline">
                                    {post.title}
                                </h3>
                                <p className="text-gray-600  mb-4 line-clamp-3 flex-1" itemProp="description">
                                    {post.excerpt}
                                </p>
                                <a href="#" className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all" style={{ color: accentColor }} itemProp="url">
                                    {t('common.readMore')}
                                    <ArrowRight className="w-4 h-4" />
                                </a>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'blog-list',
    name: '精选文章',
    description: '展示精选或最新文章列表',
    category: 'data',
    component: BlogListSection,
    defaultData: {
        title: '最新动态',
        subtitle: '探索我们的最新见解、行业趋势和专家建议',
        posts: [
            {
                title: '2024年数字营销趋势展望',
                excerpt: '随着人工智能技术的飞速发展，数字营销领域正在经历一场深刻的变革。本文将为您详细解读未来的关键趋势。',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
                date: '2024-03-15',
                author: 'Admin',
                category: '行业趋势'
            },
            {
                title: '如何利用 SEO 提升网站流量',
                excerpt: '搜索引擎优化是获取有机流量的关键。我们将分享5个实用的 SEO 策略，帮助您的网站在搜索结果中脱颖而出。',
                image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
                date: '2024-03-10',
                author: 'SEO Expert',
                category: 'SEO 优化'
            },
            {
                title: '打造高转化率的落地页',
                excerpt: '落地页是转化的关键环节。通过优化页面结构、文案和视觉设计，您可以显著提升用户的转化意愿。',
                image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
                date: '2024-03-05',
                author: 'Design Lead',
                category: '用户体验'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-20',
        columns: 'grid-cols-3'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            posts: { type: 'list', label: '文章列表' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' }
                ]
            },
            columns: {
                type: 'select',
                label: '列数',
                options: [
                    { label: '2列', value: 'grid-cols-2' },
                    { label: '3列', value: 'grid-cols-3' }
                ]
            }
        }
    }
});
