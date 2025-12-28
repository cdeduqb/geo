'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们03：带留言表单（左联系信息右表单）
export const Contact03Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, email, showForm = true, buttonText = '发送留言' } = data;
    const { backgroundColor = '#1f2937', textColor = '#ffffff', accentColor = '#3b82f6' } = style;

    const [formData, setFormData] = useState({ name: '', phone: '', content: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: formData.name, phone: formData.phone, content: formData.content })
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json();
                alert(data.error || '提交失败，请重试');
            }
        } catch (error) {
            console.error('提交失败', error);
            alert('网络错误，请重试');
        }
        setIsSubmitting(false);
    };

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* 左侧联系信息 */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-bold mb-6" style={{ color: textColor }}>联系方式</h3>
                            <div className="space-y-4">
                                {address && (
                                    <p className="flex items-center gap-3" style={{ color: textColor }}>
                                        <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                                        <span>{address}</span>
                                    </p>
                                )}
                                {phone && (
                                    <p className="flex items-center gap-3" style={{ color: textColor }}>
                                        <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                                        <a href={`tel:${phone}`} className="hover:underline">{phone}</a>
                                    </p>
                                )}
                                {email && (
                                    <p className="flex items-center gap-3" style={{ color: textColor }}>
                                        <svg className="w-5 h-5 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                        <a href={`mailto:${email}`} className="hover:underline">{email}</a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 右侧表单 */}
                    {showForm && (
                        <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
                            {submitted ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: '#10b981' }}>
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold" style={{ color: textColor }}>感谢您的留言！</h3>
                                    <p className="opacity-70 mt-2" style={{ color: textColor }}>我们会尽快与您联系</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <input type="text" placeholder="您的姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50" />
                                    <input type="tel" placeholder="手机号码 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50" />
                                    <textarea placeholder="留言内容 *" required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/50 resize-none" />
                                    <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg font-bold text-white transition-colors" style={{ background: accentColor }}>
                                        {isSubmitting ? '提交中...' : buttonText}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
