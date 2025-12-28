'use client';

import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们09：简约居中（地址电话+表单）
export const Contact09Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, buttonText = '提交留言' } = data;
    const { backgroundColor = '#f0fdf4', textColor = '#166534', accentColor = '#22c55e' } = style;

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
            <div className="container mx-auto px-4 max-w-2xl text-center">
                {title && <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg mb-8 opacity-70" style={{ color: textColor }}>{subtitle}</p>}

                <div className="flex flex-wrap justify-center gap-8 mb-10">
                    {address && (
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill={accentColor} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>
                            <span style={{ color: textColor }}>{address}</span>
                        </div>
                    )}
                    {phone && (
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill={accentColor} viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
                            <a href={`tel:${phone}`} style={{ color: accentColor }} className="hover:underline">{phone}</a>
                        </div>
                    )}
                </div>

                {submitted ? (
                    <div className="py-8"><p className="font-medium" style={{ color: accentColor }}>感谢您的留言！我们会尽快回复。</p></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div className="flex gap-4">
                            <input type="text" placeholder="姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="flex-1 px-4 py-3 rounded-full border border-green-200 bg-white focus:outline-none focus:border-green-400" />
                            <input type="tel" placeholder="手机 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="flex-1 px-4 py-3 rounded-full border border-green-200 bg-white focus:outline-none focus:border-green-400" />
                        </div>
                        <textarea placeholder="留言内容 *" required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-green-200 bg-white focus:outline-none focus:border-green-400 resize-none" />
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-full font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '提交中...' : buttonText}</button>
                    </form>
                )}
            </div>
        </section>
    );
};
