'use client';

import { useEffect, useRef, useState } from 'react';
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Image as ImageIcon, Heading1, Heading2,
    Heading3, Quote, Code, Minus, Undo, Redo, Palette, Eraser,
    ChevronDown, Sparkles, Maximize2, Minimize2, X, Table2
} from 'lucide-react';
import LinkModal from './LinkModal';
import ImageModal from './ImageModal';
import AIRewritePanel from './AIRewritePanel';
import { FONT_FAMILIES } from './fonts';

// Tag name mapping for user-friendly display
const TAG_NAMES: Record<string, string> = {
    'div': '区块',
    'p': '段落',
    'span': '文本',
    'a': '链接',
    'img': '图片',
    'ul': '列表',
    'ol': '有序列表',
    'li': '列表项',
    'h1': '标题1',
    'h2': '标题2',
    'h3': '标题3',
    'h4': '标题4',
    'h5': '标题5',
    'h6': '标题6',
    'table': '表格',
    'tr': '行',
    'td': '单元格',
    'th': '表头',
    'blockquote': '引用',
    'pre': '代码块',
    'code': '代码',
    'strong': '粗体',
    'b': '粗体',
    'em': '斜体',
    'i': '斜体',
    'u': '下划线',
    'nav': '导航',
    'header': '页眉',
    'footer': '页脚',
    'section': '区域',
    'article': '文章',
    'aside': '侧边栏',
    'main': '主体',
    'form': '表单',
    'input': '输入框',
    'button': '按钮',
    'label': '标签',
};

const getTagName = (tag: string) => {
    return TAG_NAMES[tag.toLowerCase()] || tag.toUpperCase();
};

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const isUpdatingRef = useRef(false);

    // Save and restore selection
    const savedSelectionRef = useRef<Range | null>(null);

    // Modals
    const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    // Dropdowns
    const [isHeadingDropdownOpen, setIsHeadingDropdownOpen] = useState(false);
    const [isColorDropdownOpen, setIsColorDropdownOpen] = useState(false);
    const [isFontSizeDropdownOpen, setIsFontSizeDropdownOpen] = useState(false);
    const [isFontFamilyDropdownOpen, setIsFontFamilyDropdownOpen] = useState(false);

    // AI Rewrite
    const [selectedText, setSelectedText] = useState('');
    const [showAIRewrite, setShowAIRewrite] = useState(false);
    const [aiButtonPosition, setAIButtonPosition] = useState({ x: 0, y: 0 });

    // Full screen mode
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Active states
    const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Initialize content on mount
    useEffect(() => {
        if (contentEditableRef.current && !contentEditableRef.current.innerHTML) {
            contentEditableRef.current.innerHTML = value || '';
        }
    }, [isMounted]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.heading-dropdown') && !target.closest('.color-dropdown') &&
                !target.closest('.fontsize-dropdown') && !target.closest('.fontfamily-dropdown') &&
                !target.closest('.link-popover') && !target.closest('.image-popover')) {
                setIsHeadingDropdownOpen(false);
                setIsColorDropdownOpen(false);
                setIsFontSizeDropdownOpen(false);
                setIsFontFamilyDropdownOpen(false);
                setIsLinkModalOpen(false);
                setIsImageModalOpen(false);
            }
        };

        if (isHeadingDropdownOpen || isColorDropdownOpen || isFontSizeDropdownOpen || isFontFamilyDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isHeadingDropdownOpen, isColorDropdownOpen, isFontSizeDropdownOpen, isFontFamilyDropdownOpen]);

    // Handle external value changes (only when not actively editing)
    useEffect(() => {
        if (contentEditableRef.current && !isUpdatingRef.current) {
            const currentContent = contentEditableRef.current.innerHTML;
            // 只有当传入值确实不同时才更新，移除对 focus 的限制，以便 AI 一键优化等功能生效
            if (value !== currentContent) {
                contentEditableRef.current.innerHTML = value || '';
            }
        }
    }, [value]);

    // Breadcrumbs
    const [breadcrumbs, setBreadcrumbs] = useState<{ tag: string; element: HTMLElement }[]>([]);

    // Update active formats, AI rewrite button, and breadcrumbs on selection change
    useEffect(() => {
        const updateFormats = () => {
            const formats = new Set<string>();

            if (document.queryCommandState('bold')) formats.add('bold');
            if (document.queryCommandState('italic')) formats.add('italic');
            if (document.queryCommandState('underline')) formats.add('underline');
            if (document.queryCommandState('strikeThrough')) formats.add('strikethrough');
            if (document.queryCommandState('insertUnorderedList')) formats.add('ul');
            if (document.queryCommandState('insertOrderedList')) formats.add('ol');

            setActiveFormats(formats);

            const selection = window.getSelection();

            // Update breadcrumbs
            if (selection && selection.rangeCount > 0 && contentEditableRef.current) {
                const range = selection.getRangeAt(0);
                let node = range.commonAncestorContainer;

                if (node.nodeType === Node.TEXT_NODE) {
                    node = node.parentNode!;
                }

                const path: { tag: string; element: HTMLElement }[] = [];
                let current = node as HTMLElement;

                // 安全检查：确保 current 是元素节点且有 tagName
                while (
                    current &&
                    current !== contentEditableRef.current &&
                    contentEditableRef.current.contains(current)
                ) {
                    if (current.nodeType === Node.ELEMENT_NODE && current.tagName) {
                        path.unshift({
                            tag: current.tagName.toLowerCase(),
                            element: current
                        });
                    }
                    current = current.parentElement!;
                }
                setBreadcrumbs(path);
            } else {
                setBreadcrumbs([]);
            }

            // Check for text selection for AI rewrite
            const text = selection?.toString().trim() || '';

            if (text.length > 0 && contentEditableRef.current?.contains(selection?.anchorNode || null)) {
                // 尝试获取带格式的 HTML
                let content = text;
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const fragment = range.cloneContents();
                    const div = document.createElement('div');
                    div.appendChild(fragment);
                    // 如果包含 HTML 标签,则使用 HTML 内容
                    if (/<[^>]+>/.test(div.innerHTML)) {
                        content = div.innerHTML;
                    }
                }

                setSelectedText(content);
                saveSelection();

                // Position the button at the Center-Top of the overall selection
                const range = selection!.getRangeAt(0);
                const mainRect = range.getBoundingClientRect();

                // Horizontal center: mainRect.left + half width - half button width (approx 60px)
                let x = mainRect.left + (mainRect.width / 2) - 60;
                let y = mainRect.top - 50;

                // Boundary checks
                if (x < 12) x = 12;
                if (x + 130 > window.innerWidth) x = window.innerWidth - 140;

                // Vertical safe area (avoid toolbar)
                if (y < 65) {
                    y = mainRect.bottom + 12;
                }

                setAIButtonPosition({ x, y });
            } else {
                // 只在 AI 重写面板未打开时清除选中文本
                // 防止用户点击面板中的输入框时，原文消失
                if (!showAIRewrite) {
                    setSelectedText('');
                }
            }
        };

        document.addEventListener('selectionchange', updateFormats);
        return () => document.removeEventListener('selectionchange', updateFormats);
    }, []);

    const selectElement = (element: HTMLElement) => {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNode(element);
        selection?.removeAllRanges();
        selection?.addRange(range);
        // Trigger update manually to show AI button
        contentEditableRef.current?.focus();
    };

    const handleInput = () => {
        if (contentEditableRef.current) {
            isUpdatingRef.current = true;
            onChange(contentEditableRef.current.innerHTML);
            setTimeout(() => {
                isUpdatingRef.current = false;
            }, 0);
        }
    };

    // Toggle full screen
    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedSelectionRef.current = selection.getRangeAt(0);
        }
    };

    const restoreSelection = () => {
        const selection = window.getSelection();
        if (savedSelectionRef.current && selection) {
            selection.removeAllRanges();
            selection.addRange(savedSelectionRef.current);
        }
    };

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        contentEditableRef.current?.focus();
        handleInput();
    };

    const buttonClass = (format?: string) => {
        const isActive = format ? activeFormats.has(format) : false;
        return `p-1.5 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${isActive ? 'bg-gray-200  text-blue-600 ' : 'text-gray-600 '
            }`;
    };

    const formatAsHeading = (level: number) => {
        execCommand('formatBlock', `H${level}`);
        setIsHeadingDropdownOpen(false);
    };

    const insertCodeBlock = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const pre = document.createElement('pre');
        const code = document.createElement('code');

        // 获取选中的文本，如果没有则使用空格
        const text = selection.toString();
        code.textContent = text || ' ';
        pre.appendChild(code);

        // 插入代码块
        range.deleteContents();
        range.insertNode(pre);

        // 移动光标到代码块内
        range.selectNodeContents(code);
        range.collapse(false); // 光标移到末尾
        selection.removeAllRanges();
        selection.addRange(range);

        handleInput();
    };

    const insertTable = () => {
        const html = `
            <table class="border-collapse border border-gray-300 w-full my-4">
                <thead>
                    <tr>
                        <th class="border border-gray-300 p-2 bg-gray-50">列 1</th>
                        <th class="border border-gray-300 p-2 bg-gray-50">列 2</th>
                        <th class="border border-gray-300 p-2 bg-gray-50">列 3</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="border border-gray-300 p-2">数据 1</td>
                        <td class="border border-gray-300 p-2">数据 2</td>
                        <td class="border border-gray-300 p-2">数据 3</td>
                    </tr>
                    <tr>
                        <td class="border border-gray-300 p-2">数据 4</td>
                        <td class="border border-gray-300 p-2">数据 5</td>
                        <td class="border border-gray-300 p-2">数据 6</td>
                    </tr>
                </tbody>
            </table>
            <p><br></p>
        `;
        execCommand('insertHTML', html);
    };

    const insertHorizontalRule = () => {
        execCommand('insertHorizontalRule');
    };

    const removeFormat = () => {
        execCommand('removeFormat');
    };

    const handleLinkSubmit = (url: string, text?: string, openInNewTab?: boolean) => {
        // 先关闭模态框，防止焦点竞争
        setIsLinkModalOpen(false);

        // 确保编辑器获得焦点
        if (contentEditableRef.current) {
            contentEditableRef.current.focus();
        }

        // 尝试恢复选区
        restoreSelection();

        // 给一点时间让浏览器恢复焦点状态（可选，但在某些浏览器有帮助）
        setTimeout(() => {
            if (text) {
                // 如果提供了文本，使用 insertHTML 插入完整链接
                const html = `<a href="${url}" target="${openInNewTab ? '_blank' : '_self'}" class="text-blue-600 hover:underline">${text}</a>`;
                document.execCommand('insertHTML', false, html);
            } else {
                // 否则只是简单地将选中文字变为链接，或者插入链接地址
                document.execCommand('createLink', false, url);

                // 如果是 createLink，我们需要随后手动设置 target 和 class，这比较麻烦
                // 所以如果可能，尽量使用 insertHTML
            }
            handleInput();
        }, 10);
    };

    const handleImageSubmit = (url: string, alt?: string) => {
        console.log('[RichTextEditor] handleImageSubmit started', { url, alt });

        // 确保编辑器获得焦点
        if (contentEditableRef.current) {
            contentEditableRef.current.focus();
        }

        // 恢复选区
        restoreSelection();

        console.log('[RichTextEditor] Inserting HTML for image...');
        const html = `<img src="${url}" alt="${alt || ''}" class="max-w-full h-auto rounded-lg my-4" />`;
        const success = document.execCommand('insertHTML', false, html);

        console.log('[RichTextEditor] execCommand success:', success);

        handleInput();
        setIsImageModalOpen(false);
    };

    const colors = [
        '#000000', '#4B5563', '#DC2626', '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777',
        '#FFFFFF', '#F3F4F6', '#FCA5A5', '#FCD34D', '#6EE7B7', '#93C5FD', '#C4B5FD', '#F9A8D4'
    ];

    const setTextColor = (color: string) => {
        execCommand('foreColor', color);
        setIsColorDropdownOpen(false);
    };

    const setBackgroundColor = (color: string) => {
        execCommand('hiliteColor', color);
        setIsColorDropdownOpen(false);
    };

    const setFontSize = (size: string) => {
        execCommand('fontSize', '7'); // HTML fontSize uses 1-7 scale
        // Then wrap selection with span tag with actual size
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = size;
            range.surroundContents(span);
        }
        setIsFontSizeDropdownOpen(false);
        handleInput();
    };

    const setFontFamily = (font: string) => {
        // execCommand('fontName', font); // Deprecated and unreliable
        // Wrap selection with span tag with actual font family
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontFamily = font;

            // surroundContents can fail if the range splits a non-text node.
            // A safer basic approaches for simple text editors often involve execCommand
            // but since that's failing, we try to force it.
            // If surroundContents fails, we might just want to use execCommand as fallback or
            // try to apply style to the parent element if it's a text node.
            try {
                range.surroundContents(span);
            } catch (e) {
                // If complex selection, fallback to execCommand which handles splitting better
                document.execCommand('fontName', false, font);
            }
        }
        setIsFontFamilyDropdownOpen(false);
        handleInput();
    };

    return (
        <>
            {/* Full screen wrapper */}
            <div className={isFullScreen ? 'fixed inset-0 z-50 bg-white  flex flex-col' : ''}>
                {/* Full screen header */}
                {isFullScreen && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200  bg-gray-50 ">
                        <h2 className="text-lg font-semibold text-gray-900 ">全屏编辑</h2>
                        <button
                            type="button"
                            onClick={toggleFullScreen}
                            className="p-2 hover:bg-gray-200 :bg-gray-700 rounded-md transition-colors"
                            title="退出全屏"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <div className={`border border-gray-300  rounded-lg bg-white  flex flex-col relative ${isFullScreen ? 'flex-1 border-0 rounded-none' : 'h-[800px]'}`}>
                    {/* Toolbar */}
                    <div className="border-b border-gray-200  p-2 flex flex-wrap gap-1 bg-gray-50  rounded-t-lg">
                        {/* ... (toolbar buttons) ... */}
                        {/* Undo/Redo */}
                        <button type="button" onClick={() => execCommand('undo')} className={buttonClass()} title="撤销 (Ctrl+Z)">
                            <Undo className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('redo')} className={buttonClass()} title="重做 (Ctrl+Shift+Z)">
                            <Redo className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Text Styles */}
                        <button type="button" onClick={() => execCommand('bold')} className={buttonClass('bold')} title="粗体 (Ctrl+B)">
                            <Bold className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('italic')} className={buttonClass('italic')} title="斜体 (Ctrl+I)">
                            <Italic className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('underline')} className={buttonClass('underline')} title="下划线 (Ctrl+U)">
                            <UnderlineIcon className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('strikeThrough')} className={buttonClass('strikethrough')} title="删除线">
                            <Strikethrough className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Headings Dropdown */}
                        <div className="relative heading-dropdown">
                            <button
                                type="button"
                                onClick={() => {
                                    saveSelection();
                                    setIsHeadingDropdownOpen(!isHeadingDropdownOpen);
                                }}
                                className={buttonClass()}
                                title="标题"
                            >
                                <div className="flex items-center gap-1">
                                    <Heading1 className="w-4 h-4" />
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </button>
                            {isHeadingDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] min-w-[120px] animate-in slide-in-from-top-1 duration-200 overflow-hidden">
                                    {[1, 2, 3, 4, 5, 6].map((level) => (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => formatAsHeading(level)}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-100 :bg-gray-700 text-gray-700 "
                                        >
                                            标题 {level}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Font Size Dropdown */}
                        <div className="relative fontsize-dropdown">
                            <button
                                type="button"
                                onClick={() => {
                                    saveSelection();
                                    setIsFontSizeDropdownOpen(!isFontSizeDropdownOpen);
                                }}
                                className={buttonClass()}
                                title="字号"
                            >
                                <div className="flex items-center gap-1 text-xs font-semibold">
                                    A
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </button>
                            {isFontSizeDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] min-w-[100px] max-h-[400px] overflow-y-auto animate-in slide-in-from-top-1 duration-200">
                                    {['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '60px', '72px', '96px', '128px', '144px', '160px'].map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => setFontSize(size)}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-100 :bg-gray-700 text-gray-700  text-sm"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Font Family Dropdown */}
                        <div className="relative fontfamily-dropdown">
                            <button
                                type="button"
                                onClick={() => {
                                    saveSelection();
                                    setIsFontFamilyDropdownOpen(!isFontFamilyDropdownOpen);
                                }}
                                className={buttonClass()}
                                title="字体"
                            >
                                <div className="flex items-center gap-1 text-xs">
                                    字体
                                    <ChevronDown className="w-3 h-3" />
                                </div>
                            </button>
                            {isFontFamilyDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] min-w-[200px] max-h-[400px] overflow-y-auto animate-in slide-in-from-top-1 duration-200">
                                    {FONT_FAMILIES.map((font) => (
                                        <button
                                            key={font.value}
                                            type="button"
                                            onClick={() => setFontFamily(font.value)}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-100 :bg-gray-700 text-gray-700  text-sm truncate"
                                            style={{ fontFamily: font.value }}
                                            title={font.name}
                                        >
                                            {font.name}
                                        </button>
                                    ))}
                                </div>
                            )}

                        </div>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Alignment */}
                        <button type="button" onClick={() => execCommand('justifyLeft')} className={buttonClass()} title="左对齐">
                            <AlignLeft className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyCenter')} className={buttonClass()} title="居中">
                            <AlignCenter className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('justifyRight')} className={buttonClass()} title="右对齐">
                            <AlignRight className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Lists */}
                        <button type="button" onClick={() => execCommand('insertUnorderedList')} className={buttonClass('ul')} title="无序列表">
                            <List className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => execCommand('insertOrderedList')} className={buttonClass('ol')} title="有序列表">
                            <ListOrdered className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Special Elements */}
                        <button type="button" onClick={() => execCommand('formatBlock', 'blockquote')} className={buttonClass()} title="引用">
                            <Quote className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={insertCodeBlock} className={buttonClass()} title="代码块">
                            <Code className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={insertTable} className={buttonClass()} title="插入表格">
                            <Table2 className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={insertHorizontalRule} className={buttonClass()} title="分割线">
                            <Minus className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Link & Image */}
                        <button
                            type="button"
                            onClick={() => {
                                saveSelection();
                                setIsLinkModalOpen(!isLinkModalOpen);
                                setIsImageModalOpen(false);
                            }}
                            className={buttonClass()}
                            title="插入链接"
                        >
                            <LinkIcon className="w-4 h-4" />
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                saveSelection();
                                setIsImageModalOpen(!isImageModalOpen);
                                setIsLinkModalOpen(false);
                            }}
                            className={buttonClass()}
                            title="插入图片"
                        >
                            <ImageIcon className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Color Picker */}
                        <div className="relative color-dropdown">
                            <button
                                type="button"
                                onClick={() => {
                                    saveSelection();
                                    setIsColorDropdownOpen(!isColorDropdownOpen);
                                }}
                                className={buttonClass()}
                                title="文字颜色"
                            >
                                <Palette className="w-4 h-4" />
                            </button>
                            {isColorDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl z-[200] p-4 w-64 animate-in slide-in-from-top-2 duration-200">
                                    <div className="text-xs text-gray-600  mb-1">文字颜色</div>
                                    <div className="grid grid-cols-8 gap-1 mb-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setTextColor(color)}
                                                className="w-5 h-5 rounded border border-gray-300  hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-600  mb-1">背景颜色</div>
                                    <div className="grid grid-cols-8 gap-1">
                                        {colors.map((color) => (
                                            <button
                                                key={`bg-${color}`}
                                                type="button"
                                                onClick={() => setBackgroundColor(color)}
                                                className="w-5 h-5 rounded border border-gray-300  hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clear Format */}
                        <button type="button" onClick={removeFormat} className={buttonClass()} title="清除格式">
                            <Eraser className="w-4 h-4" />
                        </button>

                        <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                        {/* Full Screen Toggle */}
                        <button
                            type="button"
                            onClick={toggleFullScreen}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors text-xs font-medium whitespace-nowrap ml-auto ${isFullScreen
                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200   '
                                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200   '
                                }`}
                            title={isFullScreen ? "退出全屏" : "全屏编辑"}
                        >
                            {isFullScreen ? (
                                <>
                                    <Minimize2 className="w-3.5 h-3.5" />
                                    <span>退出全屏</span>
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="w-3.5 h-3.5" />
                                    <span>全屏编辑</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Editor Area */}
                    <div
                        ref={contentEditableRef}
                        contentEditable
                        onInput={handleInput}
                        onBlur={handleInput}
                        className="flex-1 p-4 overflow-y-auto outline-none prose prose-sm  max-w-none"
                        suppressContentEditableWarning
                    />

                    {/* Moved Modals to content area */}
                    <LinkModal
                        isOpen={isLinkModalOpen}
                        onClose={() => setIsLinkModalOpen(false)}
                        onSubmit={handleLinkSubmit}
                        isPopover={true}
                    />
                    <ImageModal
                        isOpen={isImageModalOpen}
                        onClose={() => setIsImageModalOpen(false)}
                        onSubmit={handleImageSubmit}
                        contextText={selectedText}
                        isPopover={true}
                    />

                    {/* Breadcrumbs Status Bar */}
                    <div className="border-t border-gray-200  px-3 py-1 bg-gray-50  flex items-center gap-1 text-xs text-gray-500  overflow-x-auto">
                        <span className="shrink-0">选中路径:</span>
                        {breadcrumbs.length > 0 ? (
                            breadcrumbs.map((item, index) => (
                                <div key={index} className="flex items-center">
                                    {index > 0 && <span className="mx-1 text-gray-300">/</span>}
                                    <button
                                        onClick={() => selectElement(item.element)}
                                        className="hover:text-blue-600 :text-blue-400 hover:bg-blue-50 :bg-blue-900/20 px-1 rounded transition-colors font-medium"
                                        title={`点击选中此${getTagName(item.tag)}`}
                                    >
                                        {getTagName(item.tag)}
                                    </button>
                                </div>
                            ))
                        ) : (
                            <span className="italic opacity-50">无选择</span>
                        )}
                    </div>
                </div>

                {/* Floating AI Rewrite Button */}
                {
                    selectedText && !showAIRewrite && (
                        <div
                            style={{
                                position: 'fixed',
                                left: aiButtonPosition.x,
                                top: aiButtonPosition.y,
                                zIndex: 9999
                            }}
                            className="animate-in fade-in zoom-in duration-300 pointer-events-none"
                        >
                            <button
                                type="button"
                                onClick={() => setShowAIRewrite(true)}
                                className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-white/20 text-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Sparkles className="w-3.5 h-3.5 text-blue-400 group-hover:animate-pulse" />
                                <span className="text-xs font-bold tracking-wide">AI 魔法润色</span>
                                <div className="absolute -right-4 top-0 h-full w-8 bg-white/10 skew-x-[-20deg] animate-shimmer" />
                            </button>
                        </div>
                    )
                }

                {/* AI Rewrite Panel */}
                {
                    showAIRewrite && (
                        <AIRewritePanel
                            originalText={selectedText}
                            onAccept={(newText) => {
                                // 恢复焦点到编辑器
                                contentEditableRef.current?.focus();

                                // 尝试恢复选区
                                if (savedSelectionRef.current) {
                                    try {
                                        const selection = window.getSelection();
                                        if (selection) {
                                            selection.removeAllRanges();
                                            // 验证 range 是否仍然有效
                                            const range = savedSelectionRef.current;
                                            if (range.startContainer.isConnected && range.endContainer.isConnected) {
                                                selection.addRange(range);
                                            } else {
                                                // Range 已失效，选中整个编辑器内容
                                                const newRange = document.createRange();
                                                newRange.selectNodeContents(contentEditableRef.current!);
                                                selection.addRange(newRange);
                                            }
                                        }
                                    } catch (error) {
                                        console.warn('恢复选区失败:', error);
                                        // 如果恢复失败，选中整个编辑器
                                        const selection = window.getSelection();
                                        if (selection && contentEditableRef.current) {
                                            const range = document.createRange();
                                            range.selectNodeContents(contentEditableRef.current);
                                            selection.removeAllRanges();
                                            selection.addRange(range);
                                        }
                                    }
                                }

                                // 使用 insertHTML 替换选中内容
                                document.execCommand('insertHTML', false, newText);

                                // 更新父组件
                                handleInput();

                                // 关闭面板
                                setShowAIRewrite(false);
                                setSelectedText('');
                            }}
                            onCancel={() => {
                                setShowAIRewrite(false);
                            }}
                        />
                    )
                }
            </div>
        </>
    );
}
