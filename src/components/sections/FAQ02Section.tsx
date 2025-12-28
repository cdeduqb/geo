'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const FAQ02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, faqs = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#3b82f6' } = style;
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
                                className="bg-white rounded-xl border-2 transition-all overflow-hidden"
                                style={{
                                    borderColor: isOpen ? accentColor : '#e5e7eb',
                                    boxShadow: isOpen ? `0 4px 12px ${accentColor}20` : 'none'
                                }}
                                itemProp="mainEntity"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                                >
                                    <span className="text-lg font-bold" style={{ color: textColor }} itemProp="name">
                                        {faq.question}
                                    </span>
                                    <svg
                                        className="w-6 h-6 flex-shrink-0 transition-transform"
                                        style={{
                                            color: isOpen ? accentColor : '#9ca3af',
                                            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                                        }}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div
                                    className="overflow-hidden transition-all"
                                    style={{
                                        maxHeight: isOpen ? '500px' : '0px',
                                    }}
                                    itemProp="acceptedAnswer"
                                    itemScope
                                    itemType="https://schema.org/Answer"
                                >
                                    <div className="px-6 pb-5 pt-2" itemProp="text">
                                        <p className="text-base opacity-70" style={{ color: textColor }}>
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
