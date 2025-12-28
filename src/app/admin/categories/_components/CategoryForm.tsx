'use client';

import { Category } from '@prisma/client';
import { Save, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

interface CategoryFormProps {
    category?: Category;
    categories?: Category[]; // For parent category selection
    action: (formData: FormData) => void;
    enableMultiLanguage?: boolean;
    translationGroups?: { id: string; label: string; lang: string }[];
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {pending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {pending ? '保存中...' : '保存分类'}
        </button>
    );
}

export default function CategoryForm({
    category,
    categories = [],
    action,
    enableMultiLanguage = false,
    translationGroups = [],
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
    return (
        <form action={action} className="space-y-6">
            {category && <input type="hidden" name="id" value={category.id} />}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">
                            分类名称
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={category?.name}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="输入分类名称"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="slug" className="text-sm font-medium text-gray-700">
                            URL 路径 (Slug)
                        </label>
                        <input
                            type="text"
                            id="slug"
                            name="slug"
                            defaultValue={category?.slug}
                            required
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="category-url-slug"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="sortOrder" className="text-sm font-medium text-gray-700">
                            排序权重 / ID编号
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                id="sortOrder"
                                name="sortOrder"
                                defaultValue={category?.sortOrder ?? 0}
                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="0"
                            />
                            <div className="text-xs text-gray-500 flex items-center shrink-0">
                                (数字越小越靠前，兼作分类ID)
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="parentId" className="text-sm font-medium text-gray-700">
                            父级分类
                        </label>
                        <select
                            id="parentId"
                            name="parentId"
                            defaultValue={category?.parentId || ''}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">无父级分类</option>
                            {categories
                                .filter(c => c.id !== category?.id) // Prevent selecting self as parent
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-700">
                            描述
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            defaultValue={category?.description || ''}
                            rows={3}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                            placeholder="分类描述..."
                        />
                    </div>

                    {enableMultiLanguage && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="lang" className="text-sm font-medium text-gray-700">
                                    语言
                                </label>
                                <select
                                    id="lang"
                                    name="lang"
                                    value={lang}
                                    onChange={(e) => setLang(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="zh">简体中文 (zh)</option>
                                    <option value="en">English (en)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="translationGroupId" className="text-sm font-medium text-gray-700">
                                    翻译组
                                </label>
                                <input type="hidden" name="translationGroupId" value={selectedGroupId} />
                                <select
                                    value={selectedGroupId}
                                    onChange={handleGroupIdChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option value="">不关联翻译组</option>
                                    <option value="__new__">➕ 创建新翻译组</option>
                                    {translationGroups
                                        .filter(group => group.lang !== lang)
                                        .map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.label}
                                            </option>
                                        ))}
                                    {selectedGroupId && !translationGroups.find(g => g.id === selectedGroupId) && (
                                        <option value={selectedGroupId}>
                                            当前组: {selectedGroupId}
                                        </option>
                                    )}
                                </select>
                                <p className="text-[10px] text-gray-400">相同内词不同语言版本的分类请选择相同的翻译组</p>
                            </div>
                        </div>
                    )}

                    {!enableMultiLanguage && (
                        <input type="hidden" name="lang" value="zh" />
                    )}

                    <SubmitButton />
                </div>
            </div>
        </form>
    );
}
