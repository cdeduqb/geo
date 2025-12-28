'use client';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们19：左表单右图片
export const Contact19Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, buttonText = '提交留言', image } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#ef4444' } = style;

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
                <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                    {/* 左侧表单 */}
                    <div>
                        {title && <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                        {subtitle && <p className="text-lg opacity-70 mb-6" style={{ color: textColor }}>{subtitle}</p>}
                        <div className="flex flex-wrap gap-6 mb-8">
                            {address && <p className="flex items-center gap-2 text-sm" style={{ color: textColor }}><svg className="w-4 h-4" fill={accentColor} viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>{address}</p>}
                            {phone && <a href={`tel:${phone}`} className="flex items-center gap-2 text-sm hover:underline" style={{ color: accentColor }}><svg className="w-4 h-4" fill={accentColor} viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>{phone}</a>}
                        </div>
                        {submitted ? (
                            <div className="py-8"><p className="text-xl font-medium" style={{ color: accentColor }}>感谢您的留言！</p></div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" placeholder="姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                    <input type="tel" placeholder="手机 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500" />
                                </div>
                                <textarea placeholder="留言内容 *" required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
                                <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-lg font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '提交中...' : buttonText}</button>
                            </form>
                        )}
                    </div>
                    {/* 右侧图片 */}
                    <div className="rounded-2xl overflow-hidden h-96 lg:h-[500px]">
                        {image ? (
                            <img src={image} alt="联系我们" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white text-xl">请上传图片</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
