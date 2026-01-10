'use client';

import { sanitizeHTML } from '@/lib/security/sanitize';

interface SafeHTMLProps {
    html: string;
    mode?: 'strict' | 'standard' | 'style-allowed';
    className?: string;
}

/**
 * 安全的 HTML 渲染组件
 * 自动清理用户输入的 HTML，防止 XSS 攻击
 */
export function SafeHTML({ html, mode = 'standard', className }: SafeHTMLProps) {
    const cleanHTML = sanitizeHTML(html, mode);

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: cleanHTML }}
        />
    );
}

/**
 * 渲染富文本编辑器内容（标准模式）
 */
export function RichTextContent({ content, className }: { content: string; className?: string }) {
    return <SafeHTML html={content} mode="standard" className={className} />;
}

/**
 * 渲染用户自定义 HTML（允许样式，用于模板编辑）
 */
export function CustomHTML({ html, className }: { html: string; className?: string }) {
    return <SafeHTML html={html} mode="style-allowed" className={className} />;
}
