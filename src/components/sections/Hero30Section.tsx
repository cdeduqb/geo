'use client';

import { useEffect, useRef } from 'react';
import { registerSection, SectionProps } from '@/lib/sections/registry';
import { useTranslation } from '@/lib/i18n/use-translation';

// Hero30Section: 粒子背景
export const Hero30Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { t } = useTranslation();
    const {
        title,
        subtitle,
        btnText,
        btnLink,
        btnTarget,
        isMainTitle = true
    } = data;

    const {
        backgroundColor = '#000000',
        textColor = '#ffffff',
        accentColor = '#ffffff'
    } = style;

    const TitleTag = isMainTitle ? 'h1' : 'h2';

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = canvas.width = canvas.offsetWidth;
        let h = canvas.height = canvas.offsetHeight;

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resize);

        const particles: any[] = [];
        const particleCount = 60; // Few particles for clean look

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }

        let animationFrame: number;

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = textColor;
            ctx.strokeStyle = textColor;

            // Update & Draw Particles
            for (let i = 0; i < particleCount; i++) {
                let p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Draw Connections
                for (let j = i + 1; j < particleCount; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.lineWidth = 0.5 * (1 - dist / 150);
                        ctx.globalAlpha = 0.5 * (1 - dist / 150);
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
            animationFrame = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, [textColor]); // Re-run if color changes

    return (
        <section
            className="relative py-32 min-h-[600px] flex items-center justify-center text-center overflow-hidden"
            style={{ background: backgroundColor }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full z-0 opacity-40"
            />

            <div className="relative z-10 container mx-auto px-4 pointer-events-none">
                <TitleTag
                    className="text-5xl md:text-7xl font-light tracking-wide mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000"
                    style={{ color: textColor }}
                >
                    {title}
                </TitleTag>
                <p
                    className="text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-light opacity-80 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200"
                    style={{ color: textColor }}
                >
                    {subtitle}
                </p>
                {btnText && (
                    <a
                        href={btnLink || '#'}
                        target={btnTarget || '_self'}
                        className="pointer-events-auto inline-block px-12 py-4 border border-white/20 bg-white/5 backdrop-blur-sm rounded-full text-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        style={{ color: textColor, borderColor: accentColor }}
                    >
                        {btnText}
                    </a>
                )}
            </div>
        </section>
    );
};

registerSection({
    type: 'hero-30',
    name: '交互粒子横幅',
    description: '具有可交互 Canvas 粒子连线效果的极简横幅',
    category: 'layout',
    component: Hero30Section,
    defaultData: {
        title: '科技定义未来',
        subtitle: '探索数字化转型的无限可能，构建连接万物的智能世界。',
        btnText: '开始探索',
        isMainTitle: true
    },
    defaultStyle: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        accentColor: '#ffffff'
    },
    schema: {
        data: {
            title: { type: 'text', label: '主标题' },
            subtitle: { type: 'text', label: '副标题' },
            isMainTitle: { type: 'boolean', label: '设为主标题 (H1)' },
            btnText: { type: 'text', label: '按钮文案' },
            btnLink: { type: 'link', label: '按钮链接' },
            btnTarget: { type: 'select', label: '跳转方式', options: [{ label: '当前窗口', value: '_self' }, { label: '新窗口', value: '_blank' }] }
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '连线/强调色' }
        }
    }
});
