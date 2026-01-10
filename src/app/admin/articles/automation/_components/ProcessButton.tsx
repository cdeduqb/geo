'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

export function ProcessAutomationButton() {
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleProcess = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/articles/automation/process', {
                method: 'POST',
            });
            const data = await res.json();
            if (res.ok) {
                showToast('自动化任务触发成功！已开始后台处理。', 'success');
                // Optional: Trigger a refresh of the page data
                window.location.reload();
            } else {
                showToast('触发失败: ' + (data.error || res.statusText), 'error');
            }
        } catch (error) {
            console.error('Failed to trigger automation:', error);
            showToast('网络请求失败', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleProcess}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
            <Play size={16} className={loading ? 'animate-spin' : ''} />
            {loading ? '处理中...' : '立即执行待办任务'}
        </button>
    );
}
