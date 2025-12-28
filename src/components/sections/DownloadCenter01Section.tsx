'use client';

import { SectionProps } from '@/lib/sections/registry';

interface DownloadItem {
    title: string;
    description?: string;
    fileType?: string;
    fileSize?: string;
    downloadUrl: string;
}

export const DownloadCenter01Section: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, items = [] } = data;
    const { backgroundColor = '#ffffff', textColor = '#111827', accentColor = '#3b82f6' } = style;

    const defaultItems: DownloadItem[] = items.length > 0 ? items : [
        { title: '产品手册', description: '详细的产品功能说明和使用指南', fileType: 'PDF', fileSize: '2.5MB', downloadUrl: '#' },
        { title: '用户协议', description: '服务条款及隐私政策', fileType: 'PDF', fileSize: '1.2MB', downloadUrl: '#' },
        { title: '安装程序', description: 'Windows/Mac版本客户端下载', fileType: 'EXE', fileSize: '45MB', downloadUrl: '#' },
    ];

    const getFileIcon = (fileType?: string) => {
        const type = fileType?.toUpperCase();
        if (type === 'PDF') return '📄';
        if (type === 'DOC' || type === 'DOCX') return '📝';
        if (type === 'XLS' || type === 'XLSX') return '📊';
        if (type === 'EXE' || type === 'DMG') return '💿';
        if (type === 'ZIP' || type === 'RAR') return '📦';
        return '📎';
    };

    return (
        <section className="py-16" style={{ background: backgroundColor }}>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {(title || subtitle) && (
                        <div className="text-center mb-12">
                            {title && <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>{title}</h2>}
                            {subtitle && <p className="text-lg opacity-70" style={{ color: textColor }}>{subtitle}</p>}
                        </div>
                    )}
                    <div className="space-y-4">
                        {defaultItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: `${accentColor}15` }}>
                                        {getFileIcon(item.fileType)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold" style={{ color: textColor }}>{item.title}</h3>
                                        {item.description && <p className="text-sm opacity-60" style={{ color: textColor }}>{item.description}</p>}
                                        <div className="flex items-center gap-3 mt-1">
                                            {item.fileType && <span className="text-xs px-2 py-0.5 rounded-full bg-white" style={{ color: accentColor }}>{item.fileType}</span>}
                                            {item.fileSize && <span className="text-xs opacity-50" style={{ color: textColor }}>{item.fileSize}</span>}
                                        </div>
                                    </div>
                                </div>
                                <a href={item.downloadUrl} className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white transition-all hover:opacity-90" style={{ background: accentColor }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    下载
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
