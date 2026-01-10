/**
 * 授权系统内部配置
 * 为了安全起见，不建议在 .env 中暴露授权服务器地址
 */

// 混淆后的地址: https://sq.moli123.com
// 使用 Base64 编码以防止明文搜索
const ENCODED_URL = 'aHR0cHM6Ly9zcS5tb2xpMTIzLmNvbQ==';

/**
 * 获取授权服务器根地址
 */
export const getInternalServerUrl = () => {
    try {
        if (typeof window !== 'undefined') {
            return atob(ENCODED_URL);
        }
        return Buffer.from(ENCODED_URL, 'base64').toString();
    } catch (e) {
        return 'https://sq.moli123.com'; // 回退值
    }
};

export const LICENSE_CONFIG = {
    SERVER_URL: getInternalServerUrl(),
    VERSION: '1.0.0',
};
