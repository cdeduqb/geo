'use client';

import { useEffect, useRef } from 'react';

/**
 * License Ping 组件
 * 向授权服务器上报站点信息，用于商业授权管理
 * 
 * 优化策略：
 * - 每 24 小时最多 ping 一次（减少服务器压力）
 * - 使用 localStorage 持久化存储上次 ping 时间
 * - 延迟执行，避免阻塞首屏渲染
 */

// Ping 间隔时间（毫秒）- 24小时
const PING_INTERVAL = 24 * 60 * 60 * 1000;
// localStorage 键名
const LAST_PING_KEY = 'license-last-ping-time';

export default function LicensePing() {
    const hasPinged = useRef(false);

    useEffect(() => {
        // 确保只执行一次检查
        if (hasPinged.current) return;
        hasPinged.current = true;

        // 检查是否需要 ping
        const shouldPing = (): boolean => {
            if (typeof window === 'undefined') return false;

            try {
                const lastPingStr = localStorage.getItem(LAST_PING_KEY);
                if (!lastPingStr) return true; // 从未 ping 过

                const lastPingTime = parseInt(lastPingStr, 10);
                const now = Date.now();

                // 如果距离上次 ping 超过 24 小时，则需要 ping
                return (now - lastPingTime) > PING_INTERVAL;
            } catch (e) {
                // localStorage 访问失败时，跳过 ping
                return false;
            }
        };

        if (!shouldPing()) {
            return; // 不需要 ping，直接返回
        }

        const pingLicense = async () => {
            try {
                const response = await fetch('/api/license/ping', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    // 记录本次 ping 时间
                    localStorage.setItem(LAST_PING_KEY, Date.now().toString());
                }
            } catch (e) {
                // 静默处理，不影响用户体验
            }
        };

        // 延迟 5 秒执行，避免阻塞首屏渲染和其他重要请求
        const timer = setTimeout(pingLicense, 5000);

        return () => clearTimeout(timer);
    }, []);

    // 不渲染任何内容
    return null;
}
