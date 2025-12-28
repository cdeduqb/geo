'use client';
import { SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';
import { useState } from 'react';

// 联系我们14：时间轴联系方式+表单
export const Contact14Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const { title, subtitle, steps = [], buttonText = t('common.submit') } = data;
    const { backgroundColor = '#f9fafb', textColor = '#111827', accentColor = '#6366f1' } = style;

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

    const defaultSteps = steps.length > 0 ? steps : [
        { title: '发送留言', description: '填写表单提交您的需求' },
        { title: '获得回复', description: '1个工作日内回复' },
        { title: '沟通方案', description: '深入了解需求制定方案' }
    ];

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                {title && <h2 className="text-4xl font-bold text-center mb-4" style={{ color: textColor }}>{title}</h2>}
                {subtitle && <p className="text-lg text-center mb-12 opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                    {/* 左侧步骤 */}
                    <div className="space-y-8">
                        {defaultSteps.map((step: any, i: number) => (
                            <div key={i} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: accentColor }}>{i + 1}</div>
                                    {i < defaultSteps.length - 1 && <div className="w-0.5 h-16 bg-gray-200 mt-2" />}
                                </div>
                                <div className="pt-2">
                                    <h4 className="font-bold text-lg" style={{ color: textColor }}>{step.title}</h4>
                                    <p className="opacity-70" style={{ color: textColor }}>{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* 右侧表单 */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg">
                        {submitted ? (
                            <div className="text-center py-8"><p className="text-xl" style={{ color: accentColor }}>感谢您的留言，我们会尽快联系您！</p></div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <input type="text" placeholder="姓名 *" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <input type="tel" placeholder="手机 *" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                <textarea placeholder="留言 *" required rows={4} value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                                <button type="submit" disabled={isSubmitting} className="w-full py-3 rounded-lg font-bold text-white" style={{ background: accentColor }}>{isSubmitting ? '提交中...' : buttonText}</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
