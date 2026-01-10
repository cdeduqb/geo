'use client';

import { useEffect } from 'react';

interface ViewCounterProps {
    slug: string;
}

/**
 * 客户端组件：用于在静态页面中异步增加文章浏览量
 */
export default function ViewCounter({ slug }: ViewCounterProps) {
    useEffect(() => {
        if (!slug) return;

        // 加载后延迟执行，避免影响首屏渲染，且防止刷流量
        const timer = setTimeout(() => {
            fetch(`/api/articles/${encodeURIComponent(slug)}/view`, {
                method: 'POST',
            }).catch(err => console.error('Failed to increment view count:', err));
        }, 2000);

        return () => clearTimeout(timer);
    }, [slug]);

    return null; // 此组件不渲染任何内容
}
