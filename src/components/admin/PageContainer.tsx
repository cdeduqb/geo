'use client';

import { ReactNode } from 'react';
import { useAdminLayout } from '@/app/admin/_components/layout/AdminLayoutContext';

interface PageContainerProps {
    children: ReactNode;
    title?: string;
    description?: string;
    extra?: ReactNode;
    className?: string;
}

export default function PageContainer({
    children,
    title,
    description,
    extra,
    className = ''
}: PageContainerProps) {
    const { layoutType } = useAdminLayout();

    // 根据不同布局定义页头的边距和分隔线
    const headerWrapperStyleMap: any = {
        'classic': 'mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        'ant-dark': 'mb-5 pb-4 border-b border-[#f0f0f0] flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        'vercel-top': 'mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4',
        'macos-glass': 'mb-6 pb-4 border-b border-white/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4',
        'cyber-dark': 'mb-6 pb-4 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4'
    };

    const titleStyleMap: any = {
        'classic': 'text-2xl font-bold text-gray-900 tracking-tight',
        'ant-dark': 'text-[20px] font-semibold text-[#000000e0]',
        'vercel-top': 'text-3xl font-bold text-black tracking-tighter',
        'macos-glass': 'text-[22px] font-bold text-gray-800 drop-shadow-sm',
        'cyber-dark': 'text-[22px] font-semibold text-neutral-200 tracking-wide'
    };

    const descStyleMap: any = {
        'classic': 'mt-1 text-sm text-gray-500 font-medium',
        'ant-dark': 'mt-2 text-[14px] text-gray-500',
        'vercel-top': 'mt-2 text-[15px] text-gray-500 tracking-tight',
        'macos-glass': 'mt-1 text-[13px] text-gray-600 font-medium drop-shadow-sm',
        'cyber-dark': 'mt-1 text-[13px] text-neutral-500'
    };

    return (
        <div className={`w-full h-full flex flex-col ${className}`}>
            {(title || extra) && (
                <div className={`${headerWrapperStyleMap[layoutType]}`}>
                    <div>
                        {title && <h1 className={`${titleStyleMap[layoutType]}`}>{title}</h1>}
                        {description && <p className={`${descStyleMap[layoutType]}`}>{description}</p>}
                    </div>
                    {extra && (
                        <div className="flex items-center gap-3">
                            {extra}
                        </div>
                    )}
                </div>
            )}
            <div className="flex-1 w-full relative">
                {children}
            </div>
        </div>
    );
}
