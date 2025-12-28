'use client';

import { registerSection, SectionProps } from '@/lib/sections/registry';
import React, { useState } from 'react';

export const TabsSection: React.FC<SectionProps> = ({ data, style = {}, isEditing }) => {
    const { title, subtitle, tabs } = data;
    const { backgroundColor = 'bg-white', padding = 'py-20', layout = 'horizontal' } = style;
    const [activeTab, setActiveTab] = useState(0);

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900  mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600  max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className={`flex ${layout === 'vertical' ? 'flex-col md:flex-row gap-8' : 'flex-col gap-8'}`}>
                    {/* Tab Headers */}
                    <div className={`flex ${layout === 'vertical' ? 'flex-col min-w-[200px]' : 'flex-wrap justify-center border-b border-gray-200 '}`}>
                        {tabs?.map((tab: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`px-6 py-3 font-medium text-sm transition-colors relative
                                    ${layout === 'vertical'
                                        ? `text-left border-l-2 ${activeTab === index ? 'border-blue-600 text-blue-600 bg-blue-50 ' : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50 :bg-gray-800'}`
                                        : `${activeTab === index ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'}`
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 bg-white  rounded-xl p-6 md:p-8 shadow-sm border border-gray-100  min-h-[300px]">
                        {tabs?.[activeTab] && (
                            <div className="prose  max-w-none animate-fadeIn">
                                <h3 className="text-xl font-bold mb-4">{tabs[activeTab].label}</h3>
                                <div dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'tabs',
    name: '选项卡',
    description: '切换显示不同内容',
    category: 'content',
    component: TabsSection,
    defaultData: {
        title: '多维解决方案',
        subtitle: '针对不同场景提供专业的解决方案',
        tabs: [
            {
                label: '企业版',
                content: '<p>专为大型企业设计，提供私有化部署、SSO 单点登录、审计日志等高级安全功能。支持无限用户数，提供 7x24 小时专属客户成功经理服务。</p><ul><li>私有化部署</li><li>SSO 集成</li><li>审计日志</li></ul>'
            },
            {
                label: '团队版',
                content: '<p>适合成长型团队，支持多人协作、权限管理和工作流自动化。包含 50 个用户席位，提供工作时间内的优先技术支持。</p><ul><li>团队协作</li><li>权限管理</li><li>API 访问</li></ul>'
            },
            {
                label: '个人版',
                content: '<p>适合自由职业者和个人开发者，提供基础的核心功能。包含 1 个用户席位，社区支持。</p><ul><li>基础功能</li><li>云端同步</li><li>社区支持</li></ul>'
            }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-20',
        layout: 'horizontal'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            tabs: { type: 'list', label: '选项卡列表 (label, content)' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' }
                ]
            },
            layout: {
                type: 'select',
                label: '布局方向',
                options: [
                    { label: '水平', value: 'horizontal' },
                    { label: '垂直', value: 'vertical' }
                ]
            }
        }
    }
});
