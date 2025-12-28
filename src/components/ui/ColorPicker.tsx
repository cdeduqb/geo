'use client';

import { useState } from 'react';

interface ColorPickerProps {
    value?: string;
    onChange: (color: string) => void;
    className?: string;
}

const PRESET_GRADIENTS = [
    'linear-gradient(to right, #2563eb, #9333ea)', // Blue -> Purple
    'linear-gradient(to right, #ec4899, #8b5cf6)', // Pink -> Purple
    'linear-gradient(to right, #06b6d4, #3b82f6)', // Cyan -> Blue
    'linear-gradient(to right, #10b981, #06b6d4)', // Emerald -> Cyan
    'linear-gradient(to right, #f59e0b, #ef4444)', // Amber -> Red
    'linear-gradient(to right, #6366f1, #ec4899)', // Indigo -> Pink
    'linear-gradient(to bottom, #1f2937, #000000)', // Dark
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Deep Purple
];

export default function ColorPicker({ value = '#ffffff', onChange, className = '' }: ColorPickerProps) {
    const [showPicker, setShowPicker] = useState(false);
    const [tempColor, setTempColor] = useState(value);

    // 检查是否为渐变色
    const isGradient = (color: string) => color?.includes('gradient');

    const handleOpen = () => {
        setTempColor(value);
        setShowPicker(true);
    };

    const handleSave = () => {
        onChange(tempColor);
        setShowPicker(false);
    };

    const handleCancel = () => {
        setTempColor(value);
        setShowPicker(false);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={value}
                    readOnly
                    onClick={handleOpen}
                    className="flex-1 rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm font-mono cursor-pointer hover:border-blue-400"
                    placeholder="点击选择颜色"
                />
                <div
                    className="relative w-10 h-9 rounded-md border-2 border-gray-300 cursor-pointer hover:border-blue-400 transition-colors shadow-sm bg-grid-slate-100"
                    onClick={handleOpen}
                    title="点击打开拾色器"
                >
                    <div className="absolute inset-0 rounded-[4px]" style={{ background: value }} />
                </div>
            </div>

            {showPicker && (
                <>
                    <div
                        className="fixed inset-0 z-[2000] bg-black/20 backdrop-blur-sm transition-opacity"
                        onClick={handleCancel}
                    />
                    <div
                        className="fixed z-[2001] bg-white rounded-xl shadow-2xl border border-gray-100 p-6 w-[560px] animate-in zoom-in-95 duration-200"
                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                        <h3 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-600 rounded-full" />
                            颜色选择器
                        </h3>

                        <div className="flex gap-6">
                            {/* 左侧：视觉选择区 */}
                            <div className="w-5/12 flex flex-col gap-4">
                                <label className="block text-xs font-medium text-gray-500">
                                    {isGradient(tempColor) ? '当前为渐变模式 (手动输入或选择预设)' : '点击色块选择纯色'}
                                </label>
                                <div className="relative w-full aspect-square rounded-lg border-2 border-gray-100 transition-all cursor-pointer overflow-hidden group shadow-inner">
                                    {/* 透明背景格子 */}
                                    <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] opacity-10" />

                                    {/* 当前颜色展示 */}
                                    <div
                                        className="absolute inset-0 transition-colors"
                                        style={{ background: tempColor }}
                                    />

                                    {/* 始终启用原生 Input，点击可切换回纯色 */}
                                    <input
                                        type="color"
                                        value={isGradient(tempColor) ? '#ffffff' : tempColor}
                                        onChange={(e) => setTempColor(e.target.value)}
                                        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-20"
                                    />

                                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity flex justify-center z-10">
                                        <span className="text-white text-xs font-medium backdrop-blur-md px-2 py-0.5 rounded-full bg-white/20">
                                            {isGradient(tempColor) ? '点击切换回纯色' : '打开系统拾色器'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 右侧：输入和预设区 */}
                            <div className="w-7/12 flex flex-col">
                                <div className="space-y-4 flex-1">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5 align-middle">
                                            颜色值 <span className="text-[10px] text-gray-400 ml-1">(Hex / RGB / Gradient)</span>
                                        </label>
                                        <textarea
                                            value={tempColor}
                                            onChange={(e) => setTempColor(e.target.value)}
                                            className="w-full h-[42px] rounded-lg border border-gray-300 px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none shadow-sm text-gray-700"
                                            placeholder="#FFFFFF or linear-gradient(...)"
                                        />
                                    </div>

                                    {/* 推荐渐变 */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-2">
                                            推荐渐变
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {PRESET_GRADIENTS.map((gradient, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => setTempColor(gradient)}
                                                    className="aspect-square rounded-full cursor-pointer border border-gray-200 hover:scale-110 hover:border-blue-400 hover:shadow-md transition-all active:scale-95 relative"
                                                    style={{ background: gradient }}
                                                    title="点击应用此渐变"
                                                >
                                                    {tempColor === gradient && (
                                                        <div className="absolute inset-0 rounded-full ring-2 ring-blue-600 ring-offset-2" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 对比预览 */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                                            效果对比
                                        </label>
                                        <div className="flex h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm ring-1 ring-gray-100">
                                            <div
                                                className="w-1/2 flex items-center justify-center text-xs text-white/90 font-mono relative transition-colors"
                                                style={{ background: value }}
                                            >
                                                <span className="bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px]">旧</span>
                                            </div>
                                            <div
                                                className="w-1/2 flex items-center justify-center text-xs text-white/90 font-mono relative transition-colors"
                                                style={{ background: tempColor }}
                                            >
                                                <span className="bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px]">新</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-all shadow-md shadow-blue-200 active:scale-[0.98]"
                                    >
                                        确认
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-800 text-sm font-medium transition-all border border-gray-200 active:scale-[0.98]"
                                    >
                                        取消
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
