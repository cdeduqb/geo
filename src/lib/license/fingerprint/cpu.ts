import * as os from 'os';

/**
 * CPU 信息获取工具
 */
export class CPUInfo {
    /**
     * 获取 CPU 型号
     */
    static getModel(): string {
        const cpus = os.cpus();
        return cpus.length > 0 ? cpus[0].model : 'unknown';
    }

    /**
     * 获取 CPU 核心数
     */
    static getCoreCount(): number {
        return os.cpus().length;
    }

    /**
     * 获取 CPU 速度
     */
    static getSpeed(): number {
        const cpus = os.cpus();
        return cpus.length > 0 ? cpus[0].speed : 0;
    }

    /**
     * 获取 CPU 架构
     */
    static getArchitecture(): string {
        return os.arch();
    }

    /**
     * 获取完整的 CPU 信息
     */
    static getInfo(): {
        model: string;
        cores: number;
        speed: number;
        architecture: string;
    } {
        return {
            model: this.getModel(),
            cores: this.getCoreCount(),
            speed: this.getSpeed(),
            architecture: this.getArchitecture()
        };
    }

    /**
     * 生成 CPU 指纹组件
     */
    static generateFingerprint(): string {
        const info = this.getInfo();
        // 使用型号和架构作为指纹组件（核心数和速度可能变化）
        return `${info.model}:${info.architecture}`;
    }
}
