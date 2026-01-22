'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp, ImageIcon, GripVertical } from 'lucide-react';
import ImageUploader from './ImageUploader';
import ColorPicker from './ColorPicker';
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

interface ListEditorProps {
    value?: any[];
    onChange: (items: any[]) => void;
    itemSchema: Record<string, any>;
}

function SortableItem({
    index,
    item,
    schema,
    isEditing,
    onEdit,
    onDelete,
    onUpdateItem
}: {
    index: number;
    item: any;
    schema: Record<string, any>;
    isEditing: boolean;
    onEdit: (index: number | null) => void;
    onDelete: (index: number) => void;
    onUpdateItem: (index: number, key: string, value: any) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: index });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const renderFieldValue = (key: string, config: any, value: any) => {
        switch (config.type) {
            case 'image':
                return (
                    <div className="w-10 h-10 rounded border border-gray-100 p-0.5 bg-white flex items-center justify-center overflow-hidden">
                        {value ? (
                            <img src={value} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <ImageIcon className="w-4 h-4 text-gray-300" />
                        )}
                    </div>
                );
            case 'color':
                return (
                    <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: value || '#ddd' }} />
                );
            default:
                return <span className="text-xs text-gray-500 truncate">{String(value || '')}</span>;
        }
    };

    const renderInput = (key: string, config: any, value: any) => {
        switch (config.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={e => onUpdateItem(index, key, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                        placeholder={config.label}
                    />
                );
            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        onChange={e => onUpdateItem(index, key, e.target.value)}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                        placeholder={config.label}
                    />
                );
            case 'image':
                return <ImageUploader value={value || ''} onChange={val => onUpdateItem(index, key, val)} />;
            case 'color':
                return <ColorPicker value={value || '#000000'} onChange={val => onUpdateItem(index, key, val)} />;
            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={e => onUpdateItem(index, key, e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm"
                    >
                        <option value="">请选择</option>
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
                        onChange={e => onUpdateItem(index, key, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-white rounded-lg border shadow-sm transition-all overflow-hidden ${isEditing ? 'border-blue-400 ring-2 ring-blue-500/10' : 'border-gray-200 hover:border-gray-300'}`}
        >
            {/* Header / Summary View */}
            <div className="flex items-center gap-2 p-2 bg-gray-50/50">
                <button {...attributes} {...listeners} className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-4 h-4" />
                </button>

                <div className="flex-1 flex items-center gap-3 min-w-0" onClick={() => onEdit(isEditing ? null : index)}>
                    {Object.entries(schema).slice(0, 2).map(([key, config]) => (
                        <div key={key} className="flex items-center gap-1.5 overflow-hidden">
                            {renderFieldValue(key, config, item[key])}
                        </div>
                    ))}
                    <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-gray-700 truncate block">
                            {item.name || item.title || item.label || `项目 ${index + 1}`}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onDelete(index)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
                        title="删除"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onEdit(isEditing ? null : index)}
                        className="p-1.5 text-gray-400 hover:text-blue-500 rounded transition-colors"
                    >
                        {isEditing ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isEditing && (
                <div className="p-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-1 duration-200">
                    {Object.entries(schema).map(([key, config]) => (
                        <div key={key}>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{config.label}</label>
                            {renderInput(key, config, item[key])}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ListEditor({ value = [], onChange, itemSchema }: ListEditorProps) {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAdd = () => {
        const newItem = Object.keys(itemSchema).reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {} as any);

        const newList = [...value, newItem];
        onChange(newList);
        setEditingIndex(newList.length - 1);
    };

    const handleDelete = (index: number) => {
        const newList = value.filter((_, i) => i !== index);
        onChange(newList);
        if (editingIndex === index) setEditingIndex(null);
        else if (editingIndex !== null && editingIndex > index) setEditingIndex(editingIndex - 1);
    };

    const handleUpdateItem = (index: number, key: string, val: any) => {
        const newList = value.map((item, i) => {
            if (i === index) {
                return { ...item, [key]: val };
            }
            return item;
        });
        onChange(newList);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = active.id as number;
            const newIndex = over?.id as number;
            onChange(arrayMove(value, oldIndex, newIndex));
            if (editingIndex === oldIndex) setEditingIndex(newIndex);
            else if (editingIndex === newIndex) setEditingIndex(oldIndex);
        }
    };

    return (
        <div className="space-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={value.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {value.map((item, index) => (
                            <SortableItem
                                key={index}
                                index={index}
                                item={item}
                                schema={itemSchema}
                                isEditing={editingIndex === index}
                                onEdit={setEditingIndex}
                                onDelete={handleDelete}
                                onUpdateItem={handleUpdateItem}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button
                onClick={handleAdd}
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-500 transition-all flex items-center justify-center gap-2 text-sm font-medium"
            >
                <Plus className="w-4 h-4" />
                添加项目
            </button>
        </div>
    );
}
