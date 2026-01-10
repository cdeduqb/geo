/**
 * Hero Component - English Version
 * 
 * Features:
 * - Optimized for English Typography
 * - Western Visual Style
 * - International UX Patterns
 */

export default function HeroEn() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
            <div className="container mx-auto px-6 py-24 md:py-40">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Main Headline - English Typography */}
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
                        Welcome to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">Future</span>
                    </h1>

                    {/* Subhe heading - English Tone */}
                    <p className="text-xl md:text-3xl mb-10 text-purple-100 leading-relaxed font-light">
                        Innovative technology solutions that empower your business<br />
                        Transform digitally and unlock unlimited possibilities
                    </p>

                    {/* CTA Buttons - International Style */}
                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <button className="group px-10 py-5 bg-white text-purple-600 rounded-lg font-bold hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto">
                            <span className="flex items-center justify-center gap-2">
                                Start Free Trial
                                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>
                        <button className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto">
                            Learn More
                        </button>
                    </div>

                    {/* Trust Badges - International Format */}
                    <div className="mt-16 flex items-center justify-center gap-12 flex-wrap text-purple-100">
                        <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="text-left">
                                <div className="font-bold text-lg">100K+</div>
                                <div className="text-sm opacity-80">Trusted Users</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="text-left">
                                <div className="font-bold text-lg">24/7</div>
                                <div className="text-sm opacity-80">Expert Support</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <div className="text-left">
                                <div className="font-bold text-lg">99.9%</div>
                                <div className="text-sm opacity-80">Uptime SLA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>
        </section>
    );
}
