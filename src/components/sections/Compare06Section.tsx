'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const Compare06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, columns = [], features = [] } = data;
    const { backgroundColor = '#fdf2f8', textColor = '#111827', accentColor = '#ec4899' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" itemScope itemType="http://schema.org/Table">
                        <div className="grid" style={{ gridTemplateColumns: `200px repeat(${columns.length}, 1fr)` }}>
                            <div className="p-4 font-bold" style={{ background: accentColor, color: 'white' }}>功能特性</div>
                            {columns.map((col: any, idx: number) => (
                                <div key={idx} className="p-4 text-center font-bold" style={{ background: accentColor, color: 'white' }}>{col.name}</div>
                            ))}
                        </div>
                        {features.map((feature: any, fIdx: number) => (
                            <div key={fIdx} className="grid border-b border-gray-100" style={{ gridTemplateColumns: `200px repeat(${columns.length}, 1fr)` }}>
                                <div className="p-4 font-semibold" style={{ color: textColor }}>{feature.name}</div>
                                {feature.values?.map((val: string, vIdx: number) => (
                                    <div key={vIdx} className="p-4 text-center">
                                        {val === '✓' ? (
                                            <span className="inline-block w-6 h-6 rounded-full text-white text-sm" style={{ background: accentColor, lineHeight: '24px' }}>✓</span>
                                        ) : val === '✗' ? (
                                            <span className="inline-block w-6 h-6 rounded-full bg-gray-200 text-gray-400 text-sm" style={{ lineHeight: '24px' }}>✗</span>
                                        ) : (
                                            <span style={{ color: textColor }}>{val}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
