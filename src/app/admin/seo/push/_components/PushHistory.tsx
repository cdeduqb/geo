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
            <div className="text-center py-8 text-gray-500">
                暂无推送记录
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="border-b border-gray-200">
                    <tr>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                            平台
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                            URL
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                            状态
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                            时间
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4">
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium">
                                    {log.config.platform}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2 max-w-md">
                                    <span className="text-sm text-gray-600 truncate">
                                        {log.url.split(',').length > 1
                                            ? `${log.url.split(',').length} 篇文章`
                                            : log.url}
                                    </span>
                                    {log.url.split(',').length === 1 && (
                                        <a
                                            href={log.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-400 hover:text-blue-600"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                {log.status === 'success' ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded font-medium">
                                        <CheckCircle className="w-3 h-3" />
                                        成功
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-red-100 text-red-700 rounded font-medium">
                                        <XCircle className="w-3 h-3" />
                                        失败
                                    </span>
                                )}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-500 font-mono">
                                {formatDate(log.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
