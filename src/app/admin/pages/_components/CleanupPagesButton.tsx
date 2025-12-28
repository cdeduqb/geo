'use client';

import { useState } from 'react';
import { Trash2, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

export default function CleanupPagesButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { showToast } = useToast();

    const handleCleanup = async () => {
        if (!confirm('确定要清除所有系统生成的临时页面吗？此操作不可撤销。')) {
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/pages/cleanup', {
                method: 'POST',
            });
            const data = await res.json();
            if (data.success) {
                showToast(`成功清除 ${data.deletedCount} 个临时页面`, 'success');
                router.refresh();
            } else {
                throw new Error(data.error || '清除失败');
            }
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCleanup}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
            title="清除 temp- 前缀的临时页面"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4 mr-2" />
            )}
            一键清理临时页面
        </button>
    );
}
