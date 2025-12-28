# ==============================================================================
# 授权系统独立数据库配置
# ==============================================================================

# 授权数据库连接（独立数据库）
LICENSE_DATABASE_URL="mysql://cmssq:2awBTbS3fs6iHd8i@101.126.137.112:3306/cmssq"

# RSA 密钥配置（用于授权码签名）
# 注意：实际部署时请生成真实的密钥对
LICENSE_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----"
LICENSE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----"

# AES 加密密钥（用于本地缓存加密）
LICENSE_ENCRYPTION_KEY="your-32-character-encryption-key-here-0123456789"

# 授权服务器配置
LICENSE_SERVER_URL="https://license.geocms.com"
LICENSE_API_KEY="your-api-key-for-license-server"

# 心跳检测配置
LICENSE_HEARTBEAT_INTERVAL=3600000  # 1小时（毫秒）
LICENSE_HEARTBEAT_TIMEOUT=30000     # 30秒超时

# 离线宽限期配置
LICENSE_OFFLINE_GRACE_PERIOD=604800000  # 7天（毫秒）

# 授权验证缓存配置
LICENSE_CACHE_TTL=86400000  # 24小时（毫秒）

# 版权信息配置
DEFAULT_COPYRIGHT_COMPANY="GeoCMS Enterprise License"
DEFAULT_COPYRIGHT_URL="https://www.geocms.com"
DEFAULT_POWERED_BY_TEXT="Powered by GeoCMS"
