'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const Tabs05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, tabs = [] } = data;
    const { backgroundColor = '#fdf2f8', textColor = '#111827', accentColor = '#ec4899' } = style;
    const [activeTab, setActiveTab] = useState(0);

    const icons = ['⚡', '🎯', '🔧', '📊', '🚀', '💡'];

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* 图标选项卡 */}
                    <div className="flex justify-center gap-4 mb-12">
                        {tabs.map((tab: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all"
                                style={{
                                    background: activeTab === index ? accentColor : 'white',
                                    color: activeTab === index ? 'white' : textColor,
                                    boxShadow: activeTab === index ? `0 8px 20px ${accentColor}40` : '0 2px 8px rgba(0,0,0,0.05)'
                                }}
                            >
                                <span className="text-2xl">{tab.icon || icons[index % icons.length]}</span>
                                <span className="font-semibold">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* 内容区域 */}
                    <div className="bg-white rounded-2xl p-10 shadow-xl">
                        {tabs[activeTab] && (
                            <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl" style={{ background: `${accentColor}20` }}>
                                    {tabs[activeTab].icon || icons[activeTab % icons.length]}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
                                        {tabs[activeTab].contentTitle || tabs[activeTab].label}
                                    </h3>
                                    <p className="text-base opacity-70" style={{ color: textColor }}>
                                        {tabs[activeTab].content}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
