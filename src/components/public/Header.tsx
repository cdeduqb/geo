import Link from 'next/link';
import { Search } from 'lucide-react';
import { getLocale } from '@/lib/locale-server';
import { getLocalePath, t } from '@/lib/i18n';
import { getSiteSettings } from '@/lib/site-settings';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default async function Header() {
    const locale = await getLocale();
    const siteSettings = await getSiteSettings();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md  ">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <Link href={getLocalePath('/', locale)} className="flex items-center gap-2 font-bold text-xl text-gray-900 ">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            G
                        </div>
                        <span>{t(locale, 'header.siteName')}</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href={getLocalePath('/', locale)} className="text-gray-600 hover:text-blue-600  :text-blue-400 transition-colors">
                            {t(locale, 'common.home')}
                        </Link>
                        <Link href={getLocalePath('/articles', locale)} className="text-gray-600 hover:text-blue-600  :text-blue-400 transition-colors">
                            {t(locale, 'common.articles')}
                        </Link>
                        <Link href={getLocalePath('/products', locale)} className="text-gray-600 hover:text-blue-600  :text-blue-400 transition-colors">
                            {t(locale, 'common.products')}
                        </Link>
                        <Link href={getLocalePath('/about', locale)} className="text-gray-600 hover:text-blue-600  :text-blue-400 transition-colors">
                            {t(locale, 'common.about')}
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative hidden sm:block">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 " />
                        <input
                            type="search"
                            placeholder={t(locale, 'common.searchPlaceholder')}
                            className="h-9 w-64 rounded-full border border-gray-200 bg-gray-50 px-9 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500   "
                        />
                    </div>
                    <LanguageSwitcher />
                    <Link
                        href="/login"
                        className="rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800   :bg-gray-200 transition-colors"
                    >
                        {t(locale, 'common.login')}
                    </Link>
                </div>
            </div>
        </header>
    );
}
