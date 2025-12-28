import * as os from 'os';

/**
 * 网络信息获取工具
 */
export class NetworkInfo {
    /**
     * 获取所有网络接口
     */
    static getInterfaces(): NodeJS.Dict<os.NetworkInterfaceInfo[]> {
        return os.networkInterfaces();
    }

    /**
     * 获取MAC地址列表
     */
    static getMacAddresses(): string[] {
        const interfaces = this.getInterfaces();
        const macAddresses: string[] = [];

        for (const name in interfaces) {
            const nets = interfaces[name];
            if (!nets) continue;

            for (const net of nets) {
                // 跳过内部接口和虚拟接口
                if (net.internal || !net.mac || net.mac === '00:00:00:00:00:00') {
                    continue;
                }

                if (!macAddresses.includes(net.mac)) {
                    macAddresses.push(net.mac);
                }
            }
        }

        return macAddresses.sort(); // 排序确保一致性
    }

    /**
     * 获取主MAC地址（最稳定的网络接口）
     */
    static getPrimaryMac(): string {
        const macs = this.getMacAddresses();

        // 优先选择有线网卡（通常以 eth 或 en 开头）
        const interfaces = this.getInterfaces();
        const preferredNames = ['eth0', 'en0', 'ens', 'enp'];

        for (const preferredName of preferredNames) {
            for (const name in interfaces) {
                if (name.startsWith(preferredName)) {
                    const nets = interfaces[name];
                    if (!nets) continue;

                    for (const net of nets) {
                        if (!net.internal && net.mac && net.mac !== '00:00:00:00:00:00') {
                            return net.mac;
                        }
                    }
                }
            }
        }

        // 如果没有找到首选网卡，返回第一个有效MAC
        return macs.length > 0 ? macs[0] : 'unknown';
    }

    /**
     * 获取主机名
     */
    static getHostname(): string {
        return os.hostname();
    }

    /**
     * 获取网络信息
     */
    static getInfo(): {
        hostname: string;
        primaryMac: string;
        allMacs: string[];
    } {
        return {
            hostname: this.getHostname(),
            primaryMac: this.getPrimaryMac(),
            allMacs: this.getMacAddresses()
        };
    }

    /**
     * 生成网络指纹组件
     */
    static generateFingerprint(): string {
        const info = this.getInfo();
        // 使用主MAC地址和主机名
        return `${info.primaryMac}:${info.hostname}`;
    }
}
