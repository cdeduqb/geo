'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const Tabs02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, tabs = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#10b981' } = style;
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-6xl mx-auto flex gap-8">
                    {/* 左侧选项卡 */}
                    <div className="w-64 flex-shrink-0 space-y-2">
                        {tabs.map((tab: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="w-full px-6 py-4 text-left rounded-lg font-semibold transition-all"
                                style={{
                                    background: activeTab === index ? accentColor : 'white',
                                    color: activeTab === index ? 'white' : textColor,
                                    boxShadow: activeTab === index ? `0 4px 12px ${accentColor}40` : 'none'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 右侧内容 */}
                    <div className="flex-1 bg-white rounded-xl p-8 shadow-lg">
                        {tabs[activeTab] && (
                            <div>
                                <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
                                    {tabs[activeTab].contentTitle || tabs[activeTab].label}
                                </h3>
                                <p className="text-base opacity-70 mb-6" style={{ color: textColor }}>
                                    {tabs[activeTab].content}
                                </p>
                                {tabs[activeTab].features && (
                                    <ul className="space-y-3">
                                        {tabs[activeTab].features.map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                                                    <svg className="w-3 h-3" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <span style={{ color: textColor }}>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
