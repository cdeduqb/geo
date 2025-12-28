'use client';

import { useState } from 'react';
import { SectionProps } from '@/lib/sections/registry';

// Hero12Section: 视频弹窗横幅
export const Hero12Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        coverImage,
        videoUrl, // YouTube embedded URL or mp4
        btnText
    } = data;

    const {
        backgroundColor = '#111827',
        textColor = '#ffffff',
        accentColor = '#3b82f6',
        overlayOpacity = 0.4
    } = style;

    const [isOpen, setIsOpen] = useState(false);

    return (
        <section
            className="relative py-24 overflow-hidden"
            style={{ background: backgroundColor }}
        >
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{ color: textColor }}
                    >
                        {title}
                    </h2>
                    <p
                        className="text-xl opacity-90 mb-8"
                        style={{ color: textColor }}
                    >
                        {subtitle}
                    </p>
                </div>

                {/* Video Cover Area */}
                <div className="relative max-w-5xl mx-auto group cursor-pointer" onClick={() => setIsOpen(true)}>
                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        {coverImage && (
                            <img
                                src={coverImage}
                                alt="Video Cover"
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        )}

                        {/* Overlay */}
                        <div
                            className="absolute inset-0 transition-opacity group-hover:opacity-50"
                            style={{ background: `rgba(0, 0, 0, ${overlayOpacity})` }}
                        />

                        {/* Play Button */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center pl-1 backdrop-blur-sm transition-all transform group-hover:scale-110 shadow-lg"
                                style={{ background: `${accentColor}cc` }}
                            >
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span className="absolute mt-28 font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                {btnText}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black md:mt-0 mt-12">
                        <iframe
                            src={videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"}
                            title="Video player"
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </section>
    );
};
