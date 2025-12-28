'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 团队介绍07：交错图文
export const Team07Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, members = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', roleColor = '#3b82f6' } = style;

    return (
        <section className="py-24" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    {title && <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                    {subtitle && <p className="text-lg opacity-70 max-w-2xl mx-auto" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="space-y-24">
                    {members.map((member: any, index: number) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div
                                key={index}
                                className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${isEven ? '' : 'lg:flex-row-reverse'}`}
                                itemScope
                                itemType="http://schema.org/Person"
                            >
                                <div className="w-full lg:w-1/2">
                                    <div className="relative aspect-[3/4] md:aspect-[4/3] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                                        <img
                                            src={member.image || `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&q=80&w=800`}
                                            alt={member.name}
                                            itemProp="image"
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                        />
                                    </div>
                                </div>
                                <div className="w-full lg:w-1/2 text-center lg:text-left">
                                    <p className="text-xl font-bold uppercase tracking-wider mb-2" style={{ color: roleColor }} itemProp="jobTitle">{member.role}</p>
                                    <h3 className="text-4xl font-bold mb-6" style={{ color: textColor }} itemProp="name">{member.name}</h3>
                                    <div className="space-y-4 opacity-80 text-lg leading-relaxed" style={{ color: textColor }} itemProp="description">
                                        {member.bio?.split('\n').map((paragraph: string, i: number) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                    {member.socialLinks && member.socialLinks.length > 0 && (
                                        <div className="flex items-center justify-center lg:justify-start gap-4 mt-8">
                                            {member.socialLinks.map((link: any, idx: number) => (
                                                <a key={idx} href={link.url} className="opacity-60 hover:opacity-100 transition-opacity" style={{ color: textColor }} itemProp="url">
                                                    {link.platform}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
