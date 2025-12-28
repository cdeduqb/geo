import * as fs from 'fs';
import * as path from 'path';

/**
 * 时间戳防护服务
 * 防止系统时间回拨攻击
 */
export class TimestampProtection {
    private static readonly TIMESTAMP_FILE = path.join(process.cwd(), '.license-cache', 'timestamp.dat');
    private static readonly MAX_TIME_DIFF = 600000; // 10分钟容差

    /**
     * 检查时间是否被篡改
     */
    static async checkTimeTampering(): Promise<{
        tampering: boolean;
        reason?: string;
        serverTime?: number;
        localTime: number;
    }> {
        const localTime = Date.now();
        const result = {
            tampering: false,
            localTime
        };

        // 1. 检查时间回拨
        const lastTime = this.getLastTimestamp();
        if (lastTime && localTime < lastTime - 300000) { // 5分钟容差
            return {
                ...result,
                tampering: true,
                reason: '检测到系统时间回拨'
            };
        }

        // 2. 检查与服务器时间差异
        try {
            const serverTime = await this.getServerTime();
            const diff = Math.abs(serverTime - localTime);

            if (diff > this.MAX_TIME_DIFF) {
                return {
                    ...result,
                    tampering: true,
                    reason: `系统时间与服务器相差${Math.floor(diff / 60000)}分钟`,
                    serverTime
                };
            }
        } catch (error) {
            // 无法连接服务器，跳过服务器时间检查
        }

        // 保存当前时间戳
        this.saveTimestamp(localTime);

        return result;
    }

    /**
     * 获取上次保存的时间戳
     */
    private static getLastTimestamp(): number | null {
        try {
            if (fs.existsSync(this.TIMESTAMP_FILE)) {
                const content = fs.readFileSync(this.TIMESTAMP_FILE, 'utf-8');
                return parseInt(content);
            }
        } catch (error) {
            // Ignore
        }
        return null;
    }

    /**
     * 保存当前时间戳
     */
    private static saveTimestamp(timestamp: number): void {
        try {
            const dir = path.dirname(this.TIMESTAMP_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
            }
            fs.writeFileSync(this.TIMESTAMP_FILE, timestamp.toString(), { mode: 0o600 });
        } catch (error) {
            console.error('保存时间戳失败:', error);
        }
    }

    /**
     * 获取服务器时间
     */
    private static async getServerTime(): Promise<number> {
        const serverUrl = process.env.LICENSE_SERVER_URL || 'https://sq.moli123.com';

        const response = await fetch(`${serverUrl}/api/time`, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
        });

        if (!response.ok) {
            throw new Error('无法获取服务器时间');
        }

        const data = await response.json();
        return data.timestamp;
    }

    /**
     * 同步服务器时间
     */
    static async syncServerTime(): Promise<number> {
        try {
            const serverTime = await this.getServerTime();
            this.saveTimestamp(serverTime);
            return serverTime;
        } catch (error) {
            return Date.now();
        }
    }

    /**
     * 清除时间戳记录
     */
    static clear(): void {
        try {
            if (fs.existsSync(this.TIMESTAMP_FILE)) {
                fs.unlinkSync(this.TIMESTAMP_FILE);
            }
        } catch (error) {
            // Ignore
        }
    }
}
