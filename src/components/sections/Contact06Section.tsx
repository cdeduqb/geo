'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们06：全屏背景+居中表单
export const Contact06Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, buttonText = '发送留言', backgroundImage } = data;
    const { textColor = '#ffffff', accentColor = '#3b82f6' } = style;

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
        <section className="py-24 relative" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    {title && <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                    {subtitle && <p className="text-lg opacity-80" style={{ color: textColor }}>{subtitle}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* 联系信息 */}
                    <div className="space-y-6">
                        {address && (
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg" style={{ color: textColor }}>{t('contact.companyAddress')}</h4>
                                    <p className="opacity-80" style={{ color: textColor }}>{address}</p>
                                </div>
                            </div>
                        )}
                        {phone && (
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: accentColor }}>
                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg" style={{ color: textColor }}>{t('contact.contactPhone')}</h4>
                                    <a href={`tel:${phone}`} className="opacity-80 hover:opacity-100" style={{ color: textColor }}>{phone}</a>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 表单 */}
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                        {submitted ? (
                            <div className="text-center py-8"><p className="text-white font-medium">感谢您的留言！</p></div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="您的姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white" />
                                <input type="tel" placeholder="手机号码 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white" />
                                <textarea placeholder="留言内容 *" required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white resize-none" />
                                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '提交中...' : buttonText}</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
