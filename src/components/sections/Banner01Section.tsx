'use client';

import { SectionProps } from '@/lib/sections/registry';

export const Banner01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { text, buttonText, buttonLink, showCloseButton = true } = data;
    const { backgroundColor = '#3b82f6', textColor = '#ffffff' } = style;

    return (
        <section className="relative" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-center gap-4 text-center">
                    <p className="font-medium" style={{ color: textColor }}>{text}</p>
                    {buttonText && (
                        <a href={buttonLink || '#'} className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white/20 hover:bg-white/30 transition-colors" style={{ color: textColor }}>
                            {buttonText}
                        </a>
                    )}
                </div>
            </div>
            {showCloseButton && (
                <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors" style={{ color: textColor }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            )}
        </section>
    );
};
