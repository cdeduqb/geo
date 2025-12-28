import NodeRSA from 'node-rsa';
import * as fs from 'fs';
import * as path from 'path';

/**
 * RSA 加密工具类
 * 用于生成密钥对、加密、解密和签名验证
 */
export class RSACrypto {
    private static keySize = 2048; // RSA 密钥长度
    private static keysDir = path.join(process.cwd(), '.keys');

    /**
     * 生成 RSA 密钥对
     */
    static generateKeyPair(): { publicKey: string; privateKey: string } {
        const key = new NodeRSA({ b: this.keySize });

        return {
            publicKey: key.exportKey('public'),
            privateKey: key.exportKey('private')
        };
    }

    /**
     * 保存密钥对到文件
     */
    static saveKeyPair(publicKey: string, privateKey: string): void {
        if (!fs.existsSync(this.keysDir)) {
            fs.mkdirSync(this.keysDir, { recursive: true });
        }

        fs.writeFileSync(
            path.join(this.keysDir, 'public.pem'),
            publicKey,
            { mode: 0o600 }
        );

        fs.writeFileSync(
            path.join(this.keysDir, 'private.pem'),
            privateKey,
            { mode: 0o600 }
        );
    }

    /**
     * 从文件加载密钥对
     */
    static loadKeyPair(): { publicKey: string; privateKey: string } | null {
        const publicKeyPath = path.join(this.keysDir, 'public.pem');
        const privateKeyPath = path.join(this.keysDir, 'private.pem');

        if (!fs.existsSync(publicKeyPath) || !fs.existsSync(privateKeyPath)) {
            return null;
        }

        return {
            publicKey: fs.readFileSync(publicKeyPath, 'utf-8'),
            privateKey: fs.readFileSync(privateKeyPath, 'utf-8')
        };
    }

    /**
     * 获取或生成密钥对
     */
    static ensureKeyPair(): { publicKey: string; privateKey: string } {
        let keyPair = this.loadKeyPair();

        if (!keyPair) {
            keyPair = this.generateKeyPair();
            this.saveKeyPair(keyPair.publicKey, keyPair.privateKey);
        }

        return keyPair;
    }

    /**
     * 使用公钥加密数据
     */
    static encrypt(data: string, publicKey: string): string {
        const key = new NodeRSA(publicKey);
        return key.encrypt(data, 'base64');
    }

    /**
     * 使用私钥解密数据
     */
    static decrypt(encryptedData: string, privateKey: string): string {
        const key = new NodeRSA(privateKey);
        return key.decrypt(encryptedData, 'utf8');
    }

    /**
     * 使用私钥签名数据
     */
    static sign(data: string, privateKey: string): string {
        const key = new NodeRSA(privateKey);
        return key.sign(data, 'base64');
    }

    /**
     * 使用公钥验证签名
     */
    static verify(data: string, signature: string, publicKey: string): boolean {
        try {
            const key = new NodeRSA(publicKey);
            return key.verify(Buffer.from(data), signature, 'utf8', 'base64');
        } catch (error) {
            return false;
        }
    }

    /**
     * 签名授权数据
     */
    static signLicense(licenseData: object, privateKey: string): string {
        const dataString = JSON.stringify(licenseData);
        return this.sign(dataString, privateKey);
    }

    /**
     * 验证授权签名
     */
    static verifyLicense(licenseData: object, signature: string, publicKey: string): boolean {
        const dataString = JSON.stringify(licenseData);
        return this.verify(dataString, signature, publicKey);
    }
}

/**
 * 公钥（嵌入到客户端代码中）
 * 注意：实际部署时应该使用真实生成的密钥
 */
export const PUBLIC_KEY = process.env.LICENSE_PUBLIC_KEY || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyxJZNhLHM3Zs9KwJqn5h
fGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9xQUH3xNvqCHVJ
RqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLHM3Zs9KwJ
qn5hfGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9xQUH3xNvq
CHVJRqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLHM3Zs
9KwJqn5hfGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9xQUH3
xNvqCHVJRqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLH
M3Zs9KwJqn5hfGqVKd9xQUH3xNvqCHVJRqKJKhLHNhLHM3Zs9KwJqn5hfGqVKd9x
QIDAQAB
-----END PUBLIC KEY-----`;
