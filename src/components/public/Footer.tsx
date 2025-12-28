import Link from 'next/link';
import { Github, Twitter, Linkedin } from 'lucide-react';
import { getLocale } from '@/lib/locale-server';
import { getLocalePath, t } from '@/lib/i18n';

export default async function Footer() {
    const locale = await getLocale();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-gray-200 bg-gray-50  ">
            <div className="container mx-auto px-4 py-12 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href={getLocalePath('/', locale)} className="flex items-center gap-2 font-bold text-xl text-gray-900 ">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                G
                            </div>
                            <span>{t(locale, 'header.siteName')}</span>
                        </Link>
                        <p className="text-sm text-gray-500 ">
                            {t(locale, 'footer.description')}
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-gray-900 :text-gray-50">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-gray-900 :text-gray-50">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-gray-400 hover:text-gray-900 :text-gray-50">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 ">
                            {t(locale, 'footer.products')}
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500 ">
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.features')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.solutions')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.pricing')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.changelog')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 ">
                            {t(locale, 'footer.resources')}
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500 ">
                            <li><Link href={getLocalePath('/articles', locale)} className="hover:text-blue-600">{t(locale, 'footer.blog')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.helpCenter')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.documentation')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.forum')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="mb-4 text-sm font-semibold text-gray-900 ">
                            {t(locale, 'footer.company')}
                        </h3>
                        <ul className="space-y-2 text-sm text-gray-500 ">
                            <li><Link href={getLocalePath('/about', locale)} className="hover:text-blue-600">{t(locale, 'footer.aboutUs')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.careers')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.contactUs')}</Link></li>
                            <li><Link href="#" className="hover:text-blue-600">{t(locale, 'footer.privacy')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500  ">
                    {t(locale, 'footer.copyright', { year: currentYear.toString() })}
                </div>
            </div>
        </footer>
    );
}
