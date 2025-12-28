'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useState } from 'react';

export const Tabs01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, tabs = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12 max-w-3xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>
                    {subtitle && <p className="text-xl opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="max-w-5xl mx-auto">
                    {/* 选项卡头部 */}
                    <div className="flex border-b mb-8" style={{ borderColor: '#e5e7eb' }}>
                        {tabs.map((tab: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className="px-6 py-4 font-semibold transition-all relative"
                                style={{
                                    color: activeTab === index ? accentColor : `${textColor}99`,
                                    borderBottom: activeTab === index ? `3px solid ${accentColor}` : '3px solid transparent'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 选项卡内容 */}
                    <div className="bg-gray-50 rounded-xl p-8">
                        {tabs[activeTab] && (
                            <div>
                                <h3 className="text-2xl font-bold mb-4" style={{ color: textColor }}>
                                    {tabs[activeTab].contentTitle || tabs[activeTab].label}
                                </h3>
                                <p className="text-base opacity-70" style={{ color: textColor }}>
                                    {tabs[activeTab].content}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
