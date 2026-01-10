/**
 * Hero 组件 - 中文版本
 * 
 * 特点：
 * - 中文排版优化
 * - 适合中文用户的视觉风格
 * - 本土化的交互设计
 */

export default function HeroZh() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* 主标题 - 中文优化字距 */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-wide">
                        欢迎来到<span className="text-yellow-300">未来科技</span>
                    </h1>

                    {/* 副标题 - 中文语态 */}
                    <p className="text-lg md:text-2xl mb-8 text-blue-100 leading-relaxed">
                        我们用创新技术为您提供卓越的解决方案<br />
                        助力企业数字化转型，创造无限可能
                    </p>

                    {/* 行动按钮 - 中文本土化 */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                            免费试用
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 w-full sm:w-auto">
                            了解更多
                        </button>
                    </div>

                    {/* 信任标记 - 中文表达 */}
                    <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm">超过 <strong>10万+</strong> 用户信赖</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-6 h-6 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">7×24小时 专业服务</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 装饰性元素 */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
                <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
            </div>
        </section>
    );
}
