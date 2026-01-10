'use client';

import { useState, useEffect } from 'react';
import {
    ArrowLeft, Plus, Eye, Save, Trash2, GripVertical, Settings, Loader2, Sparkles,
    Move, Layout, Type, Image as ImageIcon, LayoutGrid, Users, ChevronDown, ChevronRight
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor, { loader } from '@monaco-editor/react';

// Configure monaco loader to use local assets for reliability
loader.config({
    paths: {
        vs: '/monaco-editor/min/vs'
    }
});

import { PageRenderer } from '@/components/PageRenderer';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getRegisteredSections, SectionDefinition } from '@/lib/sections/registry';
import { JsonEditor } from './JsonEditor';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import ImageUploader from '@/components/ui/ImageUploader';
import ColorPicker from '@/components/ui/ColorPicker';
import MenuEditor from '@/components/ui/MenuEditor';
import LinkEditor from '@/components/ui/LinkEditor';
import PartnerEditor from '@/components/ui/PartnerEditor';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false });

// Type definitions
export interface SectionConfig {
    id: string;
    type: string;
    data: Record<string, any>;
    style?: Record<string, any>;
}

// 确保组件已注册
import '@/components/sections/HeaderSection';
import '@/components/sections/Footer01Section';
import '@/components/sections/Footer02Section';
import '@/components/sections/Footer03Section';
import '@/components/sections/Footer04Section';
import '@/components/sections/Footer05Section';
import '@/components/sections/Footer06Section';
import '@/components/sections/Footer07Section';
import '@/components/sections/Footer08Section';
import '@/components/sections/Footer09Section';
import '@/components/sections/Footer10Section';
import '@/components/sections/Footer11Section';
import '@/components/sections/Footer12Section';
import '@/components/sections/Footer13Section';
import '@/components/sections/Footer14Section';
import '@/components/sections/Footer15Section';
import '@/components/sections/HeaderSection';
import '@/components/sections/HeroSection';
import '@/components/sections/Hero04Section';
import '@/components/sections/Hero07Section';
import '@/components/sections/Hero12Registration';
import '@/components/sections/Hero14Registration';
import '@/components/sections/Hero15Section';
import '@/components/sections/Hero17Registration';
import '@/components/sections/Hero21Registration';
import '@/components/sections/Hero22Registration';
import '@/components/sections/Hero25Registration';
import '@/components/sections/Hero30Registration';
import '@/components/sections/Hero31Registration';
import '@/components/sections/Hero32Registration';
import '@/components/sections/Hero34Section';
import '@/components/sections/Hero35Registration';
import '@/components/sections/Hero36Registration';
import '@/components/sections/Hero37Registration';
import '@/components/sections/Hero40Registration';
import '@/components/sections/Hero41Registration';
import '@/components/sections/FeaturesSection';
import '@/components/sections/Features02Registration';
import '@/components/sections/Features03Registration';
import '@/components/sections/Features04Registration';
import '@/components/sections/Features05Registration';
import '@/components/sections/Process01Registration';
import '@/components/sections/Process02Registration';
import '@/components/sections/Process03Registration';
import '@/components/sections/Process04Registration';
import '@/components/sections/Process05Registration';
import '@/components/sections/Features06Registration';
import '@/components/sections/Features07Registration';
import '@/components/sections/Features08Registration';
import '@/components/sections/RichTextSection';
import '@/components/sections/FAQSection';
import '@/components/sections/FAQ02Registration';
import '@/components/sections/FAQ03Registration';
import '@/components/sections/FAQ04Registration';
import '@/components/sections/FAQ05Registration';
import '@/components/sections/FAQ06Registration';
import '@/components/sections/Timeline01Registration';
import '@/components/sections/Timeline02Registration';
import '@/components/sections/Timeline03Registration';
import '@/components/sections/Timeline04Registration';
import '@/components/sections/Timeline05Registration';
import '@/components/sections/Tabs01Registration';
import '@/components/sections/Tabs02Registration';
import '@/components/sections/Tabs03Registration';
import '@/components/sections/Tabs04Registration';
import '@/components/sections/Tabs05Registration';
// 数据与列表组件
import '@/components/sections/Stats01Registration';
import '@/components/sections/Stats02Registration';
import '@/components/sections/Stats03Registration';
import '@/components/sections/Stats04Registration';
import '@/components/sections/Stats05Registration';
import '@/components/sections/Stats06Registration';
// 文章列表组件
import '@/components/sections/ArticleList01Registration';
import '@/components/sections/ArticleList02Registration';
import '@/components/sections/ArticleList03Registration';
import '@/components/sections/ArticleList04Registration';
import '@/components/sections/ArticleList05Registration';
import '@/components/sections/ArticleList06Registration';
import '@/components/sections/ArticleList07Registration';
import '@/components/sections/ArticleList08Registration';
import '@/components/sections/ArticleList09Registration';
import '@/components/sections/ArticleList10Registration';
import '@/components/sections/ProductList01Registration';
import '@/components/sections/ProductList02Registration';
import '@/components/sections/ProductList03Registration';
import '@/components/sections/ProductList04Registration';
import '@/components/sections/ProductList05Registration';
import '@/components/sections/ProductList06Registration';
import '@/components/sections/DataTable01Registration';
import '@/components/sections/DataTable02Registration';
import '@/components/sections/DataTable03Registration';
import '@/components/sections/DataTable04Registration';
import '@/components/sections/DataTable05Registration';
import '@/components/sections/DataTable06Registration';
import '@/components/sections/Compare01Registration';
import '@/components/sections/Compare02Registration';
import '@/components/sections/Compare03Registration';
import '@/components/sections/Compare04Registration';
import '@/components/sections/Compare05Registration';
import '@/components/sections/Compare06Registration';
// 营销与转化组件
import '@/components/sections/Pricing01Registration';
import '@/components/sections/Pricing02Registration';
import '@/components/sections/Pricing03Registration';
import '@/components/sections/Pricing04Registration';
import '@/components/sections/Pricing05Registration';
import '@/components/sections/Pricing06Registration';
import '@/components/sections/CTA01Registration';
import '@/components/sections/CTA02Registration';
import '@/components/sections/CTA03Registration';
import '@/components/sections/CTA04Registration';
import '@/components/sections/CTA05Registration';
import '@/components/sections/CTA06Registration';
import '@/components/sections/Partner01Registration';
import '@/components/sections/Partner02Registration';
import '@/components/sections/Partner03Registration';
import '@/components/sections/Partner04Registration';
import '@/components/sections/Partner05Registration';
import '@/components/sections/Partner06Registration';
import '@/components/sections/Countdown01Registration';
import '@/components/sections/Countdown02Registration';
import '@/components/sections/Countdown03Registration';
import '@/components/sections/Countdown04Registration';
import '@/components/sections/Countdown05Registration';
import '@/components/sections/Countdown06Registration';
import '@/components/sections/PricingSection';
import '@/components/sections/CTASection';
import '@/components/sections/StatsSection';
import '@/components/sections/LogoCloudSection';
import '@/components/sections/BlogListSection';
import '@/components/sections/ProductListSection';
import '@/components/sections/DividerSection';
import '@/components/sections/TimelineSection';
import '@/components/sections/TableSection';
import '@/components/sections/TabsSection';
import '@/components/sections/CountdownSection';
// 新增功能组件
// 新增功能组件
import '@/components/sections/Banner01Registration';
import '@/components/sections/ServiceArea01Registration';
import '@/components/sections/ServiceArea02Registration';
import '@/components/sections/DownloadCenter01Registration';
import '@/components/sections/DownloadCenter02Registration';
import '@/components/sections/Awards01Registration';
import '@/components/sections/Awards02Registration';
import '@/components/sections/Awards03Registration';
// 客户评价组件
import '@/components/sections/Testimonials01Registration';
import '@/components/sections/Testimonials02Registration';
import '@/components/sections/Testimonials03Registration';
import '@/components/sections/Testimonials04Registration';
import '@/components/sections/Testimonials05Registration';
// 社交媒体组件
import '@/components/sections/Social01Registration';
import '@/components/sections/Social02Registration';
import '@/components/sections/Social03Registration';
import '@/components/sections/Social05Registration';
// 联系我们组件
import '@/components/sections/Contact01Registration';
import '@/components/sections/Contact02Registration';
import '@/components/sections/Contact03Registration';
import '@/components/sections/Contact04Registration';
import '@/components/sections/Contact06Registration';
import '@/components/sections/Contact09Registration';
import '@/components/sections/Contact10Registration';
import '@/components/sections/Contact12Registration';
import '@/components/sections/Contact13Registration';
import '@/components/sections/Contact14Registration';
import '@/components/sections/Contact15Registration';
import '@/components/sections/Contact19Registration';
import '@/components/sections/Contact20Registration';
// 团队介绍组件
import '@/components/sections/Team07Registration';
import '@/components/sections/Team08Registration';
import '@/components/sections/Team09Registration';
import '@/components/sections/Team10Registration';
import '@/components/sections/Team11Registration';
import '@/components/sections/Team12Registration';
import '@/components/sections/Team15Registration';
// 地图组件
import '@/components/sections/Map01Registration';
import '@/components/sections/Map02Registration';
import '@/components/sections/Map03Registration';
import '@/components/sections/Map04Registration';
import '@/components/sections/Map05Registration';
import '@/components/sections/ComparisonSection';
import '@/components/sections/CustomHtmlSection';

interface PageBuilderProps {
    pageId: string;
    initialSections: SectionConfig[];
    pageType?: string; // HOME, CUSTOM, etc from Page
    moduleType?: string; // HEADER, FOOTER, etc from PageTemplate
}

// 可排序的区块组件
function SortableSection({
    section,
    isSelected,
    onClick,
    onDelete
}: {
    section: SectionConfig;
    isSelected: boolean;
    onClick: () => void;
    onDelete: (id: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    // 从注册表中获取组件定义
    const availableSections = getRegisteredSections();
    const definition = availableSections.find(s => s.type === section.type);

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className={`relative group border-2 transition-all mb-4 rounded-lg overflow-visible ${isSelected
                ? 'border-blue-500 shadow-lg'
                : 'border-transparent hover:border-blue-200 hover:shadow-md'
                }`}
        >
            {/* 组件名称标签（左上角，仅悬停时显示） */}
            <div className="absolute top-2 left-2 z-[100] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="px-2 py-1 bg-purple-600 text-white shadow-lg rounded text-xs font-medium">
                    {definition?.name || section.type}
                </div>
            </div>

            {/* 区块操作栏（右上角） */}
            <div className={`absolute top-2 right-2 flex gap-1 z-[100] ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                <button
                    {...attributes}
                    {...listeners}
                    className="p-1.5 bg-white shadow-lg rounded border border-gray-200 hover:text-blue-600 hover:border-blue-400 cursor-move active:cursor-grabbing pointer-events-auto"
                    title="拖拽移动"
                >
                    <Move className="w-4 h-4" />
                </button>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete(section.id);
                    }}
                    className="p-1.5 bg-white shadow-lg rounded border border-gray-200 hover:text-red-600 hover:border-red-400 cursor-pointer pointer-events-auto"
                    title="删除区块"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* 渲染组件 */}
            <div className="pointer-events-none overflow-hidden rounded-lg">
                <PageRenderer sections={[section]} isEditing={true} />
            </div>
        </div>
    );
}

export default function PageBuilder({ pageId, initialSections, pageType, moduleType }: PageBuilderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hideToolbar = searchParams?.get('hideToolbar') === 'true';
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [sections, setSections] = useState<SectionConfig[]>(initialSections || []);
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sectionId: string | null }>({ isOpen: false, sectionId: null });
    const [debugLog, setDebugLog] = useState<string>('');
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const isEditingHeader = moduleType === 'HEADER';
    const isEditingFooter = moduleType === 'FOOTER';

    const availableSections = getRegisteredSections().filter(s => {
        const isHeader = s.type.startsWith('header');
        const isFooter = s.type.startsWith('footer') || s.category === 'footer';

        if (isEditingHeader) return isHeader;
        if (isEditingFooter) return isFooter;

        // For normal pages, hide header and footer components
        return !isHeader && !isFooter;
    });

    // Handle postMessage requests from parent window (for template mode)
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.data.type === 'GET_SECTIONS') {
                console.log('PageBuilder: Received GET_SECTIONS request');
                console.log('Current sections:', sections);
                // Send current sections back to parent
                window.parent.postMessage({
                    type: 'SECTIONS_DATA',
                    sections: sections
                }, '*');
            } else if (event.data.type === 'TOGGLE_PREVIEW') {
                console.log('PageBuilder: Toggling preview mode');
                setIsPreviewMode(prev => !prev);
                setSelectedSectionId(null); // Deselect when preview
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [sections]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // 拖拽结束处理
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setSections((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const [expandedCategory, setExpandedCategory] = useState<string | null>('layout');
    const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
    const [expandedFooterGroup, setExpandedFooterGroup] = useState<boolean>(false);
    const [expandedHeroGroup, setExpandedHeroGroup] = useState<boolean>(false);
    const [expandedFeaturesGroup, setExpandedFeaturesGroup] = useState<boolean>(false);
    const [expandedProcessGroup, setExpandedProcessGroup] = useState<boolean>(false);
    const [expandedFAQGroup, setExpandedFAQGroup] = useState<boolean>(false);
    const [expandedTimelineGroup, setExpandedTimelineGroup] = useState<boolean>(false);
    const [expandedTabsGroup, setExpandedTabsGroup] = useState<boolean>(false);
    // data分类子分组状态
    const [expandedStatsGroup, setExpandedStatsGroup] = useState<boolean>(false);
    const [expandedServiceAreaGroup, setExpandedServiceAreaGroup] = useState<boolean>(false);
    const [expandedArticleListGroup, setExpandedArticleListGroup] = useState<boolean>(false);
    const [expandedProductListGroup, setExpandedProductListGroup] = useState<boolean>(false);
    const [expandedDataTableGroup, setExpandedDataTableGroup] = useState<boolean>(false);
    const [expandedCompareGroup, setExpandedCompareGroup] = useState<boolean>(false);
    // marketing分类子分组状态
    const [expandedPricingGroup, setExpandedPricingGroup] = useState<boolean>(false);
    const [expandedCTAGroup, setExpandedCTAGroup] = useState<boolean>(false);
    const [expandedPartnerGroup, setExpandedPartnerGroup] = useState<boolean>(false);
    const [expandedCountdownGroup, setExpandedCountdownGroup] = useState<boolean>(false);
    const [expandedTestimonialsGroup, setExpandedTestimonialsGroup] = useState<boolean>(false);
    // contact分类子分组状态
    const [expandedContactFormGroup, setExpandedContactFormGroup] = useState<boolean>(true);
    const [expandedSocialGroup, setExpandedSocialGroup] = useState<boolean>(false);
    const [expandedContactGroup, setExpandedContactGroup] = useState<boolean>(false);
    const [expandedTeamGroup, setExpandedTeamGroup] = useState<boolean>(false);
    const [expandedMapGroup, setExpandedMapGroup] = useState<boolean>(false);
    // content分类其他分组状态
    const [expandedDownloadGroup, setExpandedDownloadGroup] = useState<boolean>(false);
    const [expandedAwardsGroup, setExpandedAwardsGroup] = useState<boolean>(false);

    // 添加区块（支持变体）
    const addSection = (type: string, variantIndex?: number) => {
        const definition = availableSections.find(s => s.type === type);
        if (!definition) return;

        let initialData = definition.defaultData;
        let initialStyle = definition.defaultStyle || {};

        // 如果选择了特定变体
        if (variantIndex !== undefined && definition.variants && definition.variants[variantIndex]) {
            const variant = definition.variants[variantIndex];
            initialData = { ...initialData, ...variant.data };
            if (variant.style) {
                initialStyle = { ...initialStyle, ...variant.style };
            }
        }

        const newSection: SectionConfig = {
            id: crypto.randomUUID(),
            type: definition.type,
            data: JSON.parse(JSON.stringify(initialData)), // Deep copy
            style: JSON.parse(JSON.stringify(initialStyle)),
        };

        setSections([...sections, newSection]);
        setSelectedSectionId(newSection.id);

        // 滚动到底部
        setTimeout(() => {
            const element = document.getElementById('canvas-bottom');
            element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };


    // 更新区块数据
    const updateSection = (id: string, field: 'data' | 'style', key: string, value: any) => {
        setSections(sections.map(s => {
            if (s.id === id) {
                // 创建新对象避免引用问题
                const newSection = {
                    ...s,
                    [field]: {
                        ...s[field],
                        [key]: value
                    }
                };
                return newSection;
            }
            return s;
        }));
    };

    // 删除区块
    const deleteSection = (id: string) => {
        setDeleteConfirm({ isOpen: true, sectionId: id });
    };

    const handleDeleteConfirm = () => {
        if (deleteConfirm.sectionId) {
            setSections(sections.filter(s => s.id !== deleteConfirm.sectionId));
            if (selectedSectionId === deleteConfirm.sectionId) setSelectedSectionId(null);
        }
        setDeleteConfirm({ isOpen: false, sectionId: null });
    };

    // 保存页面
    const handleSave = async () => {
        setIsSaving(true);
        setDebugLog('开始保存...');
        try {
            // 清理 sections 数据，确保可以序列化
            const cleanSections = sections.map(s => ({
                id: s.id,
                type: s.type,
                data: s.data,
                style: s.style
            }));

            console.log('开始保存页面，sections 数量:', cleanSections.length);

            // 测试是否可以序列化
            let jsonString;
            try {
                jsonString = JSON.stringify({ sections: cleanSections });
                console.log('数据序列化成功，大小:', jsonString.length, '字节');
            } catch (stringifyError) {
                console.error('JSON 序列化失败:', stringifyError);
                throw new Error('数据包含无法序列化的内容');
            }

            const res = await fetch(`/api/admin/pages/${pageId}/sections`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: jsonString,
            });

            console.log('HTTP 响应状态:', res.status, res.statusText);

            const data = await res.json();
            console.log('保存响应:', data);

            if (!res.ok) {
                throw new Error(data.error || data.details || `保存失败 (${res.status})`);
            }

            setDebugLog('保存成功！');
            alert('保存成功！');
        } catch (error) {
            console.error('保存错误:', error);
            const errorMsg = `保存失败：${error instanceof Error ? error.message : '未知错误'}`;
            setDebugLog(errorMsg);
            alert(errorMsg);
        } finally {
            setIsSaving(false);
        }
    };



    const selectedSection = sections.find(s => s.id === selectedSectionId);
    const selectedDefinition = selectedSection ? availableSections.find(s => s.type === selectedSection.type) : null;

    // 渲染属性输入控件
    const renderInput = (key: string, config: any, value: any, field: 'data' | 'style') => {
        if (!selectedSection) return null;

        switch (config.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={e => updateSection(selectedSection.id, field, key, e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        onChange={e => updateSection(selectedSection.id, field, key, e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm resize-y"
                    />
                );
            case 'image':
                return (
                    <ImageUploader
                        value={value || ''}
                        onChange={(url) => updateSection(selectedSection.id, field, key, url)}
                    />
                );
            case 'rich-text':
                return (
                    <RichTextEditor
                        value={value || ''}
                        onChange={(newValue) => updateSection(selectedSection.id, field, key, newValue)}
                    />
                );
            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={e => updateSection(selectedSection.id, field, key, e.target.value)}
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                    >
                        {config.options?.map((opt: any) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                );
            case 'boolean':
                return (
                    <input
                        type="checkbox"
                        checked={value || false}
                        onChange={e => updateSection(selectedSection.id, field, key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                    />
                );
            case 'color':
                return (
                    <ColorPicker
                        value={value || '#ffffff'}
                        onChange={(color) => updateSection(selectedSection.id, field, key, color)}
                    />
                );
            case 'link':
                return (
                    <LinkEditor
                        link={value || ''}
                        onSave={(link) => updateSection(selectedSection.id, field, key, link)}
                    />
                );
            case 'menu':
                return (
                    <MenuEditor
                        value={value || []}
                        onChange={(items) => updateSection(selectedSection.id, field, key, items)}
                    />
                );
            case 'list':
                // Retroactive support for legacy navItems using list type
                if (key === 'navItems') {
                    return (
                        <MenuEditor
                            value={value || []}
                            onChange={(items) => updateSection(selectedSection.id, field, key, items)}
                        />
                    );
                }
                // Use PartnerEditor for partners list
                if (key === 'partners') {
                    return (
                        <PartnerEditor
                            value={value || []}
                            onChange={(items) => updateSection(selectedSection.id, field, key, items)}
                        />
                    );
                }
                // Default to JsonEditor for other lists
                return (
                    <JsonEditor
                        value={value}
                        onChange={(newValue) => updateSection(selectedSection.id, field, key, newValue)}
                    />
                );
            case 'code':
                return (
                    <div className="h-96 border border-gray-300 rounded-md overflow-hidden">
                        <Editor
                            height="100%"
                            defaultLanguage="html"
                            value={value || ''}
                            onChange={(newValue) => updateSection(selectedSection.id, field, key, newValue || '')}
                            theme="vs-dark"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 12,
                                wordWrap: 'on',
                                lineNumbers: 'off',
                                folding: false,
                            }}
                        />
                    </div>
                );
            case 'number':
                return (
                    <input
                        type="number"
                        value={value || ''}
                        onChange={e => updateSection(selectedSection.id, field, key, Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* 左侧组件库 - hidden in preview mode */}
            {!isPreviewMode && (
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm transition-all duration-300">
                    <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                        <Layout className="w-5 h-5 text-blue-600" />
                        <h2 className="font-bold text-gray-900">组件库</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {[{ id: 'layout', label: '基础布局', icon: <Layout className="w-4 h-4" /> },
                        { id: 'content', label: '内容展示', icon: <Type className="w-4 h-4" /> },
                        { id: 'data', label: '数据与列表', icon: <LayoutGrid className="w-4 h-4" /> },
                        { id: 'marketing', label: '营销与转化', icon: <Sparkles className="w-4 h-4" /> },
                        { id: 'contact', label: '联系与互动', icon: <Users className="w-4 h-4" /> }
                        ].map(category => {
                            const categorySections = availableSections.filter(s => s.category === category.id);
                            const isCategoryExpanded = expandedCategory === category.id;

                            return (
                                <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                                    <button
                                        onClick={() => setExpandedCategory(isCategoryExpanded ? null : category.id)}
                                        className={`w-full flex items-center justify-between p-3 text-sm font-medium transition-colors ${isCategoryExpanded
                                            ? 'bg-gray-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {category.icon}
                                            {category.label}
                                        </div>
                                        {isCategoryExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>

                                    {isCategoryExpanded && (
                                        <div className="p-2 space-y-1 bg-gray-50/50 border-t border-gray-100">
                                            {category.id === 'layout' ? (
                                                // 基础布局分类：按页眉/页脚分组
                                                <>
                                                    {/* 页眉导航组 - 不显示标签 */}
                                                    {(() => {
                                                        const headerSections = categorySections.filter(s => s.type.startsWith('header'));
                                                        return headerSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div className="space-y-1">
                                                                    {headerSections.map(def => {
                                                                        const hasVariants = def.variants && def.variants.length > 0;
                                                                        const isComponentExpanded = expandedComponent === def.type;
                                                                        return (
                                                                            <div key={def.type} className="space-y-1">
                                                                                <div
                                                                                    onClick={() => {
                                                                                        if (hasVariants) {
                                                                                            setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                        } else {
                                                                                            addSection(def.type);
                                                                                        }
                                                                                    }}
                                                                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                >
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span>{def.name}</span>
                                                                                    </div>
                                                                                    {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                </div>
                                                                                {hasVariants && isComponentExpanded && (
                                                                                    <div className="pl-4 space-y-1 my-1">
                                                                                        {def.variants?.map((variant, idx) => (
                                                                                            <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                <div className="flex-1">
                                                                                                    <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                    {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 简约横幅组 */}
                                                    {(() => {
                                                        const heroSections = categorySections.filter(s => s.type.startsWith('hero'));
                                                        return heroSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedHeroGroup(!expandedHeroGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">简约横幅</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedHeroGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedHeroGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {heroSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 页脚导航组 */}
                                                    {(() => {
                                                        const footerSections = categorySections.filter(s => s.type.startsWith('footer'));
                                                        return footerSections.length > 0 && (
                                                            <div>
                                                                <div
                                                                    onClick={() => setExpandedFooterGroup(!expandedFooterGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">页脚导航</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedFooterGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedFooterGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {footerSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 其他组件 */}
                                                    {(() => {
                                                        const otherSections = categorySections.filter(s => !s.type.startsWith('header') && !s.type.startsWith('footer') && !s.type.startsWith('hero'));
                                                        return otherSections.map(def => {
                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                            const isComponentExpanded = expandedComponent === def.type;
                                                            return (
                                                                <div key={def.type} className="space-y-1">
                                                                    <div
                                                                        onClick={() => {
                                                                            if (hasVariants) {
                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                            } else {
                                                                                addSection(def.type);
                                                                            }
                                                                        }}
                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                            <span>{def.name}</span>
                                                                        </div>
                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                    </div>
                                                                    {hasVariants && isComponentExpanded && (
                                                                        <div className="pl-4 space-y-1 my-1">
                                                                            {def.variants?.map((variant, idx) => (
                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                    <div className="flex-1">
                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </>
                                            ) : category.id === 'content' ? (
                                                // 内容展示分类：功能网格分组
                                                <>
                                                    {/* 功能网格组 */}
                                                    {(() => {
                                                        const featuresSections = categorySections.filter(s => s.type.startsWith('features'));
                                                        return featuresSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedFeaturesGroup(!expandedFeaturesGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">功能网格</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedFeaturesGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedFeaturesGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {featuresSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* FAQ组 */}
                                                    {(() => {
                                                        const faqSections = categorySections.filter(s => s.type.startsWith('faq'));
                                                        return faqSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedFAQGroup(!expandedFAQGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">常见问题</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedFAQGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedFAQGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {faqSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 步骤流程组 */}
                                                    {(() => {
                                                        const processSections = categorySections.filter(s => s.type.startsWith('process') || s.type === 'features-05');
                                                        return processSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedProcessGroup(!expandedProcessGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">步骤流程</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedProcessGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedProcessGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {processSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 时间轴组 */}
                                                    {(() => {
                                                        const timelineSections = categorySections.filter(s => s.type.startsWith('timeline'));
                                                        return timelineSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedTimelineGroup(!expandedTimelineGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">时间轴</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedTimelineGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedTimelineGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {timelineSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 选项卡组 */}
                                                    {(() => {
                                                        const tabsSections = categorySections.filter(s => s.type.startsWith('tabs'));
                                                        return tabsSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedTabsGroup(!expandedTabsGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">选项卡</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedTabsGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedTabsGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {tabsSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 服务区域组 */}
                                                    {(() => {
                                                        const serviceAreaSections = categorySections.filter(s => s.type.startsWith('service-area'));
                                                        return serviceAreaSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedServiceAreaGroup(!expandedServiceAreaGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">服务区域</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedServiceAreaGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedServiceAreaGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {serviceAreaSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 下载组件组 */}
                                                    {(() => {
                                                        const downloadSections = categorySections.filter(s => s.type.startsWith('download-center'));
                                                        return downloadSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedDownloadGroup(!expandedDownloadGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">下载组件</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedDownloadGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedDownloadGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {downloadSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 荣誉证书组 */}
                                                    {(() => {
                                                        const awardsSections = categorySections.filter(s => s.type.startsWith('awards'));
                                                        return awardsSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div
                                                                    onClick={() => setExpandedAwardsGroup(!expandedAwardsGroup)}
                                                                    className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                                                                >
                                                                    <span className="text-sm text-gray-700">荣誉证书</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedAwardsGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedAwardsGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {awardsSections.map(def => {
                                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                                            const isComponentExpanded = expandedComponent === def.type;
                                                                            return (
                                                                                <div key={def.type} className="space-y-1">
                                                                                    <div
                                                                                        onClick={() => {
                                                                                            if (hasVariants) {
                                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                                            } else {
                                                                                                addSection(def.type);
                                                                                            }
                                                                                        }}
                                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                                    >
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span>{def.name}</span>
                                                                                        </div>
                                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                                    </div>
                                                                                    {hasVariants && isComponentExpanded && (
                                                                                        <div className="pl-4 space-y-1 my-1">
                                                                                            {def.variants?.map((variant, idx) => (
                                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                                    <div className="flex-1">
                                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                                        {variant.description && <div className="text-[10px] opacity-70 truncate">{variant.description}</div>}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ))}
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 其他内容组件 */}
                                                    {(() => {
                                                        const otherSections = categorySections.filter(s => !s.type.startsWith('features') && !s.type.startsWith('faq') && !s.type.startsWith('process') && !s.type.startsWith('timeline') && !s.type.startsWith('tabs') && !s.type.startsWith('service-area') && !s.type.startsWith('download-center') && !s.type.startsWith('awards') && s.type !== 'features-05');
                                                        return otherSections.map(def => {
                                                            const hasVariants = def.variants && def.variants.length > 0;
                                                            const isComponentExpanded = expandedComponent === def.type;
                                                            return (
                                                                <div key={def.type} className="space-y-1">
                                                                    <div
                                                                        onClick={() => {
                                                                            if (hasVariants) {
                                                                                setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                            } else {
                                                                                addSection(def.type);
                                                                            }
                                                                        }}
                                                                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group ${isComponentExpanded ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100 text-gray-700'}`}
                                                                    >
                                                                        <div className="flex items-center gap-2">
                                                                            <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                            <span>{def.name}</span>
                                                                        </div>
                                                                        {hasVariants && <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />}
                                                                    </div>
                                                                    {hasVariants && isComponentExpanded && (
                                                                        <div className="pl-4 space-y-1 my-1">
                                                                            {def.variants?.map((variant, idx) => (
                                                                                <div key={idx} onClick={(e) => { e.stopPropagation(); addSection(def.type, idx); }} className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                    <div className="flex-1">
                                                                                        <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        });
                                                    })()}
                                                </>
                                            ) : category.id === 'data' ? (
                                                // 数据与列表分类：按类型分组
                                                <>
                                                    {/* 统计数据组 */}
                                                    {(() => {
                                                        const statsSections = categorySections.filter(s => s.type.startsWith('stats-'));
                                                        return statsSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedStatsGroup(!expandedStatsGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">统计数据</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedStatsGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedStatsGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {statsSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 文章列表组 */}
                                                    {(() => {
                                                        const articleSections = categorySections.filter(s => s.type.startsWith('article-list-'));
                                                        return articleSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedArticleListGroup(!expandedArticleListGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">文章列表</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedArticleListGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedArticleListGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {articleSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 产品列表组 */}
                                                    {(() => {
                                                        const productSections = categorySections.filter(s => s.type.startsWith('productlist-'));
                                                        return productSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedProductListGroup(!expandedProductListGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">产品列表</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedProductListGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedProductListGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {productSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 数据表格组 */}
                                                    {(() => {
                                                        const tableSections = categorySections.filter(s => s.type.startsWith('datatable-'));
                                                        return tableSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedDataTableGroup(!expandedDataTableGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">数据表格</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedDataTableGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedDataTableGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {tableSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 对比表组 */}
                                                    {(() => {
                                                        const compareSections = categorySections.filter(s => s.type.startsWith('compare-'));
                                                        return compareSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedCompareGroup(!expandedCompareGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">对比表</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedCompareGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedCompareGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {compareSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </>
                                            ) : category.id === 'marketing' ? (
                                                // 营销与转化分类：按类型分组
                                                <>
                                                    {/* 价格表组 */}
                                                    {(() => {
                                                        const pricingSections = categorySections.filter(s => s.type.startsWith('pricing-'));
                                                        return pricingSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedPricingGroup(!expandedPricingGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">价格表</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedPricingGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedPricingGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {pricingSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 号召性用语组 */}
                                                    {(() => {
                                                        const ctaSections = categorySections.filter(s => s.type.startsWith('cta-'));
                                                        return ctaSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedCTAGroup(!expandedCTAGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">号召性用语</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedCTAGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedCTAGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {ctaSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 合作伙伴组 */}
                                                    {(() => {
                                                        const partnerSections = categorySections.filter(s => s.type.startsWith('partner-') || s.type === 'logo-cloud');
                                                        return partnerSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedPartnerGroup(!expandedPartnerGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">合作伙伴</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedPartnerGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedPartnerGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {partnerSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 倒计时组 */}
                                                    {(() => {
                                                        const countdownSections = categorySections.filter(s => s.type.startsWith('countdown-') || s.type === 'countdown');
                                                        return countdownSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedCountdownGroup(!expandedCountdownGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">倒计时</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedCountdownGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedCountdownGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {countdownSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 客户评价组 */}
                                                    {(() => {
                                                        const testimonialsSections = categorySections.filter(s => s.type.startsWith('testimonials-'));
                                                        return testimonialsSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedTestimonialsGroup(!expandedTestimonialsGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">客户评价</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedTestimonialsGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedTestimonialsGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {testimonialsSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                    {/* 其他营销组件 */}
                                                    {(() => {
                                                        const otherSections = categorySections.filter(s => !s.type.startsWith('pricing-') && !s.type.startsWith('cta-') && !s.type.startsWith('partner-') && s.type !== 'logo-cloud' && !s.type.startsWith('countdown-') && s.type !== 'countdown' && !s.type.startsWith('testimonials-'));
                                                        return otherSections.map(def => (
                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                            </div>
                                                        ));
                                                    })()}
                                                </>
                                            ) : category.id === 'contact' ? (
                                                // 联系与互动分类
                                                <>
                                                    {/* 留言表单组 */}
                                                    {(() => {
                                                        const formSections = categorySections.filter(s => s.type.startsWith('contact-form-') || s.type.startsWith('contactform-'));
                                                        return formSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedContactFormGroup(!expandedContactFormGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">留言表单</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedContactFormGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedContactFormGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {formSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 社交媒体组 */}
                                                    {(() => {
                                                        const socialSections = categorySections.filter(s => s.type.startsWith('social-'));
                                                        return socialSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedSocialGroup(!expandedSocialGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">社交媒体</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedSocialGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedSocialGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {socialSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 联系我们组 */}
                                                    {(() => {
                                                        const contactSections = categorySections.filter(s => (s.type.startsWith('contact-') || s.type.startsWith('map-')) && !s.type.startsWith('contact-form-'));
                                                        return contactSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedContactGroup(!expandedContactGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">联系我们</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedContactGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedContactGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {contactSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}

                                                    {/* 团队介绍组 */}
                                                    {(() => {
                                                        const teamSections = categorySections.filter(s => s.type.startsWith('team-'));
                                                        return teamSections.length > 0 && (
                                                            <div className="mb-2">
                                                                <div onClick={() => setExpandedTeamGroup(!expandedTeamGroup)} className="flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 transition-colors">
                                                                    <span className="text-sm text-gray-700">团队介绍</span>
                                                                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedTeamGroup ? 'rotate-180' : ''}`} />
                                                                </div>
                                                                {expandedTeamGroup && (
                                                                    <div className="space-y-1 pl-2">
                                                                        {teamSections.map(def => (
                                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}



                                                    {/* 其他联系组件 */}
                                                    {(() => {
                                                        const otherSections = categorySections.filter(s =>
                                                            !s.type.startsWith('contact-form-') &&
                                                            !s.type.startsWith('contactform-') &&
                                                            !s.type.startsWith('social-') &&
                                                            !s.type.startsWith('contact-') &&
                                                            !s.type.startsWith('team-') &&
                                                            !s.type.startsWith('map-')
                                                        );
                                                        return otherSections.map(def => (
                                                            <div key={def.type} onClick={() => addSection(def.type)} className="flex items-center gap-2 p-2 rounded-md cursor-pointer text-sm hover:bg-gray-100 text-gray-700">
                                                                <Plus className="w-3.5 h-3.5 text-gray-400" /><span>{def.name}</span>
                                                            </div>
                                                        ));
                                                    })()}
                                                </>
                                            ) : (
                                                // 默认：其他分类
                                                // 其他分类：正常显示
                                                <>
                                                    {categorySections.map(def => {
                                                        const hasVariants = def.variants && def.variants.length > 0;
                                                        const isComponentExpanded = expandedComponent === def.type;

                                                        return (
                                                            <div key={def.type} className="space-y-1">
                                                                <div
                                                                    onClick={() => {
                                                                        if (hasVariants) {
                                                                            setExpandedComponent(isComponentExpanded ? null : def.type);
                                                                        } else {
                                                                            addSection(def.type);
                                                                        }
                                                                    }}
                                                                    className={`
                                                                flex items-center justify-between p-2 rounded-md cursor-pointer text-sm transition-all group
                                                                ${isComponentExpanded
                                                                            ? 'bg-blue-50/20 text-blue-700'
                                                                            : 'hover:bg-gray-100 text-gray-700'}
                                                            `}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Plus className={`w-3.5 h-3.5 ${isComponentExpanded ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'}`} />
                                                                        <span>{def.name}</span>
                                                                    </div>
                                                                    {hasVariants && (
                                                                        <ChevronDown className={`w-3 h-3 transition-transform ${isComponentExpanded ? 'rotate-180' : ''}`} />
                                                                    )}
                                                                </div>

                                                                {/* 变体列表 */}
                                                                {hasVariants && isComponentExpanded && (
                                                                    <div className="pl-4 space-y-1 my-1">
                                                                        {def.variants?.map((variant, idx) => (
                                                                            <div
                                                                                key={idx}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    addSection(def.type, idx);
                                                                                }}
                                                                                className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-white border border-transparent hover:border-blue-200 text-xs text-gray-600 transition-all hover:shadow-sm"
                                                                            >
                                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                                                                <div className="flex-1">
                                                                                    <div className="font-medium text-gray-900">{variant.label}</div>
                                                                                    {variant.description && (
                                                                                        <div className="text-[10px] opacity-70 truncate">{variant.description}</div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                    {categorySections.length === 0 && (
                                                        <div className="text-center py-4 text-xs text-gray-400">
                                                            暂无组件
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Center Canvas */}
            <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
                {/* 顶部工具栏 - only show if not hidden */}
                {!hideToolbar && (
                    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10 shadow-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div className="h-6 w-px bg-gray-200" />

                        </div>
                        <div className="flex items-center gap-4">
                            {debugLog && (
                                <div className="text-xs text-red-500 max-w-xs truncate" title={debugLog}>
                                    {debugLog}
                                </div>
                            )}
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm w-32"
                            >
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                保存页面
                            </button>
                        </div>
                    </div>
                )}

                {/* 画布区域 */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto min-h-[800px] pb-20">
                        {isMounted ? (
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={sections.map(s => s.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {/* 页眉占位区域 - 仅在非页眉/页脚编辑模式下显示 */}
                                    {!isPreviewMode && !isEditingHeader && !isEditingFooter && (
                                        <div className="mb-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 flex flex-col items-center justify-center text-gray-400 group hover:bg-gray-100/80 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Layout className="w-5 h-5 text-gray-300" />
                                                <span className="font-bold text-gray-500">顶部页眉区域 (全局)</span>
                                            </div>
                                            <div className="text-sm text-gray-400 flex flex-col items-center gap-1">
                                                <p>此区域组件由“站点设置”或“页眉模板”全局维护，不可在此直接编辑。</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => router.push('/admin/settings/site')}
                                                        className="text-blue-600 hover:text-blue-700 font-medium underline flex items-center gap-1"
                                                    >
                                                        <Settings className="w-3.5 h-3.5" />
                                                        去往站点设置
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        onClick={() => router.push('/admin/templates?category=HEADER')}
                                                        className="text-blue-600 hover:text-blue-700 font-medium underline flex items-center gap-1"
                                                    >
                                                        <Layout className="w-3.5 h-3.5" />
                                                        页眉模板管理
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* 编辑模式提示 */}
                                    {!isPreviewMode && isEditingHeader && (
                                        <div className="mb-6 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/30 p-4 flex items-center justify-center text-blue-600 gap-2">
                                            <Layout className="w-5 h-5" />
                                            <span className="font-medium">正在编辑页眉模板 - 仅显示页眉相关组件</span>
                                        </div>
                                    )}
                                    {!isPreviewMode && isEditingFooter && (
                                        <div className="mb-6 rounded-xl border-2 border-dashed border-purple-200 bg-purple-50/30 p-4 flex items-center justify-center text-purple-600 gap-2">
                                            <Layout className="w-5 h-5" />
                                            <span className="font-medium">正在编辑页脚模板 - 仅显示页脚相关组件</span>
                                        </div>
                                    )}

                                    {sections.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-96 text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-white shadow-inner">
                                            <Layout className="w-16 h-16 mb-4 opacity-10" />
                                            <p className="text-lg font-medium">{isEditingHeader ? '此处添加页眉内容' : isEditingFooter ? '此处添加页脚内容' : '主体内容区域'}</p>
                                            <p className="text-sm opacity-60">从左侧组件库点击或拖拽组件到此处</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4 min-h-[400px]">
                                            {sections.map((section) => (
                                                <SortableSection
                                                    key={section.id}
                                                    section={section}
                                                    isSelected={selectedSectionId === section.id}
                                                    onClick={() => setSelectedSectionId(section.id)}
                                                    onDelete={(id) => setDeleteConfirm({ isOpen: true, sectionId: id })}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* 页脚占位区域 - 仅在非页眉/页脚编辑模式下显示 */}
                                    {!isPreviewMode && !isEditingHeader && !isEditingFooter && (
                                        <div className="mt-10 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 flex flex-col items-center justify-center text-gray-400 group hover:bg-gray-100/80 transition-all">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Layout className="w-5 h-5 text-gray-300" />
                                                <span className="font-bold text-gray-500">底部页脚区域 (全局)</span>
                                            </div>
                                            <div className="text-sm text-gray-400 flex flex-col items-center gap-1">
                                                <p>此区域由全局页脚模板控制。如需修改链接、版权等信息，请：</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <button
                                                        onClick={() => router.push('/admin/settings/site')}
                                                        className="text-blue-600 hover:text-blue-700 font-medium underline flex items-center gap-1"
                                                    >
                                                        <Settings className="w-3.5 h-3.5" />
                                                        站点设置
                                                    </button>
                                                    <span className="text-gray-300">|</span>
                                                    <button
                                                        onClick={() => router.push('/admin/templates?category=FOOTER')}
                                                        className="text-blue-600 hover:text-blue-700 font-medium underline flex items-center gap-1"
                                                    >
                                                        <Layout className="w-3.5 h-3.5" />
                                                        页脚模板管理
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </SortableContext>
                            </DndContext>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {sections.map((section) => (
                                    <div key={section.id} className="p-4 border border-gray-200 rounded-lg bg-white opacity-50">
                                        加载中...
                                    </div>
                                ))}
                            </div>
                        )}
                        <div id="canvas-bottom" />
                        {/* 调试日志区域 */}
                        <div id="debug-log" className="hidden">{debugLog}</div>
                    </div>
                </div>
            </div>

            {/* 右侧属性面板 - hidden in preview mode */}
            {
                !isPreviewMode && (
                    <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 shadow-sm">
                        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-gray-600" />
                            <h2 className="font-bold text-gray-900">属性编辑</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {selectedSection && selectedDefinition ? (
                                <div className="space-y-6">
                                    <div className="pb-4 border-b border-gray-100">
                                        <h3 className="font-medium text-gray-900 mb-1">{selectedDefinition.name}</h3>
                                        <p className="text-xs text-gray-500">{selectedDefinition.description}</p>
                                    </div>

                                    {/* 数据字段 */}
                                    <div className="space-y-4">
                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                            <Type className="w-3 h-3" />
                                            内容设置
                                        </h4>
                                        {Object.entries(selectedDefinition.schema.data).map(([key, config]) => (
                                            <div key={key}>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    {config.label}
                                                </label>
                                                {renderInput(key, config, selectedSection.data[key], 'data')}
                                            </div>
                                        ))}
                                    </div>

                                    {/* 样式字段 */}
                                    {selectedDefinition.schema.style && (
                                        <div className="space-y-4 pt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                                                <Sparkles className="w-3 h-3" />
                                                样式设置
                                            </h4>
                                            {Object.entries(selectedDefinition.schema.style).map(([key, config]) => (
                                                <div key={key}>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        {config.label}
                                                    </label>
                                                    {renderInput(key, config, selectedSection.style?.[key], 'style')}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Settings className="w-12 h-12 mb-4 opacity-20" />
                                    <p className="text-center">请在画布中选择一个区块<br />进行编辑</p>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* 删除确认对话框 */}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onCancel={() => setDeleteConfirm({ isOpen: false, sectionId: null })}
                onConfirm={handleDeleteConfirm}
                title="删除区块"
                message="确定要删除这个区块吗？此操作不可恢复。"
                confirmText="删除"
                cancelText="取消"
                confirmButtonClass="bg-red-600 hover:bg-red-700"
            />
        </div >
    );
}
