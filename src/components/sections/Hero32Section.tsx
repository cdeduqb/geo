'use client';

import { useState, useRef, useEffect } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';

// Hero32Section: 电影感视频轮播
export const Hero32Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        slides = [], // { video, image, title, subtitle, btnText, btnLink, btnTarget }
        isMainTitle = true
    } = data;

    const {
        overlayOpacity = 0.5,
        textColor = '#ffffff',
        accentColor = '#e11d48',
        titleFontSize = '',
        titleFontSizeMobile = ''
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    const defaultSlides = slides.length > 0 ? slides : [
        {
            video: 'https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4',
            image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: 'Cinematic Experience',
            subtitle: 'Immerse yourself in high-definition stories that move you.',
            btnText: 'Watch Trailer',
            btnLink: '#'
        },
        {
            video: 'https://videos.pexels.com/video-files/3129957/3129957-hd_1920_1080_25fps.mp4',
            image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
            title: 'Urban Rhythm',
            subtitle: 'Feel the pulse of the city like never before.',
            btnText: 'Explore CityLink',
            btnLink: '#'
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const nextSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => (prev + 1) % defaultSlides.length);
        setTimeout(() => setIsTransitioning(false), 1000);
    };

    const prevSlide = () => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentSlide(prev => (prev - 1 + defaultSlides.length) % defaultSlides.length);
        setTimeout(() => setIsTransitioning(false), 1000);
    };

    // Auto-play videos when they become active
    useEffect(() => {
        videoRefs.current.forEach((vid, index) => {
            if (vid) {
                if (index === currentSlide) {
                    vid.currentTime = 0;
                    vid.play().catch(e => console.log('Autoplay blocked', e));
                } else {
                    vid.pause();
                }
            }
        });
    }, [currentSlide]);

    return (
        <section className="relative h-screen min-h-[600px] overflow-hidden bg-black group">
            {defaultSlides.map((slide: any, index: number) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    {/* Media Layer */}
                    <div className="absolute inset-0">
                        {slide.video ? (
                            <video
                                ref={el => { if (el) videoRefs.current[index] = el; }} // Note: videoRefs callback must be void
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                poster={slide.image}
                            >
                                <source src={slide.video} type="video/mp4" />
                            </video>
                        ) : (
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.image})` }}
                            />
                        )}
                        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }}></div>
                    </div>

                    {/* Content Layer */}
                    <div className="absolute inset-0 flex items-center px-8 md:px-20">
                        <div className="max-w-4xl">
                            <TitleTag
                                className={`font-black uppercase tracking-tighter mb-6 transform transition-all duration-1000 delay-300 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                    } ${!titleFontSize ? 'md:text-8xl' : ''} ${!titleFontSizeMobile ? 'text-5xl' : ''}`}
                                style={{
                                    color: textColor,
                                    fontSize: (typeof window !== 'undefined' && window.innerWidth < 768)
                                        ? titleFontSizeMobile || titleFontSize || undefined
                                        : titleFontSize || undefined
                                }}
                            >
                                {slide.title}
                            </TitleTag>
                            <p
                                className={`text-xl md:text-2xl mb-10 max-w-2xl transform transition-all duration-1000 delay-500 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}
                                style={{ color: textColor, opacity: 0.9 }}
                            >
                                {slide.subtitle}
                            </p>

                            {slide.btnText && (
                                <div className={`transform transition-all duration-1000 delay-700 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                    }`}>
                                    <a
                                        href={slide.btnLink || '#'}
                                        target={slide.btnTarget || '_self'}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
                                        style={{ background: accentColor, color: '#fff' }}
                                    >
                                        {slide.btnText}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination / Progress */}
            <div className="absolute bottom-12 left-8 md:left-20 z-20 flex items-end gap-6">
                <div className="text-6xl font-black text-white/20">
                    {String(currentSlide + 1).padStart(2, '0')}
                </div>
                <div className="flex gap-2 mb-4">
                    {defaultSlides.map((_: any, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 transition-all duration-300 ${currentSlide === idx ? 'w-16 bg-white' : 'w-8 bg-white/30 hover:bg-white/50'
                                }`}
                            style={{ background: currentSlide === idx ? accentColor : undefined }}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute bottom-12 right-8 z-20 flex gap-4">
                <button
                    onClick={prevSlide}
                    className="w-14 h-14 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-14 h-14 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </section>
    );
};
