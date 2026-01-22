import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { t, Locale, getLocalePath } from '@/lib/i18n';

interface HeroSectionProps {
    locale?: Locale;
}

export default function HeroSection({ locale = 'zh' }: HeroSectionProps) {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50   ">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] "></div>

            <div className="container relative mx-auto px-4 py-24 sm:py-32 md:py-40">
                <div className="mx-auto max-w-4xl text-center">
                    {/* 标签 */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700  ">
                        <Sparkles className="h-4 w-4" />
                        <span>{t(locale, 'home.heroBadge')}</span>
                    </div>

                    {/* 主标题 */}
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900  sm:text-5xl md:text-6xl lg:text-7xl">
                        {t(locale, 'home.heroMainTitle')}
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {t(locale, 'home.heroHighlight')}
                        </span>
                    </h1>

                    {/* 副标题 */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600  sm:text-xl">
                        {t(locale, 'home.heroDesc')}
                    </p>

                    {/* CTA 按钮 */}
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href={getLocalePath('/articles', locale)}
                            className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
                        >
                            {t(locale, 'home.browseArticles')}
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href={getLocalePath('/login', locale)}
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50    :border-gray-600 :bg-gray-700"
                        >
                            {t(locale, 'home.heroAdminButton')}
                        </Link>
                    </div>
                </div>

                {/* 统计数据 */}
                <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
                    {[
                        { label: t(locale, 'home.statAIModels'), value: '5+' },
                        { label: t(locale, 'home.statArticleGen'), value: '100%' },
                        { label: t(locale, 'home.statSEO'), value: t(locale, 'home.statAuto') },
                        { label: t(locale, 'home.statSpeed'), value: '<100ms' },
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-3xl font-bold text-blue-600 ">
                                {stat.value}
                            </div>
                            <div className="mt-1 text-sm text-gray-600 ">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
