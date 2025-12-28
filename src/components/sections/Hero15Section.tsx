import { registerSection, SectionProps } from '@/lib/sections/registry';

const Hero15Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        description,
        btnText,
        btnLink,
        btnTarget,
        proofTitle,
        partners = [], // Array of { name, logo }
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#2563eb'
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    return (
        <section
            className="py-24"
            style={{ background: backgroundColor }}
        >
            <div className="container mx-auto px-4 text-center" itemScope itemType="http://schema.org/CreativeWork">
                <TitleTag
                    className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8"
                    style={{ color: textColor }}
                    itemProp="headline"
                >
                    {title}
                </TitleTag>
                <p
                    className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
                    style={{ color: textColor, opacity: 0.8 }}
                    itemProp="description"
                >
                    {description}
                </p>
                {btnText && (
                    <div className="mb-20">
                        <a
                            href={btnLink || '#'}
                            target={btnTarget || '_self'}
                            className="inline-block px-8 py-4 rounded-lg font-bold text-white transition-opacity hover:opacity-90"
                            style={{ background: accentColor }}
                        >
                            {btnText}
                        </a>
                    </div>
                )}

                {/* Social Proof Area */}
                <div className="border-t pt-12" style={{ borderColor: `${textColor}15` }}>
                    <p className="text-sm font-semibold uppercase tracking-wider mb-8" style={{ color: accentColor }}>
                        {proofTitle}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {partners.map((p: any, i: number) => (
                            <img
                                key={i}
                                src={p.logo}
                                alt={p.name}
                                className="h-8 md:h-10 object-contain max-w-[150px]"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-15',
    name: '社交证明横幅',
    description: '强调信任感，底部展示合作伙伴或客户Logo墙',
    category: 'layout',
    component: Hero15Section,
    defaultData: {
        title: '赢得百万用户的信赖',
        description: '我们为全球最挑剔的企业提供稳定、安全、高效的基础设施服务。',
        btnText: '免费开始',
        proofTitle: '他们都在使用 GeoCMS',
        isMainTitle: true,
        partners: [
            { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
            { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
            { name: 'Spotify', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' },
            { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg' }
        ]
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'text', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            description: { type: 'textarea', label: '描述' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] },
            proofTitle: { type: 'text', label: '信任背书标题' },
            partners: { type: 'list', label: '合作伙伴列表', itemSchema: { name: { type: 'text' }, logo: { type: 'image' } } } as any
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '按钮/强调色' }
        }
    }
});
