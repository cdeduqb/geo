'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们10：高端商务风格（左地址右表单）
export const Contact10Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, email, hours, buttonText = '发送咨询' } = data;
    const { backgroundColor = '#faf5ff', textColor = '#6b21a8', accentColor = '#a855f7', cardBackground = '#ffffff' } = style;

    const [formData, setFormData] = useState({ name: '', phone: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, phone: formData.phone, content: formData.content }) });
            if (res.ok) { setSubmitted(true); } else { const data = await res.json(); alert(data.error || '提交失败'); }
        } catch (error) { console.error('提交失败', error); alert('网络错误，请重试'); }
        setIsSubmitting(false);
    };

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
                    {/* 左侧联系信息 */}
                    <div className="rounded-3xl p-8 shadow-xl" style={{ background: cardBackground }}>
                        <h3 className="text-2xl font-bold mb-8" style={{ color: textColor }}>联系方式</h3>
                        <div className="space-y-6">
                            {address && (
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accentColor + '20' }}>
                                        <svg className="w-6 h-6" fill={accentColor} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1" style={{ color: textColor }}>{t('contact.companyAddress')}</h4>
                                        <p className="opacity-70" style={{ color: textColor }}>{address}</p>
                                    </div>
                                </div>
                            )}
                            {phone && (
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accentColor + '20' }}>
                                        <svg className="w-6 h-6" fill={accentColor} viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1" style={{ color: textColor }}>{t('contact.contactPhone')}</h4>
                                        <a href={`tel:${phone}`} style={{ color: accentColor }} className="hover:underline">{phone}</a>
                                    </div>
                                </div>
                            )}
                            {email && (
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accentColor + '20' }}>
                                        <svg className="w-6 h-6" fill={accentColor} viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1" style={{ color: textColor }}>{t('contact.emailAddress')}</h4>
                                        <a href={`mailto:${email}`} style={{ color: accentColor }} className="hover:underline">{email}</a>
                                    </div>
                                </div>
                            )}
                            {hours && (
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: accentColor + '20' }}>
                                        <svg className="w-6 h-6" fill={accentColor} viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold mb-1" style={{ color: textColor }}>{t('contact.workingHours')}</h4>
                                        <p className="opacity-70" style={{ color: textColor }}>{hours}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 右侧表单 */}
                    <div className="rounded-3xl p-8 shadow-xl" style={{ background: cardBackground }}>
                        <h3 className="text-2xl font-bold mb-8" style={{ color: textColor }}>在线咨询</h3>
                        {submitted ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="font-medium" style={{ color: textColor }}>感谢您的咨询！</p>
                                <p className="opacity-70 mt-2" style={{ color: textColor }}>我们会尽快与您联系</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>姓名 *</label>
                                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>手机号 *</label>
                                    <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2" style={{ color: textColor }}>咨询内容 *</label>
                                    <textarea required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-purple-200 focus:outline-none focus:border-purple-400 resize-none" />
                                </div>
                                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-xl font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '提交中...' : buttonText}</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
