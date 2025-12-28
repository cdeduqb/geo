'use client';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们12：分割背景（左深右浅）
export const Contact12Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, address, phone, email, buttonText = '提交咨询' } = data;
    const { leftBackground = '#1e40af', rightBackground = '#f8fafc', textColor = '#111827', accentColor = '#3b82f6' } = style;

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
        <section className="flex flex-col lg:flex-row min-h-[500px]">
            {/* 左侧深色区域 */}
            <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center" style={{ background: leftBackground }}>
                {title && <h2 className="text-4xl font-bold mb-6 text-white">{title}</h2>}
                {subtitle && <p className="text-lg opacity-80 mb-10 text-white">{subtitle}</p>}
                <div className="space-y-4 text-white">
                    {address && <p className="flex items-center gap-3"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /></svg>{address}</p>}
                    {phone && <p className="flex items-center gap-3"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg><a href={`tel:${phone}`} className="hover:underline">{phone}</a></p>}
                    {email && <p className="flex items-center gap-3"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg><a href={`mailto:${email}`} className="hover:underline">{email}</a></p>}
                </div>
            </div>
            {/* 右侧浅色表单 */}
            <div className="lg:w-1/2 p-12 lg:p-16 flex items-center" style={{ background: rightBackground }}>
                {submitted ? (
                    <div className="w-full text-center"><p className="text-xl font-medium" style={{ color: accentColor }}>感谢您的咨询！</p></div>
                ) : (
                    <form onSubmit={handleSubmit} className="w-full space-y-5">
                        <div><label className="block text-sm font-medium mb-2" style={{ color: textColor }}>姓名 *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                        <div><label className="block text-sm font-medium mb-2" style={{ color: textColor }}>手机 *</label><input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                        <div><label className="block text-sm font-medium mb-2" style={{ color: textColor }}>留言 *</label><textarea required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
                        <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '提交中...' : buttonText}</button>
                    </form>
                )}
            </div>
        </section>
    );
};
