'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们01：经典三栏布局（地址+电话+邮箱）
export const Contact01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, email, hours } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4" itemScope itemType="http://schema.org/Organization">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-3 gap-8">
                    {/* 地址 */}
                    <div className="text-center p-6 rounded-2xl bg-gray-50">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: accentColor + '20' }}>
                            <svg className="w-8 h-8" fill={accentColor} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>{t('contact.companyAddress')}</h3>
                        <p className="opacity-70" style={{ color: textColor }} itemProp="address">{address || '北京市朝阳区xxx路xxx号'}</p>
                    </div>

                    {/* 电话 */}
                    <div className="text-center p-6 rounded-2xl bg-gray-50">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: accentColor + '20' }}>
                            <svg className="w-8 h-8" fill={accentColor} viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>{t('contact.contactPhone')}</h3>
                        <p className="opacity-70" style={{ color: textColor }} itemProp="telephone">{phone || '400-000-0000'}</p>
                    </div>

                    {/* 邮箱 */}
                    <div className="text-center p-6 rounded-2xl bg-gray-50">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: accentColor + '20' }}>
                            <svg className="w-8 h-8" fill={accentColor} viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold mb-2" style={{ color: textColor }}>{t('contact.emailAddress')}</h3>
                        <p className="opacity-70" style={{ color: textColor }} itemProp="email">{email || 'contact@company.com'}</p>
                    </div>
                </div>

                {hours && (
                    <div className="mt-10 text-center">
                        <p className="text-lg" style={{ color: textColor }}>
                            <span className="font-bold">{t('contact.workingHours')}：</span>{hours}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
