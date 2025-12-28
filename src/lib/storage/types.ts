/**
 * 存储提供商抽象接口
 */
export interface StorageProvider {
    /**
     * 上传文件
     * @param buffer 文件buffer
     * @param key 存储路径/key
     * @param mimeType 文件MIME类型
     * @returns 上传结果，包含URL和key
     */
    upload(buffer: Buffer, key: string, mimeType: string): Promise<{ url: string; key: string }>;

    /**
     * 删除文件
     * @param key 存储路径/key
     */
    delete(key: string): Promise<void>;

    /**
     * 获取文件访问URL
     * @param key 存储路径/key
     * @returns 文件访问URL
     */
    getUrl(key: string): Promise<string>;

    /**
     * 检查文件是否存在
     * @param key 存储路径/key
     */
    exists(key: string): Promise<boolean>;
}

/**
 * 存储配置接口
 */
export interface StorageConfig {
    provider: 'LOCAL' | 'ALIYUN_OSS' | 'TENCENT_COS';
    config: Record<string, any>;
}

/**
 * 上传结果接口
 */
export interface UploadResult {
    url: string;
    key: string;
    size: number;
    mimeType: string;
}
