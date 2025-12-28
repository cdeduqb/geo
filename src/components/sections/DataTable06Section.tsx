'use client';

import { SectionProps } from '@/lib/sections/registry';

export const DataTable06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, headers = [], rows = [] } = data;
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
                <div className="max-w-5xl mx-auto overflow-x-auto">
                    <table className="w-full bg-white rounded-xl overflow-hidden shadow-xl" itemScope itemType="http://schema.org/Table">
                        <thead>
                            <tr>
                                {headers.map((header: string, idx: number) => (
                                    <th key={idx} className="px-6 py-4 text-left font-bold border-b-4" style={{ borderColor: accentColor, color: accentColor }}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row: any, rowIdx: number) => (
                                <tr key={rowIdx} className="hover:bg-pink-50 transition-colors">
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
