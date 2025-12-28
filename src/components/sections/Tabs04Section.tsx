'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const Tabs04Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, tabs = [] } = data;
    const { backgroundColor = '#0f172a', textColor = '#f1f5f9', accentColor = '#f59e0b' } = style;
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* 下划线选项卡 */}
                    <div className="flex justify-center gap-12 mb-12">
                        {tabs.map((tab: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="pb-3 font-semibold text-lg transition-all relative"
                                style={{ color: activeTab === index ? accentColor : `${textColor}80` }}
                            >
                                {tab.label}
                                {activeTab === index && (
                                    <div
                                        className="absolute bottom-0 left-0 right-0 h-1 rounded-full"
                                        style={{ background: accentColor }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* 卡片内容 */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {tabs[activeTab] && (
                            <>
                                <div className="rounded-xl p-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
                                        {tabs[activeTab].contentTitle || tabs[activeTab].label}
                                    </h3>
                                    <p className="text-base opacity-70" style={{ color: textColor }}>
                                        {tabs[activeTab].content}
                                    </p>
                                </div>
                                <div className="rounded-xl p-8" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <h4 className="text-lg font-semibold mb-4" style={{ color: accentColor }}>关键优势</h4>
                                    {tabs[activeTab].advantages && (
                                        <ul className="space-y-3">
                                            {tabs[activeTab].advantages.map((adv: string, idx: number) => (
                                                <li key={idx} className="flex items-center gap-3 text-sm" style={{ color: textColor }}>
                                                    <span style={{ color: accentColor }}>→</span>
                                                    {adv}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
