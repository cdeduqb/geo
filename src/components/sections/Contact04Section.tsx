'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 联系我们04：多分支联系
export const Contact04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, branches = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', cardBackground = '#f9fafb', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch: any, index: number) => (
                        <div key={index} className="rounded-2xl p-6" style={{ background: cardBackground }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                    <span className="text-white font-bold">{index + 1}</span>
                                </div>
                                <h3 className="text-xl font-bold" style={{ color: textColor }}>{branch.name || '分公司'}</h3>
                            </div>

                            <div className="space-y-3 text-sm">
                                {branch.address && (
                                    <p className="flex items-start gap-2">
                                        <span className="opacity-50 flex-shrink-0">地址:</span>
                                        <span style={{ color: textColor }}>{branch.address}</span>
                                    </p>
                                )}
                                {branch.phone && (
                                    <p className="flex items-start gap-2">
                                        <span className="opacity-50 flex-shrink-0">电话:</span>
                                        <a href={`tel:${branch.phone}`} style={{ color: accentColor }}>{branch.phone}</a>
                                    </p>
                                )}
                                {branch.email && (
                                    <p className="flex items-start gap-2">
                                        <span className="opacity-50 flex-shrink-0">邮箱:</span>
                                        <a href={`mailto:${branch.email}`} style={{ color: accentColor }}>{branch.email}</a>
                                    </p>
                                )}
                                {branch.hours && (
                                    <p className="flex items-start gap-2">
                                        <span className="opacity-50 flex-shrink-0">营业:</span>
                                        <span style={{ color: textColor }}>{branch.hours}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
