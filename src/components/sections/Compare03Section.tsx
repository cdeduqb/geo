'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Compare03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, columns = [], features = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#f59e0b' } = style;

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
                            <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <th className="px-6 py-4 text-left" style={{ color: textColor }}>对比项</th>
                                {columns.map((col: any, idx: number) => (
                                    <th key={idx} className="px-6 py-4 text-center" style={{ color: accentColor }}>{col.name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features.map((feature: any, fIdx: number) => (
                                <tr key={fIdx} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                    <td className="px-6 py-4" style={{ color: textColor }}>{feature.name}</td>
                                    {feature.values?.map((val: string, vIdx: number) => (
                                        <td key={vIdx} className="px-6 py-4 text-center" style={{ color: val === '✓' ? accentColor : val === '✗' ? '#6b7280' : textColor }}>{val}</td>
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
