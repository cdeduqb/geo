'use client';

import { useState, useEffect } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';

// Hero22Section: 打字机特效
export const Hero22Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        prefix,
        words = [], // Array of strings to cycle
        suffix,
        btnText,
        btnLink,
        btnTarget,
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#2563eb',
        cursorColor = '#ef4444'
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    // Logic for typing animation
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Default words fallback
    const displayWords = words.length > 0 ? words : ['快速', '高效', '智能', '安全'];

    useEffect(() => {
        const fullText = displayWords[currentWordIndex];

        let typeSpeed = isDeleting ? 50 : 150;

        if (!isDeleting && currentText === fullText) {
            // Finished typing word, wait before deleting
            typeSpeed = 2000;
            setIsDeleting(true);
        } else if (isDeleting && currentText === '') {
            // Finished deleting, move to next word
            setIsDeleting(false);
            setCurrentWordIndex((prev) => (prev + 1) % displayWords.length);
            typeSpeed = 500;
        }

        const timer = setTimeout(() => {
            const nextText = isDeleting
                ? fullText.substring(0, currentText.length - 1)
                : fullText.substring(0, currentText.length + 1);

            setCurrentText(nextText);

            // Should I use isDeleting in next render? It's set for next cycle.
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [currentText, isDeleting, currentWordIndex, displayWords]);

    return (
        <section
            className="py-32 flex flex-col items-center justify-center text-center min-h-[60vh]"
            style={{ background: backgroundColor }}
        >
            <div className="container mx-auto px-4">
                <TitleTag
                    className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                    style={{ color: textColor }}
                >
                    {prefix}
                    <span style={{ color: accentColor }} className="mx-2 md:mx-4">
                        {currentText}
                    </span>
                    <span
                        className="animate-pulse inline-block w-1 md:w-2 h-12 md:h-16 align-middle ml-1"
                        style={{ background: cursorColor }}
                    ></span>
                    <br className="md:hidden" />
                    {suffix}
                </TitleTag>

                {btnText && (
                    <a
                        href={btnLink || '#'}
                        target={btnTarget || '_self'}
                        className="mt-12 inline-block px-10 py-5 text-xl font-bold text-white rounded-full shadow-lg transform hover:scale-105 transition-all"
                        style={{ background: accentColor }}
                    >
                        {btnText}
                    </a>
                )}
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-22',
    name: '打字机效果横幅',
    description: '具有动态打字效果的极简文字横幅',
    category: 'layout',
    component: Hero22Section,
    defaultData: {
        prefix: '我们的服务是',
        words: ['快速的', '高效的', '智能的', '可信赖的'],
        suffix: '且专业的',
        btnText: 'u4e86u89e3u66f4u591a',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#2563eb',
        cursorColor: '#ef4444'
    },
    schema: {
        data: {
            prefix: { type: 'text', label: '前缀文字' },
            words: { type: 'list', label: '循环词组', itemSchema: { value: { type: 'text' } } as any },
            suffix: { type: 'text', label: '后缀文字' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色 (文字)' },
            cursorColor: { type: 'color', label: '光标颜色' }
        }
    }
});
