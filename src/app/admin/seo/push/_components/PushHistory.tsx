'use client';

import { formatDate } from '@/lib/utils';
import { CheckCircle, XCircle, ExternalLink } from 'lucide-react';

interface PushLog {
    id: string;
    url: string;
    status: string;
    response: string | null;
    createdAt: Date;
    config: {
        platform: string;
    };
}

interface PushHistoryProps {
    logs: PushLog[];
}

export default function PushHistory({ logs }: PushHistoryProps) {
    if (logs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-gray-400 font-bold">暂无推送记录</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            平台
                        </th>
                        <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            推送地址
                        </th>
                        <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            状态
                        </th>
                        <th className="text-left py-4 px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                            时间
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {logs.map((log) => (
                        <tr key={log.id} className="group hover:bg-blue-50/30 transition-all">
                            <td className="py-4 px-4">
                                <span className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg font-black">
                                    {log.config.platform}
                                </span>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2 max-w-md">
                                    <span className="text-sm text-gray-600 font-medium truncate">
                                        {log.url.split(',').length > 1
                                            ? `${log.url.split(',').length} 篇文章`
                                            : log.url}
                                    </span>
                                    {log.url.split(',').length === 1 && (
                                        <a
                                            href={log.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="space-y-1.5">
                                    {log.status === 'success' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-50 text-green-600 rounded-lg font-black">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            成功
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-red-50 text-red-600 rounded-lg font-black">
                                            <XCircle className="w-3.5 h-3.5" />
                                            失败
                                        </span>
                                    )}
                                    {log.response && (
                                        <div className="text-[10px] text-gray-400 font-mono truncate max-w-[180px] bg-gray-50 px-2 py-1 rounded" title={log.response}>
                                            {log.response}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-xs text-gray-500 font-mono font-bold">
                                {formatDate(log.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
