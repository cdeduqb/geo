import DOMPurify from 'isomorphic-dompurify';
import path from 'path';

/**
 * HTML 内容清理配置
 */

// 严格模式：只允许最基本的文本格式标签
const STRICT_CONFIG = {
    ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'strong', 'em', 'span'],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
};

// 标准模式：适用于富文本编辑器内容
const STANDARD_CONFIG = {
    ALLOWED_TAGS: [
        'p', 'br', 'b', 'i', 'strong', 'em', 'u', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'blockquote', 'code', 'pre',
        'hr', 'sup', 'sub',
    ],
    ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'title', 'width', 'height',
        'class', 'id',
        'colspan', 'rowspan',
    ],
    ALLOW_DATA_ATTR: false,
};

// 允许样式模式：包含内联样式（用于模板编辑）
const STYLE_ALLOWED_CONFIG = {
    ...STANDARD_CONFIG,
    ALLOWED_TAGS: [...STANDARD_CONFIG.ALLOWED_TAGS, 'style', 'section', 'article', 'nav', 'footer', 'header'],
    ALLOWED_ATTR: [...STANDARD_CONFIG.ALLOWED_ATTR, 'style'],
};

/**
 * 清理 HTML 内容，防止 XSS 攻击
 * @param html 原始 HTML 内容
 * @param mode 清理模式：'strict' | 'standard' | 'style-allowed'
 * @returns 清理后的安全 HTML
 */
export function sanitizeHTML(
    html: string,
    mode: 'strict' | 'standard' | 'style-allowed' = 'standard'
): string {
    if (!html) return '';

    let config;
    switch (mode) {
        case 'strict':
            config = STRICT_CONFIG;
            break;
        case 'style-allowed':
            config = STYLE_ALLOWED_CONFIG;
            break;
        case 'standard':
        default:
            config = STANDARD_CONFIG;
            break;
    }

    return DOMPurify.sanitize(html, config);
}

/**
 * 清理用户输入的文本（移除所有 HTML 标签）
 */
export function sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });
}

/**
 * 验证文件扩展名是否安全
 */
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
    const ext = path.extname(filename).toLowerCase();
    return allowedExtensions.includes(ext);
}

/**
 * 允许的图片扩展名
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

/**
 * 允许的文档扩展名
 */
export const ALLOWED_DOCUMENT_EXTENSIONS = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

/**
 * 允许的视频扩展名
 */
export const ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.ogg'];

/**
 * 允许的音频扩展名
 */
export const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg'];

/**
 * 所有允许的扩展名（合并）
 */
export const ALL_ALLOWED_EXTENSIONS = [
    ...ALLOWED_IMAGE_EXTENSIONS,
    ...ALLOWED_DOCUMENT_EXTENSIONS,
    ...ALLOWED_VIDEO_EXTENSIONS,
    ...ALLOWED_AUDIO_EXTENSIONS,
];

/**
 * 生成安全的文件名（移除危险字符）
 */
export function sanitizeFilename(filename: string): string {
    // 保留扩展名
    const ext = path.extname(filename);
    const basename = path.basename(filename, ext);

    // 移除危险字符，只保留字母、数字、下划线、连字符
    const safeName = basename.replace(/[^a-zA-Z0-9_-]/g, '_');

    // 限制长度
    const truncated = safeName.substring(0, 100);

    return `${truncated}${ext}`;
}

/**
 * 验证 MIME 类型是否匹配扩展名
 */
export function isValidMimeType(mimeType: string, filename: string): boolean {
    const ext = path.extname(filename).toLowerCase();

    const mimeMap: Record<string, string[]> = {
        '.jpg': ['image/jpeg'],
        '.jpeg': ['image/jpeg'],
        '.png': ['image/png'],
        '.gif': ['image/gif'],
        '.webp': ['image/webp'],
        '.svg': ['image/svg+xml'],
        '.pdf': ['application/pdf'],
        '.mp4': ['video/mp4'],
        '.webm': ['video/webm'],
    };

    const expectedMimes = mimeMap[ext];
    if (!expectedMimes) {
        // 对于不在映射中的扩展名，允许通过
        return true;
    }

    return expectedMimes.includes(mimeType.toLowerCase());
}
