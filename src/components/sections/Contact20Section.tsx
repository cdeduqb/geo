'use client';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们20：极简底部CTA式
export const Contact20Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, phone, buttonText = t('common.submit') } = data;
    const { backgroundColor = '#18181b', textColor = '#fafafa', accentColor = '#a855f7' } = style;

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
            <div className="container mx-auto px-4 text-center">
                {title && <h2 className="text-5xl font-bold mb-6" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-xl opacity-70 mb-4" style={{ color: textColor }}>{subtitle}</p>}
                {phone && <p className="text-2xl mb-10"><a href={`tel:${phone}`} style={{ color: accentColor }} className="hover:underline">{phone}</a></p>}
                <div className="max-w-2xl mx-auto">
                    {submitted ? (
                        <p className="text-2xl" style={{ color: accentColor }}>感谢您的留言！</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="text" placeholder="姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500" />
                            <input type="tel" placeholder="手机 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500" />
                            <input type="text" placeholder="留言 *" required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-400 focus:outline-none focus:border-purple-500" />
                            <button type="submit" disabled={isSubmitting} className="px-6 py-3 rounded-lg font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '...' : buttonText}</button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};
