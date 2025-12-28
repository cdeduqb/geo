'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Heading1,
    Heading2,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Code,
    Sparkles,
    Image as ImageIcon,
    Table as TableIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Palette,
    FileText,
    Monitor,
    Settings,
    Plus,
    CodeXml
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AIGenerateDialog from './AIGenerateDialog';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

type ViewMode = 'web' | 'page';

const MenuBar = ({ editor, onAIClick, viewMode, onViewModeChange, showSource, onToggleSource }: {
    editor: any,
    onAIClick: () => void,
    viewMode: ViewMode,
    onViewModeChange: (mode: ViewMode) => void,
    showSource: boolean,
    onToggleSource: () => void
}) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('请输入图片 URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('请输入链接 URL', previousUrl);

        // cancelled
        if (url === null) {
            return;
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    return (
        <div className="border-b border-gray-200  p-2 flex flex-wrap gap-1 bg-gray-50  rounded-t-lg sticky top-0 z-10">
            {/* AI & View Mode Group */}
            <div className="flex items-center gap-1 mr-2 border-r border-gray-300  pr-2">
                <button
                    type="button"
                    onClick={onAIClick}
                    className="p-2 rounded hover:bg-blue-100 :bg-blue-900/30 transition-colors text-blue-600  flex items-center gap-1 bg-blue-50  border border-blue-200 "
                    title="AI 智能创作"
                >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">AI 创作</span>
                </button>

                <button
                    type="button"
                    onClick={() => onViewModeChange(viewMode === 'web' ? 'page' : 'web')}
                    className="p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors text-gray-600  flex items-center gap-1"
                    title={viewMode === 'web' ? "切换到分页模式" : "切换到 Web 模式"}
                    disabled={showSource}
                >
                    {viewMode === 'web' ? <FileText className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                    <span className="text-xs font-medium hidden sm:inline">{viewMode === 'web' ? '分页视图' : 'Web 视图'}</span>
                </button>

                <button
                    type="button"
                    onClick={onToggleSource}
                    className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors flex items-center gap-1 ${showSource ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                    title={showSource ? "切换回预览模式" : "切换到源码模式"}
                >
                    <CodeXml className="w-4 h-4" />
                    <span className="text-xs font-medium hidden sm:inline">HTML 源码</span>
                </button>
            </div>

            {/* Disable other buttons when in source mode */}
            {!showSource && (
                <>
                    {/* Text Formatting */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('bold') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="加粗 (Cmd+B)"
                    >
                        <Bold className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('italic') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="斜体 (Cmd+I)"
                    >
                        <Italic className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('underline') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="下划线 (Cmd+U)"
                    >
                        <UnderlineIcon className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                    <div className="relative group">
                        <button
                            type="button"
                            className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 flex items-center"
                            title="文字颜色"
                        >
                            <Palette className="w-4 h-4" style={{ color: editor.getAttributes('textStyle').color }} />
                        </button>
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg p-2 flex gap-1 z-[9999] hidden group-hover:flex w-[160px] flex-wrap">
                            {['#000000', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#6B7280'].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => editor.chain().focus().setColor(color).run()}
                                    className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                            <button
                                onClick={() => editor.chain().focus().unsetColor().run()}
                                className="w-6 h-6 rounded-full border border-gray-200 hover:scale-110 transition-transform bg-transparent flex items-center justify-center text-[10px] text-gray-500"
                                title="清除颜色"
                            >
                                X
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addLink}
                        className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-blue-600' : 'text-gray-600'}`}
                        title="插入链接"
                    >
                        <LinkIcon className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                    {/* Headings */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="标题 1"
                    >
                        <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="标题 2"
                    >
                        <Heading2 className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                    {/* Alignment */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="左对齐"
                    >
                        <AlignLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="居中对齐"
                    >
                        <AlignCenter className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="右对齐"
                    >
                        <AlignRight className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                    {/* Lists & Quotes */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="无序列表"
                    >
                        <List className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="有序列表"
                    >
                        <ListOrdered className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="引用"
                    >
                        <Quote className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors ${editor.isActive('codeBlock') ? 'bg-gray-200  text-blue-600' : 'text-gray-600 '}`}
                        title="代码块"
                    >
                        <Code className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                    {/* Insert Objects */}
                    <button
                        type="button"
                        onClick={addImage}
                        className="p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors text-gray-600 "
                        title="插入图片"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={addTable}
                        className="p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors text-gray-600 "
                        title="插入表格"
                    >
                        <TableIcon className="w-4 h-4" />
                    </button>

                    <div className="w-px h-6 bg-gray-300  mx-1 self-center" />

                    {/* History */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                        className="p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors text-gray-600  disabled:opacity-50"
                        title="撤销 (Cmd+Z)"
                    >
                        <Undo className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                        className="p-2 rounded hover:bg-gray-200 :bg-gray-700 transition-colors text-gray-600  disabled:opacity-50"
                        title="重做 (Cmd+Shift+Z)"
                    >
                        <Redo className="w-4 h-4" />
                    </button>
                </>
            )}
        </div>
    );
};

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('web');
    const [showSource, setShowSource] = useState(false);
    const [sourceContent, setSourceContent] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || '开始输入内容... (支持 Markdown 快捷键)',
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer hover:text-blue-700',
                },
            }),
            TextStyle,
            Color,
        ],
        immediatelyRender: false,
        content: content,
        editorProps: {
            attributes: {
                class: 'focus:outline-none', // Base class, dynamic classes handled in render
            },
        },
        onUpdate: ({ editor }) => {
            if (!showSource) {
                onChange(editor.getHTML());
            }
        },
    });

    useEffect(() => {
        if (editor && content && editor.getHTML() !== content && !showSource) {
            if (editor.isEmpty) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor, showSource]);

    const handleAIGenerate = (generatedContent: string) => {
        if (editor) {
            editor.chain().focus().insertContent(generatedContent).run();
        }
    };

    const toggleSourceMode = () => {
        if (showSource) {
            // Switch back to visual mode: update editor with source content
            editor?.commands.setContent(sourceContent);
            onChange(sourceContent);
        } else {
            // Switch to source mode: get current HTML
            setSourceContent(editor?.getHTML() || '');
        }
        setShowSource(!showSource);
    };

    const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSourceContent(e.target.value);
        onChange(e.target.value);
    };

    // Dynamic classes based on View Mode
    const editorContainerClass = viewMode === 'page'
        ? 'w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg p-[20mm] my-8 border border-gray-200'
        : 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto min-h-[300px] p-4 max-w-none ';

    return (
        <div className="flex flex-col h-full border border-gray-200 rounded-lg bg-gray-50/50">
            <MenuBar
                editor={editor}
                onAIClick={() => setIsAIDialogOpen(true)}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                showSource={showSource}
                onToggleSource={toggleSourceMode}
            />

            <div className="flex-1 overflow-y-auto bg-gray-100  p-4">
                {showSource ? (
                    <textarea
                        value={sourceContent}
                        onChange={handleSourceChange}
                        className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-gray-900 text-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="<!-- 在此输入 HTML 源码 -->"
                    />
                ) : (
                    <div className={`transition-all duration-300 ${viewMode === 'page' ? '' : 'bg-white  rounded-b-lg shadow-sm'}`}>
                        <EditorContent
                            editor={editor}
                            className={editorContainerClass}
                        />
                    </div>
                )}
            </div>

            <AIGenerateDialog
                isOpen={isAIDialogOpen}
                onClose={() => setIsAIDialogOpen(false)}
                onGenerate={handleAIGenerate}
            />
        </div>
    );
}
