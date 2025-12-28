'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// 联系我们02：左侧信息+右侧地图
export const Contact02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();

    const { title, subtitle, address, phone, email, mapUrl, contacts = [] } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-2 gap-10">
                    {/* 左侧联系信息 */}
                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg" style={{ color: textColor }}>{t('contact.companyAddress')}</h4>
                                <p className="opacity-70" style={{ color: textColor }}>{address || '北京市朝阳区xxx路xxx号'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg" style={{ color: textColor }}>{t('contact.contactPhone')}</h4>
                                <p className="opacity-70" style={{ color: textColor }}>{phone || '400-000-0000'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-lg" style={{ color: textColor }}>{t('contact.emailAddress')}</h4>
                                <p className="opacity-70" style={{ color: textColor }}>{email || 'contact@company.com'}</p>
                            </div>
                        </div>

                        {contacts.length > 0 && (
                            <div className="pt-4 border-t">
                                <h4 className="font-bold text-lg mb-4" style={{ color: textColor }}>{t('contact.contacts')}</h4>
                                {contacts.map((c: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 mb-3">
                                        <span className="font-medium" style={{ color: textColor }}>{c.name}</span>
                                        <span className="opacity-60" style={{ color: textColor }}>{c.phone}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 右侧地图 */}
                    <div className="rounded-2xl overflow-hidden h-80 md:h-auto">
                        {mapUrl ? (
                            <iframe src={mapUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">{t('contact.mapLoading')}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
