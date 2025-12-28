'use client';

import { SectionProps } from '@/lib/sections/registry';

export const DataTable01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, headers = [], rows = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12 max-w-3xl mx-auto">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-5xl mx-auto overflow-x-auto" itemScope itemType="http://schema.org/Table">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr style={{ background: accentColor }}>
                                {headers.map((header: string, idx: number) => (
                                    <th key={idx} className="px-6 py-4 text-left text-white font-semibold">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row: any, rowIdx: number) => (
                                <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    {row.cells?.map((cell: string, cellIdx: number) => (
                                        <td key={cellIdx} className="px-6 py-4 border-b border-gray-100" style={{ color: textColor }}>{cell}</td>
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
