/**
 * 多语言组件使用示例页面
 * 
 * 展示如何在实际页面中使用多语言组件系统
 */
'use client';

import { useLocalizedComponent } from '@/components/localized';
import { Suspense } from 'react';

export default function LocalizedComponentDemo() {
    // 自动根据当前语言获取对应的 Hero 组件
    const Hero = useLocalizedComponent('Hero');

    return (
        <div className="min-h-screen">
            {/* Hero 部分 */}
            {Hero ? (
                <Suspense fallback={<HeroSkeleton />}>
                    <Hero />
                </Suspense>
            ) : (
                <div className="py-20 text-center">
                    <p>Hero 组件未找到</p>
                </div>
            )}

            {/* 其他内容 */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        多语言组件系统演示
                    </h2>
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                        <h3 className="text-xl font-semibold mb-4">当前语言</h3>
                        <p className="text-gray-600 mb-6">
                            页面会根据 URL 中的语言参数自动加载对应的组件。
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="/zh"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                中文版本
                            </a>
                            <a
                                href="/en"
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            >
                                English Version
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

/**
 * Hero 骨架屏
 */
function HeroSkeleton() {
    return (
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 animate-pulse">
            <div className="container mx-auto px-4 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="h-12 bg-gray-400 rounded mb-6 w-3/4 mx-auto"></div>
                    <div className="h-6 bg-gray-400 rounded mb-8 w-2/3 mx-auto"></div>
                    <div className="flex gap-4 justify-center">
                        <div className="h-12 bg-gray-400 rounded w-32"></div>
                        <div className="h-12 bg-gray-400 rounded w-32"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
