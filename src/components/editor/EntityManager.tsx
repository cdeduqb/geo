/**
 * 实体管理组件
 * 用于在文章编辑器中管理实体标记
 */

'use client';

import { useState } from 'react';
import { Plus, Edit2, Trash2, Sparkles, Loader2 } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export interface Entity {
    text: string;
    type: 'Person' | 'Place' | 'Organization' | 'Product' | 'Concept';
    description?: string;
    url?: string;
}

interface EntityManagerProps {
    entities: Entity[];
    onChange: (entities: Entity[]) => void;
    content?: string; // 文章内容，用于自动提取
    lang?: string; // 文章语言
}

export default function EntityManager({ entities, onChange, content, lang = 'zh' }: EntityManagerProps) {
    const [isExtracting, setIsExtracting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState<Partial<Entity>>({});
    const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

    const handleConfirmDelete = () => {
        if (deletingIndex === null) return;
        onChange(entities.filter((_, i) => i !== deletingIndex));
        setDeletingIndex(null);
    };

    // 按类型分组
    const groupedEntities = {
        Person: entities.filter(e => e.type === 'Person'),
        Place: entities.filter(e => e.type === 'Place'),
        Organization: entities.filter(e => e.type === 'Organization'),
        Product: entities.filter(e => e.type === 'Product'),
        Concept: entities.filter(e => e.type === 'Concept'),
    };

    const handleAutoExtract = async () => {
        if (!content) {
            alert('请先填写文章内容');
            return;
        }

        setIsExtracting(true);
        try {
            const res = await fetch('/api/admin/geo/extract-entities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, lang }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || '提取失败');
            }

            const data = await res.json();
            const extractedEntities = data.entities || [];

            // 合并已有实体和提取的实体（去重）
            const merged = [...entities];
            extractedEntities.forEach((newEntity: Entity) => {
                const exists = merged.some(
                    e => e.text && newEntity.text && e.text.toLowerCase() === newEntity.text.toLowerCase() && e.type === newEntity.type
                );
                if (!exists) {
                    merged.push(newEntity);
                }
            });

            onChange(merged);
            alert(`成功提取 ${extractedEntities.length} 个实体`);
        } catch (error) {
            console.error(error);
            alert(error instanceof Error ? error.message : '自动提取实体失败');
        } finally {
            setIsExtracting(false);
        }
    };

    const handleAdd = (type: Entity['type']) => {
        setIsEditing(true);
        setEditingIndex(null);
        setFormData({ type });
    };

    const handleEdit = (index: number) => {
        setIsEditing(true);
        setEditingIndex(index);
        setFormData(entities[index]);
    };

    const handleSave = () => {
        if (!formData.text) {
            alert('请输入实体名称');
            return;
        }
        if (!formData.type) {
            alert('请选择实体类型');
            return;
        }

        const newEntity: Entity = {
            text: formData.text!,
            type: formData.type!,
            description: formData.description,
            url: formData.url,
        };

        if (editingIndex !== null) {
            // 编辑
            const updated = [...entities];
            updated[editingIndex] = newEntity;
            onChange(updated);
        } else {
            // 添加
            onChange([...entities, newEntity]);
        }

        setIsEditing(false);
        setEditingIndex(null);
        setFormData({});
    };

    const handleDelete = (index: number) => {
        setDeletingIndex(index);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditingIndex(null);
        setFormData({});
    };

    const renderEntityList = (type: Entity['type'], icon: string, label: string) => {
        const typeEntities = groupedEntities[type];
        if (typeEntities.length === 0 && !isEditing) return null;

        return (
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-gray-700 ">
                        {icon} {label} ({typeEntities.length})
                    </h4>
                    <button
                        onClick={() => handleAdd(type)}
                        className="text-xs text-blue-600 hover:text-blue-700 "
                        type="button"
                    >
                        + 添加
                    </button>
                </div>
                <div className="space-y-2">
                    {typeEntities.map((entity, idx) => {
                        const globalIndex = entities.findIndex(e => e === entity);
                        return (
                            <div
                                key={globalIndex}
                                className="flex items-start justify-between gap-2 p-2 bg-gray-50  rounded text-xs"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900  truncate">
                                        {entity.text}
                                    </p>
                                    {entity.description && (
                                        <p className="text-gray-600  text-xs mt-0.5">
                                            {entity.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEdit(globalIndex)}
                                        className="p-1 text-gray-600 hover:text-gray-700 "
                                        title="编辑"
                                        type="button"
                                    >
                                        <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(globalIndex)}
                                        className="p-1 text-red-600 hover:text-red-700 "
                                        title="删除"
                                        type="button"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
        );
    };

    return (
        <div className="border border-gray-200  rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 ">
                    实体识别 ({entities.length})
                </h3>
                <button
                    onClick={handleAutoExtract}
                    disabled={isExtracting || !content}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-600 hover:text-purple-700  disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                >
                    {isExtracting ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            提取中...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-3 h-3" />
                            自动提取实体
                        </>
                    )}
                </button>
            </div>

            {/* 实体列表 */}
            {!isEditing && (
                <div>
                    {renderEntityList('Person', '👤', '人物')}
                    {renderEntityList('Place', '📍', '地点')}
                    {renderEntityList('Organization', '🏢', '组织')}
                    {renderEntityList('Product', '📦', '产品')}
                    {renderEntityList('Concept', '💡', '概念')}

                    {entities.length === 0 && (
                        <p className="text-xs text-gray-500  text-center py-4">
                            暂无实体标记，点击"自动提取实体"或手动添加
                        </p>
                    )}
                </div>
            )}

            {/* 编辑表单 */}
            {isEditing && (
                <div className="border-t border-gray-200  pt-4 space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            实体名称 *
                        </label>
                        <input
                            type="text"
                            value={formData.text || ''}
                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="例如: 张三, 北京, 阿里巴巴"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            类型 *
                        </label>
                        <select
                            value={formData.type || ''}
                            onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                        >
                            <option value="">请选择</option>
                            <option value="Person">👤 人物</option>
                            <option value="Place">📍 地点</option>
                            <option value="Organization">🏢 组织</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            描述
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="简短描述（可选）"
                            rows={2}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700  mb-1">
                            相关链接
                        </label>
                        <input
                            type="url"
                            value={formData.url || ''}
                            onChange={e => setFormData({ ...formData, url: e.target.value })}
                            className="w-full px-2 py-1 text-sm border border-gray-300  rounded
                                bg-white  text-gray-900 "
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
                            type="button"
                        >
                            保存
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-700  bg-gray-100  hover:bg-gray-200 :bg-gray-600 rounded"
                            type="button"
                        >
                            取消
                        </button>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={deletingIndex !== null}
                onCancel={() => setDeletingIndex(null)}
                onConfirm={handleConfirmDelete}
                title="删除实体"
                message="确定要删除这个实体吗？此操作不可恢复。"
                confirmText="删除"
            />
        </div>
    );
}
