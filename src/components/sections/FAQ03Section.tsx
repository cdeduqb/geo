'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const FAQ03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, faqs = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#10b981' } = style;
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

                <div className="max-w-4xl mx-auto" itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="border-b last:border-b-0 transition-all"
                                style={{ borderColor: '#e5e7eb' }}
                                itemProp="mainEntity"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full py-6 text-left flex items-start justify-between gap-4 group"
                                >
                                    <div className="flex items-start gap-4 flex-1">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white mt-1"
                                            style={{ background: accentColor }}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2" style={{ color: textColor }} itemProp="name">
                                                {faq.question}
                                            </h3>
                                            <div
                                                className="overflow-hidden transition-all"
                                                style={{
                                                    maxHeight: isOpen ? '500px' : '0px',
                                                }}
                                                itemProp="acceptedAnswer"
                                                itemScope
                                                itemType="https://schema.org/Answer"
                                            >
                                                <p className="text-base opacity-70 pr-8" style={{ color: textColor }} itemProp="text">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-6 h-6 flex-shrink-0 transition-all mt-2"
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
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
