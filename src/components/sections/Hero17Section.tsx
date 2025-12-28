'use client';

import { useState } from 'react';
import { SectionProps } from '@/lib/sections/registry';

// Hero17Section: 交互式路线图
export const Hero17Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const {
        title,
        subtitle,
        steps = [] // { year, title, description, image }
    } = data;

    const {
        backgroundColor = '#ffffff',
        textColor = '#111827',
        accentColor = '#2563eb'
    } = style;

    const defaultSteps = steps;

    const [activeStep, setActiveStep] = useState(0);

    return (
        <section className="py-24 overflow-hidden" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                    <p className="text-xl opacity-70 max-w-2xl mx-auto" style={{ color: textColor }}>{subtitle}</p>
                </div>

                {/* Timeline Navigation */}
                <div className="relative mb-16">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 rounded-full"></div>
                    <div
                        className="absolute top-1/2 left-0 h-1 transition-all duration-500 rounded-full"
                        style={{
                            background: accentColor,
                            width: `${(activeStep / (defaultSteps.length - 1)) * 100}%`
                        }}
                    ></div>

                    <div className="relative flex justify-between">
                        {defaultSteps.map((step: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className={`w-8 h-8 rounded-full border-4 transition-all duration-300 relative group z-10 ${activeStep >= index ? 'scale-125' : 'bg-gray-100'
                                    }`}
                                style={{
                                    background: backgroundColor,
                                    borderColor: activeStep >= index ? accentColor : '#e5e7eb'
                                }}
                            >
                                <span
                                    className={`absolute -top-10 left-1/2 -translate-x-1/2 text-sm font-bold whitespace-nowrap transition-opacity ${activeStep === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                        }`}
                                    style={{ color: textColor }}
                                >
                                    {step.year}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Display */}
                <div className="grid md:grid-cols-2 gap-12 items-center min-h-[400px]">
                    <div className="order-2 md:order-1 space-y-6">
                        <div
                            className="text-6xl font-black opacity-10 transition-all duration-300"
                            style={{ color: accentColor }}
                        >
                            {defaultSteps[activeStep].year}
                        </div>
                        <h3 className="text-4xl font-bold" style={{ color: textColor }}>
                            {defaultSteps[activeStep].title}
                        </h3>
                        <p className="text-xl leading-relaxed opacity-80" style={{ color: textColor }}>
                            {defaultSteps[activeStep].description}
                        </p>
                    </div>
                    <div className="order-1 md:order-2 h-[400px] rounded-2xl overflow-hidden shadow-2xl relative">
                        {defaultSteps.map((step: any, index: number) => (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-500 ${activeStep === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                            >
                                <img
                                    src={step.image}
                                    alt={step.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/10"></div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};
