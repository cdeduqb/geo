import { HeartbeatData, HeartbeatResponse } from '../types';
import { FingerprintGenerator } from '../fingerprint/generator';
import { LicenseCache } from './cache';

/**
 * 心跳检测服务
 * 定期向授权服务器报告状态
 */
export class HeartbeatService {
    private static instance: HeartbeatService;
    private intervalId?: NodeJS.Timeout;
    private readonly serverUrl: string;
    private readonly interval: number;
    private isRunning: boolean = false;

    private constructor() {
        const { LICENSE_CONFIG } = require('../config');
        this.serverUrl = LICENSE_CONFIG.SERVER_URL;
        this.interval = parseInt(process.env.LICENSE_HEARTBEAT_INTERVAL || '3600000'); // 1小时
    }

    /**
     * 获取单例实例
     */
    static getInstance(): HeartbeatService {
        if (!this.instance) {
            this.instance = new HeartbeatService();
        }
        return this.instance;
    }

    /**
     * 启动心跳检测
     */
    start(licenseId: string): void {
        // 安全检查：在 Next.js API 路由和 Serverless 环境中禁用心跳
        // 这可以防止内存泄漏和服务器崩溃
        if (typeof window !== 'undefined') {
            console.warn('心跳服务不应在客户端运行');
            return;
        }

        // 检查是否在 Vercel/Serverless 环境
        if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.FUNCTION_NAME) {
            console.log('检测到 Serverless 环境，跳过心跳服务启动');
            return;
        }

        // 检查是否已经在运行
        if (this.isRunning) {
            console.warn('心跳服务已在运行中');
            return;
        }

        console.log(`启动心跳服务，间隔：${this.interval}ms`);
        this.isRunning = true;

        // 立即发送一次
        this.sendHeartbeat(licenseId).catch(err => {
            console.error('初始心跳发送失败:', err);
        });

        // 定期发送
        this.intervalId = setInterval(() => {
            this.sendHeartbeat(licenseId).catch(err => {
                console.error('定时心跳发送失败:', err);
            });
        }, this.interval);

        // 注册清理函数（process 退出时）
        if (process && typeof process.on === 'function') {
            process.on('beforeExit', () => {
                this.stop();
            });
            process.on('SIGTERM', () => {
                this.stop();
            });
            process.on('SIGINT', () => {
                this.stop();
            });
        }
    }

    /**
     * 停止心跳检测
     */
    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
        this.isRunning = false;
        console.log('心跳服务已停止');
    }

    /**
     * 发送心跳
     */
    private async sendHeartbeat(licenseId: string): Promise<void> {
        try {
            const heartbeatData = await this.collectHeartbeatData(licenseId);
            const response = await this.sendToServer(heartbeatData);

            if (response.success) {
                // 更新最后验证时间
                LicenseCache.updateLastVerified();

                // 检查是否需要重新验证
                if (response.shouldRevalidate) {
                    console.warn('服务器要求重新验证授权');
                    // 触发重新验证...
                }
            } else {
                console.error('心跳发送失败:', response.message);
            }
        } catch (error) {
            console.error('心跳发送异常:', error);
            // 设置离线宽限期
            LicenseCache.setOfflineGracePeriod();
        }
    }

    /**
     * 收集心跳数据
     */
    private async collectHeartbeatData(licenseId: string): Promise<HeartbeatData> {
        const fingerprint = await FingerprintGenerator.generate();
        const deviceInfo = await FingerprintGenerator.getDeviceInfo();

        return {
            licenseId,
            fingerprint,
            domain: process.env.NEXT_PUBLIC_SITE_URL,
            platform: deviceInfo.system.platform,
            version: process.env.npm_package_version || '1.0.0',
            timestamp: Date.now()
        };
    }

    /**
     * 发送到服务器
     */
    private async sendToServer(data: HeartbeatData): Promise<HeartbeatResponse> {
        const timeout = parseInt(process.env.LICENSE_HEARTBEAT_TIMEOUT || '30000');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(`${this.serverUrl}/api/license/heartbeat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-License-Version': '1.0'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if ((error as Error).name === 'AbortError') {
                throw new Error('心跳请求超时');
            }
            throw error;
        }
    }

    /**
     * 手动发送一次心跳
     */
    async sendOnce(licenseId: string): Promise<HeartbeatResponse> {
        const data = await this.collectHeartbeatData(licenseId);
        return await this.sendToServer(data);
    }

    /**
     * 检查服务器连接
     */
    async checkConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.serverUrl}/api/health`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取服务器时间
     */
    async getServerTime(): Promise<number> {
        try {
            const response = await fetch(`${this.serverUrl}/api/time`, {
                method: 'GET',
                signal: AbortSignal.timeout(5000)
            });

            if (response.ok) {
                const data = await response.json();
                return data.timestamp;
            }
        } catch (error) {
            // Fallback to local time
        }

        return Date.now();
    }
}
