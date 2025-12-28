'use client';

import React from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { Plus, Minus } from 'lucide-react';
import { useState } from 'react';

export const FAQSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, items } = data;
    const { backgroundColor = 'bg-white', padding = 'py-16' } = style;
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900  mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600 ">{subtitle}</p>}
                </div>

                <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
                    {items?.map((item: any, index: number) => (
                        <div
                            key={index}
                            className="border border-gray-200  rounded-lg overflow-hidden bg-white "
                            itemProp="mainEntity"
                            itemScope
                            itemType="https://schema.org/Question"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 :bg-gray-700/50 transition-colors"
                            >
                                <span className="font-medium text-gray-900 " itemProp="name">{item.question}</span>
                                {openIndex === index ? (
                                    <Minus className="w-5 h-5 text-blue-600" />
                                ) : (
                                    <Plus className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                            <div
                                itemProp="acceptedAnswer"
                                itemScope
                                itemType="https://schema.org/Answer"
                                className={`${openIndex === index ? 'block' : 'hidden'}`}
                            >
                                <div className="p-4 pt-0 text-gray-600  border-t border-gray-100 " itemProp="text">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'faq-accordion',
    name: '常见问题',
    description: '折叠式问答列表',
    category: 'content',
    component: FAQSection,
    defaultData: {
        title: '常见问题',
        subtitle: '这里解答您最关心的问题',
        items: [
            { question: '如何开始使用？', answer: '注册账号后，您可以直接进入后台创建项目。' },
            { question: '支持哪些支付方式？', answer: '我们支持支付宝、微信支付以及信用卡支付。' },
            { question: '可以退款吗？', answer: '支持 7 天无理由退款，请联系客服处理。' },
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-16'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            items: { type: 'list', label: '问答列表' }
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
            padding: {
                type: 'select',
                label: '垂直间距',
                options: [
                    { label: '中', value: 'py-16' },
                    { label: '大', value: 'py-24' }
                ]
            }
        }
    }
});
