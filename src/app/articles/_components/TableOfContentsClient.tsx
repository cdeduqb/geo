'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
    id: string;
    text: string;
    level: number;
}

export default function TableOfContentsClient() {
    const [toc, setToc] = useState<TOCItem[]>([]);
    const [activeId, setActiveId] = useState<string>('');

    useEffect(() => {
        // Find all headings within the GEO-blog-content or GEO-traditional-content area
        const contentArea = document.querySelector('.GEO-blog-content') || document.querySelector('.GEO-traditional-content');
        if (!contentArea) return;

        const headings = contentArea.querySelectorAll('h2, h3');
        const items: TOCItem[] = [];

        headings.forEach((h, index) => {
            // If the element somehow lacks an id, give it one
            if (!h.id) {
                h.id = `heading-${index}`;
            }
            items.push({
                id: h.id,
                text: (h as HTMLElement).innerText || h.textContent || '',
                level: h.tagName.toLowerCase() === 'h2' ? 2 : 3
            });
        });

        setToc(items);

        setToc(items);

        // 更加精确的直接滚动监听算例 (避免 IntersectionObserver 只有在标题出现时才触发的问题)
        const handleScroll = () => {
            const headingElements = Array.from(contentArea.querySelectorAll('h2, h3'));
            let currentActiveId = headingElements[0]?.id || '';
            for (let i = 0; i < headingElements.length; i++) {
                const rect = headingElements[i].getBoundingClientRect();
                // 当标题滚动到距离视口顶部 150px (或以上) 时，设为活跃
                if (rect.top < 150) {
                    currentActiveId = headingElements[i].id;
                }
            }
            if (currentActiveId) {
                setActiveId(currentActiveId);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        
        // 初始状态触发一次
        setTimeout(handleScroll, 100);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (toc.length === 0) return null;

    return (
        <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4 hidden lg:block scrollbar-hide">
            <h4 className="font-bold text-sm text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">目录导航</h4>
            <ul className="space-y-2.5 relative border-l border-gray-100 pl-4">
                {toc.map(item => (
                    <li key={item.id} className={`${item.level === 3 ? 'pl-4' : ''}`}>
                        <a
                            href={`#${item.id}`}
                            className={`block text-sm transition-all duration-300 ${activeId === item.id 
                                ? 'text-indigo-600 font-bold translate-x-1' 
                                : 'text-gray-500 hover:text-gray-900 hover:translate-x-1'
                            }`}
                        >
                            {activeId === item.id && (
                                <span className="absolute left-[-2px] w-[3px] bg-indigo-600 rounded-full h-4 transition-all duration-300" style={{ marginTop: '2px' }} />
                            )}
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
