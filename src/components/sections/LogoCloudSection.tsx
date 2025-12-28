import { registerSection, SectionProps } from '@/lib/sections/registry';

export const LogoCloudSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, logos } = data;
    const { backgroundColor = 'bg-white', padding = 'py-16' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                {title && (
                    <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
                        {title}
                    </p>
                )}
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500" itemScope itemType="http://schema.org/ItemList">
                    {logos?.map((logo: any, index: number) => (
                        <div
                            key={index}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Organization"
                        >
                            <img
                                src={logo.url}
                                alt={logo.name}
                                itemProp="logo"
                                className="h-8 md:h-10 object-contain"
                            />
                            <meta itemProp="name" content={logo.name} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'logo-cloud',
    name: '合作伙伴',
    description: '展示合作伙伴或客户 Logo',
    category: 'marketing',
    component: LogoCloudSection,
    defaultData: {
        title: '深受全球 500+ 企业的信赖',
        logos: [
            { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
            { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
            { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
            { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
            { name: 'Spotify', url: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg' }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-16'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            logos: { type: 'list', label: 'Logo 列表' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' },
                    { label: '深色', value: 'bg-gray-900' }
                ]
            }
        }
    }
});
