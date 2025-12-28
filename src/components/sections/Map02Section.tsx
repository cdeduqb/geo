'use client';

import { SectionProps } from '@/lib/sections/registry';

// 地图02：地图+侧边信息
export const Map02Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, mapUrl, address, phone, email, hours } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#3b82f6' } = style;

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 rounded-2xl overflow-hidden h-96">
                        {mapUrl ? (
                            <iframe src={mapUrl} className="w-full h-full" frameBorder="0" allowFullScreen />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400">请配置地图链接</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold mb-6" style={{ color: textColor }}>位置信息</h3>
                        <div className="space-y-4">
                            {address && (
                                <div>
                                    <p className="text-sm opacity-50 mb-1">地址</p>
                                    <p style={{ color: textColor }}>{address}</p>
                                </div>
                            )}
                            {phone && (
                                <div>
                                    <p className="text-sm opacity-50 mb-1">电话</p>
                                    <a href={`tel:${phone}`} style={{ color: accentColor }}>{phone}</a>
                                </div>
                            )}
                            {email && (
                                <div>
                                    <p className="text-sm opacity-50 mb-1">邮箱</p>
                                    <a href={`mailto:${email}`} style={{ color: accentColor }}>{email}</a>
                                </div>
                            )}
                            {hours && (
                                <div>
                                    <p className="text-sm opacity-50 mb-1">营业时间</p>
                                    <p style={{ color: textColor }}>{hours}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
