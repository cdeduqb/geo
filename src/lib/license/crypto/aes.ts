import CryptoJS from 'crypto-js';

/**
 * AES 加密工具类
 * 用于对称加密，主要用于本地缓存数据加密
 */
export class AESCrypto {
    private static readonly ALGORITHM = 'AES';
    private static readonly KEY_SIZE = 256; // AES-256

    /**
     * 生成加密密钥
     */
    static generateKey(): string {
        return CryptoJS.lib.WordArray.random(this.KEY_SIZE / 8).toString();
    }

    /**
     * 获取或生成应用密钥
     * 注意：实际部署时应该从环境变量读取
     */
    static getAppKey(): string {
        // 使用固定的默认密钥以确保缓存可以正确解密
        const baseKey = process.env.LICENSE_ENCRYPTION_KEY || 'geocms-license-default-encryption-key-2024';
        // 绑定到运行目录，防止缓存文件被直接拷贝到其他未授权站点目录使用
        return `${baseKey}@${process.cwd()}`;
    }

    /**
     * 加密数据
     * @param data 要加密的数据（字符串或对象）
     * @param key 加密密钥（可选，默认使用应用密钥）
     * @returns 加密后的字符串
     */
    static encrypt(data: string | object, key?: string): string {
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        const encryptionKey = key || this.getAppKey();

        const encrypted = CryptoJS.AES.encrypt(dataString, encryptionKey);
        return encrypted.toString();
    }

    /**
     * 解密数据
     * @param encryptedData 加密的数据
     * @param key 解密密钥（可选，默认使用应用密钥）
     * @returns 解密后的字符串
     */
    static decrypt(encryptedData: string, key?: string): string {
        const encryptionKey = key || this.getAppKey();

        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            throw new Error('解密失败：数据可能已损坏或密钥错误');
        }
    }

    /**
     * 加密对象并返回
     * @param obj 要加密的对象
     * @param key 加密密钥
     * @returns 加密后的对象（可以安全JSON序列化）
     */
    static encryptObject<T extends string | object>(obj: T, key?: string): { encrypted: string; timestamp: number } {
        return {
            encrypted: this.encrypt(obj, key),
            timestamp: Date.now()
        };
    }

    /**
     * 解密对象
     * @param encryptedObj 加密的对象
     * @param key 解密密钥
     * @returns 解密后的原始对象
     */
    static decryptObject<T>(encryptedObj: { encrypted: string; timestamp: number }, key?: string): T {
        const decryptedString = this.decrypt(encryptedObj.encrypted, key);
        return JSON.parse(decryptedString);
    }

    /**
     * 加密授权缓存
     */
    static encryptLicenseCache(licenseData: any): string {
        const cacheData = {
            data: licenseData,
            cachedAt: Date.now(),
            version: '1.0'
        };

        return this.encrypt(cacheData);
    }

    /**
     * 解密授权缓存
     */
    static decryptLicenseCache(encryptedCache: string): any {
        try {
            const decrypted = this.decrypt(encryptedCache);
            const cacheData = JSON.parse(decrypted);

            // 验证缓存格式
            if (!cacheData.data || !cacheData.cachedAt) {
                throw new Error('Invalid cache format');
            }

            return cacheData;
        } catch (error) {
            throw new Error('授权缓存解密失败');
        }
    }

    /**
     * 使用密码加密数据（PBKDF2密钥派生）
     * @param data 要加密的数据
     * @param password 密码
     * @param salt 盐值（可选）
     */
    static encryptWithPassword(data: string | object, password: string, salt?: string): {
        encrypted: string;
        salt: string;
    } {
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        const saltValue = salt || CryptoJS.lib.WordArray.random(128 / 8).toString();

        // 使用 PBKDF2 派生密钥
        const key = CryptoJS.PBKDF2(password, saltValue, {
            keySize: 256 / 32,
            iterations: 1000
        });

        const encrypted = CryptoJS.AES.encrypt(dataString, key.toString());

        return {
            encrypted: encrypted.toString(),
            salt: saltValue
        };
    }

    /**
     * 使用密码解密数据
     * @param encryptedData 加密的数据
     * @param password 密码
     * @param salt 盐值
     */
    static decryptWithPassword(encryptedData: string, password: string, salt: string): string {
        // 使用相同的参数派生密钥
        const key = CryptoJS.PBKDF2(password, salt, {
            keySize: 256 / 32,
            iterations: 1000
        });

        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString());
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            throw new Error('密码解密失败');
        }
    }
}
