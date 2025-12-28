'use client';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们15：大图背景+底部浮动表单
export const Contact15Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, email, buttonText = '发送', backgroundImage } = data;
    const { accentColor = '#10b981' } = style;

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
        <section className="relative min-h-[600px] flex flex-col" style={{ backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(to bottom, #134e5e, #71b280)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="flex-1 container mx-auto px-4 relative z-10 flex items-center justify-center text-center text-white py-16">
                <div>
                    {title && <h2 className="text-5xl font-bold mb-6">{title}</h2>}
                    {subtitle && <p className="text-xl opacity-80 mb-8">{subtitle}</p>}
                    <div className="flex flex-wrap justify-center gap-8">
                        {address && <span className="flex items-center gap-2"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>{address}</span>}
                        {phone && <a href={`tel:${phone}`} className="flex items-center gap-2 hover:underline"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>{phone}</a>}
                        {email && <a href={`mailto:${email}`} className="flex items-center gap-2 hover:underline"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>{email}</a>}
                    </div>
                </div>
            </div>
            {/* 底部浮动表单 */}
            <div className="relative z-10 -mb-16">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
                        {submitted ? (
                            <p className="text-center text-xl" style={{ color: accentColor }}>感谢您的留言！</p>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
                                <input type="text" placeholder="姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                <input type="tel" placeholder="手机 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                <input type="text" placeholder="留言 *" required value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="flex-[2] px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg font-bold text-white whitespace-nowrap" style={{ background: accentColor }}>{isSubmitting ? '...' : buttonText}</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-16" style={{ background: 'transparent' }} />
        </section>
    );
};
