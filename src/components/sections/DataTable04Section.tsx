'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

export const DataTable04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, headers = [], rows = [] } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6' } = style;

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
                        <div className="grid" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
                            {headers.map((header: string, idx: number) => (
                                <div key={idx} className="px-6 py-4 font-bold text-center" style={{ background: accentColor, color: 'white' }}>{header}</div>
                            ))}
                        </div>
                        {rows.map((row: any, rowIdx: number) => (
                            <div key={rowIdx} className="grid border-b border-gray-100" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
                                {row.cells?.map((cell: string, cellIdx: number) => (
                                    <div key={cellIdx} className="px-6 py-4 text-center" style={{ color: textColor }}>{cell}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
