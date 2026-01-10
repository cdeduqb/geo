
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Terminal } from 'lucide-react';

export default function LogsPage() {
    const [logs, setLogs] = useState<string>('正在加载日志...');
    const [loading, setLoading] = useState(false);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/system/logs');
            const data = await res.json();
            if (data.content) {
                setLogs(data.content);
            } else if (data.error) {
                setLogs(`Error: ${data.error}`);
            }
        } catch (error) {
            setLogs('Failed to fetch logs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">系统日志</h2>
                    <p className="text-slate-500 mt-1">查看系统更新与运行日志</p>
                </div>
                <Button onClick={fetchLogs} disabled={loading} className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    刷新日志
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-slate-500" />
                        <div>
                            <CardTitle className="text-base font-bold text-slate-900">update.log</CardTitle>
                            <CardDescription>最近的更新操作记录</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <pre className="p-4 bg-[#1e1e1e] text-green-400 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap min-h-[400px] max-h-[600px] overflow-y-auto rounded-b-xl">
                        {logs}
                    </pre>
                </CardContent>
            </Card>
        </div>
    );
}
