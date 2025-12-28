'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Compare01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, columns = [], features = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-5xl mx-auto overflow-x-auto">
                    <table className="w-full" itemScope itemType="http://schema.org/Table">
                        <thead>
                            <tr>
                                <th className="px-6 py-4 text-left" style={{ color: textColor }}>功能</th>
                                {columns.map((col: any, idx: number) => (
                                    <th key={idx} className="px-6 py-4 text-center" style={{ background: idx === 1 ? accentColor : 'transparent', color: idx === 1 ? 'white' : textColor }}>
                                        <div className="font-bold">{col.name}</div>
                                        {col.price && <div className="text-sm opacity-80">{col.price}</div>}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature: any, fIdx: number) => (
                                <tr key={fIdx} className="border-b border-gray-100">
                                    <td className="px-6 py-4" style={{ color: textColor }}>{feature.name}</td>
                                    {feature.values?.map((val: string, vIdx: number) => (
                                        <td key={vIdx} className="px-6 py-4 text-center">
                                            {val === '✓' ? <span style={{ color: accentColor }}>✓</span> : val === '✗' ? <span className="text-gray-300">✗</span> : <span style={{ color: textColor }}>{val}</span>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};
