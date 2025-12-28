'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const Tabs03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, tabs = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#8b5cf6' } = style;
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* 胶囊式选项卡 */}
                    <div className="flex justify-center mb-10">
                        <div className="inline-flex bg-gray-100 rounded-full p-1.5">
                            {tabs.map((tab: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(index)}
                                    className="px-8 py-3 rounded-full font-semibold transition-all"
                                    style={{
                                        background: activeTab === index ? accentColor : 'transparent',
                                        color: activeTab === index ? 'white' : textColor,
                                        boxShadow: activeTab === index ? `0 4px 12px ${accentColor}40` : 'none'
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 内容区域 */}
                    <div className="text-center">
                        {tabs[activeTab] && (
                            <div className="max-w-3xl mx-auto">
                                <h3 className="text-3xl font-bold mb-6" style={{ color: textColor }}>
                                    {tabs[activeTab].contentTitle || tabs[activeTab].label}
                                </h3>
                                <p className="text-lg opacity-70 mb-8" style={{ color: textColor }}>
                                    {tabs[activeTab].content}
                                </p>
                                {tabs[activeTab].buttonText && (
                                    <button
                                        className="px-8 py-3 rounded-full font-semibold text-white transition-all hover:opacity-90"
                                        style={{ background: accentColor }}
                                    >
                                        {tabs[activeTab].buttonText}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
