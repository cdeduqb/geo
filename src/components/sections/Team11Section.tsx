'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState, useRef, useEffect } from 'react';

// 团队介绍11：轮播展示
export const Team11Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, members = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', cardBgColor = '#f9fafb', arrowColor = '#111827' } = style;

    const scrollContainer = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (scrollContainer.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainer.current) {
            const scrollAmount = 350;
            const newScrollLeft = direction === 'left'
                ? scrollContainer.current.scrollLeft - scrollAmount
                : scrollContainer.current.scrollLeft + scrollAmount;

            scrollContainer.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
            // checkScroll will be called by onScroll event
        }
    };

    return (
        <section className="py-20 overflow-hidden" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className={`p-3 rounded-full border transition-all ${!canScrollLeft ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5'
                                }`}
                            style={{ borderColor: arrowColor, color: arrowColor }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className={`p-3 rounded-full border transition-all ${!canScrollRight ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5'
                                }`}
                            style={{ borderColor: arrowColor, color: arrowColor }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollContainer}
                    onScroll={checkScroll}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    itemScope
                    itemType="http://schema.org/ItemList"
                >
                    {members.map((member: any, index: number) => (
                        <div
                            key={index}
                            className="flex-shrink-0 w-[280px] md:w-[320px] snap-center rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                            style={{ background: cardBgColor }}
                            itemProp="itemListElement"
                            itemScope
                            itemType="http://schema.org/Person"
                        >
                            <div className="h-64 overflow-hidden">
                                <img
                                    src={member.image || `https://images.unsplash.com/photo-${1500000000000 + index}?auto=format&fit=crop&q=80&w=400`}
                                    alt={member.name}
                                    itemProp="image"
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-1" style={{ color: textColor }} itemProp="name">{member.name}</h3>
                                <p className="text-sm font-medium opacity-60 mb-3 uppercase tracking-wider" style={{ color: textColor }} itemProp="jobTitle">{member.role}</p>
                                <p className="opacity-70 line-clamp-3 text-sm leading-relaxed" style={{ color: textColor }} itemProp="description">{member.bio}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
