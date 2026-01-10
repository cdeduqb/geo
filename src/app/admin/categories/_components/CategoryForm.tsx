'use client';

import { Category } from '@prisma/client';
import { Save, Loader2, ListTree, ChevronRight, Globe, Layers, Info } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';
import Link from 'next/link';

interface CategoryFormProps {
    category?: Category;
    categories?: Category[]; // For parent category selection
    action: (formData: FormData) => void;
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
    supportedLocales?: string[];
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-3 text-sm font-black text-white shadow-lg shadow-blue-100 hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
        >
            {pending ? <Loader2 className="w-4.5 h-4.5 mr-2 animate-spin" /> : <Save className="w-4.5 h-4.5 mr-2" />}
            {pending ? '正在保存...' : '执行保存'}
        </button>
    );
}

export default function CategoryForm({
    category,
    categories = [],
    action,
    enableMultiLanguage = false,
    translationGroups = [],
    supportedLocales = ['zh', 'en'],
}: CategoryFormProps) {
    const [selectedGroupId, setSelectedGroupId] = useState(category?.translationGroupId || '');
    const [lang, setLang] = useState(category?.lang || 'zh');

    const handleGroupIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === '__new__') {
            setSelectedGroupId(`group_${Date.now()}`);
        } else {
            setSelectedGroupId(val);
        }
    };

    // 样式常量
    const inputClass = "w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300";
    const labelClass = "text-[13px] font-bold text-gray-700 ml-1 block mb-2";
    const cardClass = "bg-white rounded-[32px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 p-10";

    return (
        <form action={action} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {category && <input type="hidden" name="id" value={category.id} />}

            {/* 顶部操作与面包屑 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
                        <ListTree className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{category ? '编辑分类' : '新建分类'}</h1>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-60">Structure & Taxonomy</p>
                    </div>
                </div>

                <div className="flex items-center gap-5">
                    <SubmitButton />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 主要内容区域 */}
                <div className="lg:col-span-2 space-y-8">
                    <div className={cardClass}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">分类核心属性</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label htmlFor="name" className={labelClass}>
                                    展现名称 <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={category?.name}
                                    required
                                    className={inputClass}
                                    placeholder="例如：公司新闻"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="slug" className={labelClass}>
                                    URL 别名 (Slug) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    name="slug"
                                    defaultValue={category?.slug}
                                    required
                                    className={`${inputClass} font-mono text-blue-600`}
                                    placeholder="news-and-updates"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="parentId" className={labelClass}>
                                    层级归属 (父级)
                                </label>
                                <select
                                    id="parentId"
                                    name="parentId"
                                    defaultValue={category?.parentId || ''}
                                    className={inputClass}
                                >
                                    <option value="">顶级分类 (Root)</option>
                                    {categories
                                        .filter(c => c.id !== category?.id)
                                        .map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="sortOrder" className={labelClass}>
                                    展示权重 (排序)
                                </label>
                                <input
                                    type="number"
                                    id="sortOrder"
                                    name="sortOrder"
                                    defaultValue={category?.sortOrder ?? 0}
                                    className={inputClass}
                                    placeholder="0"
                                />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">数值越小排位越靠前</p>
                            </div>

                            <div className="space-y-3 md:col-span-2">
                                <label htmlFor="description" className={labelClass}>
                                    分类摘要描述
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={category?.description || ''}
                                    rows={4}
                                    className={`${inputClass} resize-none leading-relaxed`}
                                    placeholder="简要描述该分类下的内容方向..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 侧边设置区域 */}
                <div className="space-y-8">
                    {enableMultiLanguage && (
                        <div className={cardClass}>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
                                <h2 className="text-lg font-black text-gray-900 tracking-tight">国际化设置</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label htmlFor="lang" className={labelClass}>关联语言</label>
                                    <select
                                        id="lang"
                                        name="lang"
                                        value={lang}
                                        onChange={(e) => setLang(e.target.value)}
                                        className={inputClass}
                                    >
                                        {supportedLocales.map(code => (
                                            <option key={code} value={code}>
                                                {code === 'zh' ? '简体中文 (CN)' :
                                                    code === 'en' ? 'English (US)' :
                                                        code === 'ja' ? '日语 (JP)' :
                                                            code === 'ko' ? '韩语 (KR)' :
                                                                code === 'fr' ? '法语 (FR)' :
                                                                    code === 'de' ? '德语 (DE)' :
                                                                        code === 'es' ? '西班牙语 (ES)' :
                                                                            code === 'ru' ? '俄语 (RU)' :
                                                                                code === 'pt' ? '葡萄牙语 (PT)' :
                                                                                    code === 'ar' ? '阿拉伯语 (AR)' : code}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <label className={labelClass}>多语言同步组</label>
                                    <input type="hidden" name="translationGroupId" value={selectedGroupId} />
                                    <select
                                        value={selectedGroupId}
                                        onChange={handleGroupIdChange}
                                        className={inputClass}
                                    >
                                        <option value="">独立分类 (不关联)</option>
                                        <option value="__new__">➕ 开启并创建新组</option>
                                        {translationGroups
                                            .filter(group => group.lang !== lang)
                                            .map(group => (
                                                <option key={group.id} value={group.id}>
                                                    {group.label}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {!enableMultiLanguage && (
                        <input type="hidden" name="lang" value="zh" />
                    )}

                    <div className="bg-gray-900 rounded-[32px] p-10 text-white shadow-2xl shadow-blue-100 overflow-hidden relative group">
                        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="w-6 h-6 text-blue-400" />
                                <h3 className="font-black text-lg">结构化建议</h3>
                            </div>
                            <ul className="space-y-5">
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Layers className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                        合理的分类层级有助于 <span className="text-blue-400 font-bold">SEO 权重传导</span>，建议深度不超过 3 层。
                                    </p>
                                </li>
                                <li className="flex gap-4">
                                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                                        URL 别名将直接影响页面路径。使用 <span className="text-blue-400 font-bold">语义化</span> 的单词更利于排名。
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
