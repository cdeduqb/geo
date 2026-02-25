'use client';

import Script from 'next/script';

// ============================================================================
// Schema.org Type Definitions
// ============================================================================

export interface ArticleSchemaProps {
    type: 'Article' | 'NewsArticle' | 'BlogPosting';
    title: string;
    description?: string;
    author?: {
        name: string;
        url?: string;
    };
    datePublished: string;
    dateModified?: string;
    image?: string;
    url: string;
    publisher?: {
        name: string;
        logo?: string;
    };
    mentions?: Array<{
        name: string;
        description?: string;
        url?: string;
    }>;
    citations?: Array<{
        url?: string;
        name: string;
    }>;
    speakable?: {
        cssSelector?: string[];
        xpath?: string[];
    };
    wordCount?: number;
    articleSection?: string;
}

export interface FAQSchemaProps {
    type: 'FAQPage';
    questions: Array<{
        question: string;
        answer: string;
    }>;
}

export interface OrganizationSchemaProps {
    type: 'Organization';
    name: string;
    url?: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
}

export interface ProductSchemaProps {
    type: 'Product';
    name: string;
    description?: string;
    image?: string;
    brand?: string;
    sku?: string;
    gtin?: string;
    price?: number;
    currency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'BackOrder';
    aggregateRating?: {
        ratingValue: number;
        reviewCount: number;
    };
}

export interface LocalBusinessSchemaProps {
    type: 'LocalBusiness' | 'Restaurant' | 'Store';
    name: string;
    description?: string;
    image?: string;
    address: string;
    telephone?: string;
    priceRange?: string;
    geo?: {
        latitude: number;
        longitude: number;
    };
}

export interface SoftwareApplicationSchemaProps {
    type: 'SoftwareApplication';
    name: string;
    operatingSystem?: string;
    applicationCategory?: string;
    offers?: {
        price: number;
        priceCurrency: string;
    };
}

export interface BreadcrumbSchemaProps {
    type: 'BreadcrumbList';
    items: Array<{
        name: string;
        url: string;
    }>;
}

export interface WebSiteSchemaProps {
    type: 'WebSite';
    name: string;
    url: string;
    description?: string;
    searchAction?: {
        targetUrl: string;
        queryInput: string;
    };
}

export interface DatasetSchemaProps {
    type: 'Dataset';
    name: string;
    description?: string;
    url: string;
    creator?: {
        name: string;
    };
}

export interface HowToSchemaProps {
    type: 'HowTo';
    name: string;
    steps: string[];
}

export type StructuredDataProps =
    | ArticleSchemaProps
    | FAQSchemaProps
    | OrganizationSchemaProps
    | ProductSchemaProps
    | BreadcrumbSchemaProps
    | WebSiteSchemaProps
    | DatasetSchemaProps
    | HowToSchemaProps
    | LocalBusinessSchemaProps
    | SoftwareApplicationSchemaProps;

// ============================================================================
// Schema Generators
// ============================================================================

function generateArticleSchema(props: ArticleSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': props.type,
        headline: props.title,
        description: props.description,
        author: props.author ? {
            '@type': 'Person',
            name: props.author.name,
            url: props.author.url
        } : undefined,
        datePublished: props.datePublished,
        dateModified: props.dateModified || props.datePublished,
        image: props.image,
        wordCount: props.wordCount,
        articleSection: props.articleSection,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': props.url
        },
        publisher: props.publisher ? {
            '@type': 'Organization',
            name: props.publisher.name,
            logo: props.publisher.logo ? {
                '@type': 'ImageObject',
                url: props.publisher.logo
            } : undefined
        } : undefined,
        mentions: props.mentions?.map(m => ({
            '@type': 'Thing',
            name: m.name,
            description: m.description,
            url: m.url
        })),
        citation: props.citations?.map(c => ({
            '@type': 'CreativeWork',
            name: c.name,
            url: c.url
        })),
        speakable: props.speakable ? {
            '@type': 'SpeakableSpecification',
            cssSelector: props.speakable.cssSelector,
            xpath: props.speakable.xpath
        } : undefined
    };
}

function generateFAQSchema(props: FAQSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: props.questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer
            }
        }))
    };
}

function generateOrganizationSchema(props: OrganizationSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: props.name,
        url: props.url,
        logo: props.logo,
        description: props.description,
        sameAs: props.sameAs
    };
}

function generateProductSchema(props: ProductSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: props.name,
        description: props.description,
        image: props.image,
        brand: props.brand ? {
            '@type': 'Brand',
            name: props.brand
        } : undefined,
        sku: props.sku,
        gtin: props.gtin,
        aggregateRating: props.aggregateRating ? {
            '@type': 'AggregateRating',
            ratingValue: props.aggregateRating.ratingValue,
            reviewCount: props.aggregateRating.reviewCount
        } : undefined,
        offers: props.price ? {
            '@type': 'Offer',
            price: props.price,
            priceCurrency: props.currency || 'CNY',
            availability: `https://schema.org/${props.availability || 'InStock'}`,
            url: undefined // Remove window dependency to avoid hydration mismatch
        } : undefined
    };
}

function generateBreadcrumbSchema(props: BreadcrumbSchemaProps): object {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: props.items
            .filter(item => item.name && item.url) // 过滤掉无效项
            .map((item, index) => {
                let url = item.url;
                // 尝试将相对路径转换为绝对路径
                if (url && url.startsWith('/') && siteUrl) {
                    url = `${siteUrl.replace(/\/$/, '')}${url}`;
                }

                return {
                    '@type': 'ListItem',
                    position: index + 1,
                    name: item.name,
                    item: url
                };
            })
    };
}

function generateWebSiteSchema(props: WebSiteSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: props.name,
        url: props.url,
        description: props.description,
        potentialAction: props.searchAction ? {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: props.searchAction.targetUrl
            },
            'query-input': props.searchAction.queryInput
        } : undefined
    };
}

function generateLocalBusinessSchema(props: LocalBusinessSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': props.type,
        name: props.name,
        description: props.description,
        image: props.image,
        address: {
            '@type': 'PostalAddress',
            streetAddress: props.address
        },
        telephone: props.telephone,
        priceRange: props.priceRange,
        geo: props.geo ? {
            '@type': 'GeoCoordinates',
            latitude: props.geo.latitude,
            longitude: props.geo.longitude
        } : undefined
    };
}

function generateSoftwareApplicationSchema(props: SoftwareApplicationSchemaProps): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: props.name,
        operatingSystem: props.operatingSystem,
        applicationCategory: props.applicationCategory,
        offers: props.offers ? {
            '@type': 'Offer',
            price: props.offers.price,
            priceCurrency: props.offers.priceCurrency
        } : undefined
    };
}

// ============================================================================
// Main Component
// ============================================================================

export function StructuredData(props: StructuredDataProps) {
    let schema: object;

    switch (props.type) {
        case 'Article':
        case 'NewsArticle':
        case 'BlogPosting':
            schema = generateArticleSchema(props);
            break;
        case 'FAQPage':
            schema = generateFAQSchema(props);
            break;
        case 'Organization':
            schema = generateOrganizationSchema(props);
            break;
        case 'Product':
            schema = generateProductSchema(props);
            break;
        case 'BreadcrumbList':
            schema = generateBreadcrumbSchema(props);
            break;
        case 'WebSite':
            schema = generateWebSiteSchema(props);
            break;
        case 'Dataset':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'Dataset',
                name: (props as any).name,
                description: (props as any).description,
                url: (props as any).url,
                creator: (props as any).creator ? {
                    '@type': 'Person',
                    name: (props as any).creator.name
                } : undefined
            };
            break;
        case 'HowTo':
            schema = {
                '@context': 'https://schema.org',
                '@type': 'HowTo',
                name: (props as any).name,
                step: (props as any).steps?.map((s: any, i: number) => ({
                    '@type': 'HowToStep',
                    position: i + 1,
                    text: s
                }))
            };
            break;
        case 'LocalBusiness':
        case 'Restaurant':
        case 'Store':
            schema = generateLocalBusinessSchema(props as LocalBusinessSchemaProps);
            break;
        case 'SoftwareApplication':
            schema = generateSoftwareApplicationSchema(props as SoftwareApplicationSchemaProps);
            break;
        default:
            return null;
    }

    // 移除 undefined 值
    const cleanSchema = JSON.parse(JSON.stringify(schema));

    return (
        <script
            id={`structured-data-${props.type}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
        />
    );
}

// ============================================================================
// Convenience Components
// ============================================================================

export function ArticleStructuredData(props: Omit<ArticleSchemaProps, 'type'> & { type?: ArticleSchemaProps['type'] }) {
    return <StructuredData {...props} type={props.type || 'Article'} />;
}

export function FAQStructuredData(props: Omit<FAQSchemaProps, 'type'>) {
    return <StructuredData {...props} type="FAQPage" />;
}

export function OrganizationStructuredData(props: Omit<OrganizationSchemaProps, 'type'>) {
    return <StructuredData {...props} type="Organization" />;
}

export function ProductStructuredData(props: Omit<ProductSchemaProps, 'type'>) {
    return <StructuredData {...props} type="Product" />;
}

export function BreadcrumbStructuredData(props: Omit<BreadcrumbSchemaProps, 'type'>) {
    return <StructuredData {...props} type="BreadcrumbList" />;
}

export function WebSiteStructuredData(props: Omit<WebSiteSchemaProps, 'type'>) {
    return <StructuredData {...props} type="WebSite" />;
}

export function DatasetStructuredData(props: Omit<DatasetSchemaProps, 'type'>) {
    return <StructuredData {...props} type="Dataset" />;
}

export function HowToStructuredData(props: Omit<HowToSchemaProps, 'type'>) {
    return <StructuredData {...props} type="HowTo" />;
}

export default StructuredData;
