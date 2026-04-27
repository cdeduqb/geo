'use client';

import { ReactNode } from 'react';
import { useAdminLayout } from '@/app/admin/_components/layout/AdminLayoutContext';

interface CardProps {
    children: ReactNode;
    title?: string;
    extra?: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export default function Card({ children, title, extra, className = '', noPadding = false }: CardProps) {
    const { layoutType } = useAdminLayout();

    // 根据不同宏观布局，智能分配 Card 子组件的边界阴影和圆角
    const layoutStyleMap: any = {
        'classic': 'bg-white rounded-2xl shadow-sm border border-slate-100/60',
        'ant-dark': 'bg-white rounded-sm shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] border-b border-gray-100',
        'vercel-top': 'bg-white rounded-xl border border-gray-200 shadow-sm transition-shadow hover:shadow-md',
        'macos-glass': 'bg-white/50 backdrop-blur-3xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]',
        'cyber-dark': 'bg-neutral-900 rounded-lg border border-neutral-800 shadow-[0_4px_24px_rgba(0,0,0,0.2)] text-neutral-200'
    };

    const headerStyleMap: any = {
        'classic': 'px-6 py-5 border-b border-gray-50',
        'ant-dark': 'px-6 py-4 border-b border-[#f0f0f0]',
        'vercel-top': 'px-6 py-4 border-b border-gray-200 bg-gray-50/50 rounded-t-xl',
        'macos-glass': 'px-6 py-4 border-b border-white/40 bg-white/30 rounded-t-2xl',
        'cyber-dark': 'px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 rounded-t-lg'
    };

    const titleStyleMap: any = {
        'classic': 'text-base font-bold text-gray-800',
        'ant-dark': 'text-[15px] font-semibold text-[#000000e0]',
        'vercel-top': 'text-[14px] font-medium text-gray-900 tracking-tight',
        'macos-glass': 'text-[14px] font-bold text-gray-800 drop-shadow-sm',
        'cyber-dark': 'text-[14px] font-semibold text-neutral-300 tracking-wide'
    };

    return (
        <div className={`${layoutStyleMap[layoutType]} ${className}`}>
            {(title || extra) && (
                <div className={`flex items-center justify-between ${headerStyleMap[layoutType]}`}>
                    {title && <h3 className={`${titleStyleMap[layoutType]}`}>{title}</h3>}
                    {extra && <div className="flex items-center gap-2">{extra}</div>}
                </div>
            )}
            <div className={`${noPadding ? '' : 'p-6'}`}>
                {children}
            </div>
        </div>
    );
}
