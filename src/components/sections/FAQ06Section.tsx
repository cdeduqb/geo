'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

export const FAQ06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, faqs = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#06b6d4' } = style;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-xl opacity-70" style={{ color: textColor }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                <div className="max-w-4xl mx-auto space-y-4" itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={index}
                                className="rounded-xl overflow-hidden transition-all"
                                style={{
                                    background: isOpen
                                        ? `linear-gradient(135deg, ${accentColor}20, transparent)`
                                        : 'rgba(255,255,255,0.05)',
                                    border: `1px solid ${isOpen ? accentColor : 'rgba(255,255,255,0.1)'}`
                                }}
                                itemProp="mainEntity"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-4 flex-1">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold transition-all"
                                            style={{
                                                background: isOpen ? accentColor : 'rgba(255,255,255,0.1)',
                                                color: isOpen ? '#0f172a' : textColor
                                            }}
                                        >
                                            Q
                                        </div>
                                        <span className="text-lg font-bold" style={{ color: textColor }} itemProp="name">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                                        style={{
                                            background: isOpen ? accentColor : 'rgba(255,255,255,0.1)',
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}
                                    >
                                        <svg
                                            className="w-4 h-4"
                                            style={{ color: isOpen ? '#0f172a' : textColor }}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                <div
                                    className="overflow-hidden transition-all"
                                    style={{ maxHeight: isOpen ? '500px' : '0px' }}
                                    itemProp="acceptedAnswer"
                                    itemScope
                                    itemType="https://schema.org/Answer"
                                >
                                    <div className="px-6 pb-5 flex items-start gap-4" itemProp="text">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
                                            style={{
                                                background: `${accentColor}30`,
                                                color: accentColor
                                            }}
                                        >
                                            A
                                        </div>
                                        <p className="text-base opacity-80 pt-3" style={{ color: textColor }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
