'use client';

import { useState } from 'react';
import { SectionProps } from '@/lib/sections/registry';

// Hero35Section: 异形网格轮播 (Bento Grid)
export const Hero35Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        items = [] // { image, title, desc, link, size: 'large' | 'small' | 'tall' }
    } = data;

    const {
        backgroundColor = '#f8fafc',
        textColor = '#0f172a',
        accentColor = '#3b82f6'
    } = style;

    const defaultItems = items;

    // CSS Grid classes helper using Tailwind
    const getSizeClass = (size: string) => {
        switch (size) {
            case 'large': return 'md:col-span-2 md:row-span-2';
            case 'tall': return 'md:col-span-1 md:row-span-2';
            case 'wide': return 'md:col-span-2 md:row-span-1';
            default: return 'md:col-span-1 md:row-span-1'; // small
        }
    };

    return (
        <section className="py-24" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="mb-16 max-w-3xl">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                    {defaultItems.map((item: any, index: number) => (
                        <a
                            key={index}
                            href={item.link || '#'}
                            className={`group relative overflow-hidden rounded-3xl ${getSizeClass(item.size)} transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/80 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                    {item.desc}
                                </p>
                                <span
                                    className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    style={{ background: accentColor }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
