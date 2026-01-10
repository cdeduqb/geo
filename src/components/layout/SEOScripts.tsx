'use client';

import { useEffect, useState } from 'react';

interface SEOScript {
    platform: string;
    script: string | null;
}

// 清理脚本内容，移除可能包含的 <script> 标签
function cleanScriptContent(script: string): string {
    if (!script) return '';
    // 移除开头的 <script...> 标签
    let cleaned = script.replace(/^\s*<script[^>]*>/i, '');
    // 移除结尾的 </script> 标签
    cleaned = cleaned.replace(/<\/script>\s*$/i, '');
    return cleaned.trim();
}

export default function SEOScripts() {
    const [scripts, setScripts] = useState<SEOScript[]>([]);

    useEffect(() => {
        // 在客户端获取并执行脚本
        async function loadScripts() {
            try {
                const res = await fetch('/api/seo/scripts');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setScripts(data);
                    }
                }
            } catch (error) {
                console.error('Failed to load SEO scripts:', error);
            }
        }
        loadScripts();
    }, []);

    useEffect(() => {
        // 当脚本数据加载后，动态注入执行
        scripts.forEach((config) => {
            if (config.script) {
                const cleanedScript = cleanScriptContent(config.script);
                if (cleanedScript) {
                    try {
                        // 创建并执行脚本
                        const scriptElement = document.createElement('script');
                        scriptElement.id = `seo-script-${config.platform}`;
                        scriptElement.textContent = cleanedScript;
                        document.head.appendChild(scriptElement);
                    } catch (error) {
                        console.error(`Failed to execute SEO script for ${config.platform}:`, error);
                    }
                }
            }
        });

        // 清理函数：移除注入的脚本
        return () => {
            scripts.forEach((config) => {
                const existing = document.getElementById(`seo-script-${config.platform}`);
                if (existing) {
                    existing.remove();
                }
            });
        };
    }, [scripts]);

    // 不渲染任何内容，只在客户端注入脚本
    return null;
}
