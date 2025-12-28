import { CPUInfo } from './cpu';
import { NetworkInfo } from './network';
import { SystemInfo } from './system';
import { HashUtils } from '../crypto/hash';

/**
 * 硬件指纹生成器
 * 整合CPU、网络、系统信息生成唯一设备标识
 */
export class FingerprintGenerator {
    /**
     * 生成完整的硬件指纹
     */
    static async generate(): Promise<string> {
        const components = await this.collectComponents();
        const fingerprint = this.combineComponents(components);
        return HashUtils.sha256(fingerprint);
    }

    /**
     * 收集所有指纹组件
     */
    private static async collectComponents(): Promise<{
        cpu: string;
        network: string;
        system: string;
        timestamp: number;
    }> {
        return {
            cpu: CPUInfo.generateFingerprint(),
            network: NetworkInfo.generateFingerprint(),
            system: SystemInfo.generateFingerprint(),
            timestamp: Date.now()
        };
    }

    /**
     * 组合所有组件为字符串
     */
    private static combineComponents(components: {
        cpu: string;
        network: string;
        system: string;
        timestamp: number;
    }): string {
        return `${components.cpu}|${components.network}|${components.system}`;
    }

    /**
     * 获取详细的设备信息（用于调试和日志）
     */
    static async getDeviceInfo(): Promise<{
        fingerprint: string;
        cpu: ReturnType<typeof CPUInfo.getInfo>;
        network: ReturnType<typeof NetworkInfo.getInfo>;
        system: ReturnType<typeof SystemInfo.getInfo>;
        isVirtualMachine: boolean;
        isContainer: boolean;
        generatedAt: number;
    }> {
        const fingerprint = await this.generate();

        return {
            fingerprint,
            cpu: CPUInfo.getInfo(),
            network: NetworkInfo.getInfo(),
            system: SystemInfo.getInfo(),
            isVirtualMachine: SystemInfo.isVirtualMachine(),
            isContainer: SystemInfo.isContainer(),
            generatedAt: Date.now()
        };
    }

    /**
     * 验证指纹是否匹配
     */
    static async verify(expectedFingerprint: string): Promise<boolean> {
        const currentFingerprint = await this.generate();
        return currentFingerprint === expectedFingerprint;
    }

    /**
     * 生成短指纹（用于显示）
     */
    static async generateShort(length: number = 12): Promise<string> {
        const fullFingerprint = await this.generate();
        return fullFingerprint.substring(0, length);
    }

    /**
     * 生成带版本的指纹（防止指纹算法升级导致的不兼容）
     */
    static async generateVersioned(): Promise<{
        version: string;
        fingerprint: string;
        algorithm: string;
    }> {
        const fingerprint = await this.generate();

        return {
            version: '1.0',
            fingerprint,
            algorithm: 'sha256'
        };
    }

    /**
     * 检查环境变化
     * 返回变化的组件列表
     */
    static async detectChanges(previousFingerprint: string): Promise<{
        changed: boolean;
        changedComponents: string[];
        currentFingerprint: string;
    }> {
        const currentFingerprint = await this.generate();
        const changed = currentFingerprint !== previousFingerprint;

        if (!changed) {
            return {
                changed: false,
                changedComponents: [],
                currentFingerprint
            };
        }

        // 检测哪些组件发生了变化
        const changedComponents: string[] = [];
        const components = await this.collectComponents();

        // 简化的变化检测（实际应该比较之前保存的组件）
        if (SystemInfo.isContainer()) {
            changedComponents.push('运行环境变为容器');
        }

        if (SystemInfo.isVirtualMachine()) {
            changedComponents.push('运行环境变为虚拟机');
        }

        return {
            changed: true,
            changedComponents,
            currentFingerprint
        };
    }

    /**
     * 导出指纹信息（用于授权绑定）
     */
    static async exportForBinding(): Promise<{
        fingerprint: string;
        shortFingerprint: string;
        deviceInfo: {
            platform: string;
            hostname: string;
            cpuModel: string;
            macAddress: string;
        };
        metadata: {
            generatedAt: string;
            expiresAt: string;
        };
    }> {
        const fingerprint = await this.generate();
        const shortFingerprint = fingerprint.substring(0, 12);
        const deviceInfo = await this.getDeviceInfo();

        const now = new Date();
        const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15分钟有效期

        return {
            fingerprint,
            shortFingerprint,
            deviceInfo: {
                platform: deviceInfo.system.platform,
                hostname: deviceInfo.network.hostname,
                cpuModel: deviceInfo.cpu.model,
                macAddress: deviceInfo.network.primaryMac
            },
            metadata: {
                generatedAt: now.toISOString(),
                expiresAt: expiresAt.toISOString()
            }
        };
    }
}
