'use client';

import { SectionProps } from '@/lib/sections/registry';

export const DataTable05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, headers = [], rows = [] } = data;
    const { backgroundColor = '#ecfdf5', textColor = '#111827', accentColor = '#10b981' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                        {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                )}
                <div className="max-w-5xl mx-auto space-y-4" itemScope itemType="http://schema.org/Table">
                    {rows.map((row: any, rowIdx: number) => (
                        <div key={rowIdx} className="bg-white rounded-xl p-4 shadow flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: accentColor }}>{rowIdx + 1}</div>
                            <div className="flex-1 grid grid-cols-4 gap-4">
                                {row.cells?.map((cell: string, cellIdx: number) => (
                                    <div key={cellIdx}>
                                        <div className="text-xs opacity-50" style={{ color: textColor }}>{headers[cellIdx] || ''}</div>
                                        <div className="font-semibold" style={{ color: textColor }}>{cell}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
