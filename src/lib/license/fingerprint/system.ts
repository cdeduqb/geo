import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 系统信息获取工具
 */
export class SystemInfo {
    /**
     * 获取操作系统类型
     */
    static getPlatform(): string {
        return os.platform();
    }

    /**
     * 获取操作系统版本
     */
    static getRelease(): string {
        return os.release();
    }

    /**
     * 获取系统架构
     */
    static getArch(): string {
        return os.arch();
    }

    /**
     * 获取机器ID（Linux/Mac特有）
     */
    static getMachineId(): string | null {
        try {
            const platform = this.getPlatform();

            if (platform === 'linux') {
                // Linux: /etc/machine-id 或 /var/lib/dbus/machine-id
                const paths = ['/etc/machine-id', '/var/lib/dbus/machine-id'];

                for (const filePath of paths) {
                    if (fs.existsSync(filePath)) {
                        return fs.readFileSync(filePath, 'utf-8').trim();
                    }
                }
            } else if (platform === 'darwin') {
                // macOS: 使用硬件UUID
                try {
                    const { execSync } = require('child_process');
                    const uuid = execSync('ioreg -rd1 -c IOPlatformExpertDevice | grep IOPlatformUUID')
                        .toString()
                        .split('"')[3];
                    return uuid;
                } catch (error) {
                    // Fallback
                }
            } else if (platform === 'win32') {
                // Windows: 使用注册表的MachineGuid
                try {
                    const { execSync } = require('child_process');
                    const guid = execSync('reg query HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography /v MachineGuid')
                        .toString()
                        .split('REG_SZ')[1]
                        .trim();
                    return guid;
                } catch (error) {
                    // Fallback
                }
            }
        } catch (error) {
            console.error('Failed to get machine ID:', error);
        }

        return null;
    }

    /**
     * 获取系统总内存（字节）
     */
    static getTotalMemory(): number {
        return os.totalmem();
    }

    /**
     * 获取用户主目录
     */
    static getHomeDir(): string {
        return os.homedir();
    }

    /**
     * 获取临时目录
     */
    static getTmpDir(): string {
        return os.tmpdir();
    }

    /**
     * 获取系统启动时间（秒）
     */
    static getUptime(): number {
        return os.uptime();
    }

    /**
     * 获取完整的系统信息
     */
    static getInfo(): {
        platform: string;
        release: string;
        arch: string;
        machineId: string | null;
        totalMemory: number;
        hostname: string;
    } {
        return {
            platform: this.getPlatform(),
            release: this.getRelease(),
            arch: this.getArch(),
            machineId: this.getMachineId(),
            totalMemory: this.getTotalMemory(),
            hostname: os.hostname()
        };
    }

    /**
     * 生成系统指纹组件
     */
    static generateFingerprint(): string {
        const info = this.getInfo();
        const machineId = info.machineId || 'unknown';

        // 使用平台、架构和机器ID
        return `${info.platform}:${info.arch}:${machineId}`;
    }

    /**
     * 检测是否运行在虚拟机中
     */
    static isVirtualMachine(): boolean {
        try {
            const platform = this.getPlatform();

            if (platform === 'linux') {
                // 检查 /proc/cpuinfo
                if (fs.existsSync('/proc/cpuinfo')) {
                    const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf-8').toLowerCase();
                    return cpuinfo.includes('hypervisor') ||
                        cpuinfo.includes('vmware') ||
                        cpuinfo.includes('virtualbox');
                }
            } else if (platform === 'darwin') {
                // macOS 检测
                const { execSync } = require('child_process');
                try {
                    const output = execSync('sysctl -n machdep.cpu.features').toString();
                    return output.includes('Hypervisor');
                } catch (error) {
                    // Cannot determine
                }
            }
        } catch (error) {
            // Cannot determine
        }

        return false;
    }

    /**
     * 检测是否运行在容器中（Docker等）
     */
    static isContainer(): boolean {
        try {
            // 检查 /.dockerenv
            if (fs.existsSync('/.dockerenv')) {
                return true;
            }

            // 检查 /proc/1/cgroup
            if (fs.existsSync('/proc/1/cgroup')) {
                const cgroup = fs.readFileSync('/proc/1/cgroup', 'utf-8');
                return cgroup.includes('docker') || cgroup.includes('kubepods');
            }
        } catch (error) {
            // Cannot determine
        }

        return false;
    }
}
