'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const FAQ04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, faqs = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#8b5cf6' } = style;
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

                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6" itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-lg border transition-all overflow-hidden"
                                style={{ borderColor: isOpen ? accentColor : '#e5e7eb' }}
                                itemProp="mainEntity"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-3"
                                >
                                    <span className="font-bold" style={{ color: textColor }} itemProp="name">
                                        {faq.question}
                                    </span>
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                                        style={{ background: isOpen ? accentColor : '#e5e7eb' }}
                                    >
                                        <span style={{ color: isOpen ? '#ffffff' : textColor }}>
                                            {isOpen ? '−' : '+'}
                                        </span>
                                    </div>
                                </button>
                                <div
                                    className="overflow-hidden transition-all"
                                    style={{ maxHeight: isOpen ? '300px' : '0px' }}
                                    itemProp="acceptedAnswer"
                                    itemScope
                                    itemType="https://schema.org/Answer"
                                >
                                    <div className="px-5 pb-4" itemProp="text">
                                        <p className="text-sm opacity-70" style={{ color: textColor }}>
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
