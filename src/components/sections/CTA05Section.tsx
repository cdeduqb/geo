'use client';


export const CTA05Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, emailPlaceholder, buttonText } = data;
    const { backgroundColor = '#ede9fe', textColor = '#111827', accentColor = '#8b5cf6' } = style;

    return (
        <section className="py-20" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-4xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>
                {subtitle && <p className="text-xl opacity-70 mb-8" style={{ color: textColor }}>{subtitle}</p>}
                <form className="max-w-lg mx-auto flex gap-4">
                    <input type="email" placeholder={emailPlaceholder || '输入您的邮箱'} className="flex-1 px-6 py-4 rounded-full bg-white border-0 outline-none focus:ring-2" style={{ '--tw-ring-color': accentColor } as React.CSSProperties} />
                    <button type="submit" className="px-8 py-4 rounded-full font-bold transition-all hover:opacity-90" style={{ background: accentColor, color: 'white' }}>
                        {buttonText || '订阅'}
                    </button>
                </form>
                <p className="mt-4 text-sm opacity-50" style={{ color: textColor }}>我们尊重您的隐私，不会发送垃圾邮件</p>
            </div>
        </section>
    );
};
