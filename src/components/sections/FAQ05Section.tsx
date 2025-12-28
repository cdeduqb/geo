'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const FAQ05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, faqs = [] } = data;
    const { backgroundColor = '#fafafa', textColor = '#111827', accentColor = '#f59e0b' } = style;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const icons = ['?', '!', '★', '✓', '◆', '●'];

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

                <div className="max-w-4xl mx-auto space-y-3" itemScope itemType="https://schema.org/FAQPage">
                    {faqs.map((faq: any, index: number) => {
                        const isOpen = openIndex === index;
                        const icon = icons[index % icons.length];

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 transition-all"
                                style={{
                                    boxShadow: isOpen ? `0 8px 20px ${accentColor}30` : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                                itemProp="mainEntity"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <button
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    className="w-full text-left flex items-start gap-4"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-white"
                                        style={{ background: accentColor }}
                                    >
                                        {icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-2" style={{ color: textColor }} itemProp="name">
                                            {faq.question}
                                        </h3>
                                        <div
                                            className="overflow-hidden transition-all"
                                            style={{ maxHeight: isOpen ? '500px' : '0px' }}
                                            itemProp="acceptedAnswer"
                                            itemScope
                                            itemType="https://schema.org/Answer"
                                        >
                                            <p className="text-sm opacity-70 mt-2" style={{ color: textColor }} itemProp="text">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                    <svg
                                        className="w-5 h-5 flex-shrink-0 mt-1 transition-transform"
                                        style={{
                                            color: accentColor,
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
