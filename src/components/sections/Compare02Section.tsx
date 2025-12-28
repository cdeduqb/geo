'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Compare02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, columns = [], features = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto" itemScope itemType="http://schema.org/ItemList">
                    {columns.map((col: any, idx: number) => (
                        <div key={idx} className={`bg-white rounded-2xl p-6 shadow-lg ${idx === 1 ? 'ring-2 ring-green-500' : ''}`} itemProp="itemListElement" itemScope itemType="http://schema.org/Offer">
                            {idx === 1 && <div className="text-xs font-bold text-center py-1 rounded-full mb-4" style={{ background: accentColor, color: 'white' }}>推荐</div>}
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold mb-2" style={{ color: textColor }} itemProp="name">{col.name}</h3>
                                {col.price && (
                                    <div className="text-3xl font-black" style={{ color: accentColor }}>
                                        <meta itemProp="priceCurrency" content="CNY" />
                                        <span itemProp="price" content={col.price.replace(/[^0-9.]/g, '')}>{col.price}</span>
                                    </div>
                                )}
                            </div>
                            <ul className="space-y-3">
                                {features.map((feature: any, fIdx: number) => (
                                    <li key={fIdx} className="flex items-center gap-2">
                                        {feature.values?.[idx] === '✓' ? (
                                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ background: accentColor }}>✓</span>
                                        ) : feature.values?.[idx] === '✗' ? (
                                            <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">✗</span>
                                        ) : (
                                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs" style={{ background: accentColor }}>✓</span>
                                        )}
                                        <span style={{ color: textColor }}>{feature.name}: {feature.values?.[idx] !== '✓' && feature.values?.[idx] !== '✗' ? feature.values?.[idx] : ''}</span>
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full mt-6 py-3 rounded-xl font-semibold transition-all" style={{ background: idx === 1 ? accentColor : 'transparent', color: idx === 1 ? 'white' : accentColor, border: `2px solid ${accentColor}` }}>选择方案</button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
