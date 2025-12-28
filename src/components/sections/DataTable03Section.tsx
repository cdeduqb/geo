'use client';

import { SectionProps } from '@/lib/sections/registry';

export const DataTable03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, headers = [], rows = [] } = data;
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
                <div className="max-w-5xl mx-auto overflow-x-auto" itemScope itemType="http://schema.org/Table">
                    <table className="w-full">
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.1)' }}>
                                {headers.map((header: string, idx: number) => (
                                    <th key={idx} className="px-6 py-4 text-left font-bold" style={{ color: accentColor }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row: any, rowIdx: number) => (
                                <tr key={rowIdx} className="border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                                    {row.cells?.map((cell: string, cellIdx: number) => (
                                        <td key={cellIdx} className="px-6 py-4" style={{ color: textColor }}>{cell}</td>
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
