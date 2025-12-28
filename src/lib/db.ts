import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// 基础 Prisma 实例
const client = globalForPrisma.prisma ?? new PrismaClient({
    log: ["error", "warn"],
    // 连接池配置 - 防止连接耗尽导致服务器崩溃
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// 设置连接池限制（通过环境变量）
// 建议在 .env 中添加：
// DATABASE_URL="mysql://user:pass@host:3306/db?connection_limit=10&pool_timeout=20"

// 通用数据库连接熔断器
// 目的：在构建或运行时，如果数据库无法连接，不让整个应用崩溃，而是返回空数据
export const db = new Proxy(client, {
    get(target, prop, receiver) {
        const original = Reflect.get(target, prop, receiver);

        // 如果是访问数据库模型（如 db.page, db.user 等）
        if (typeof original === 'object' && original !== null) {
            return new Proxy(original, {
                get(modelTarget, modelProp) {
                    const method = Reflect.get(modelTarget, modelProp);
                    if (typeof method === 'function') {
                        return async (...args: any[]) => {
                            try {
                                return await method.apply(modelTarget, args);
                            } catch (error: any) {
                                // 检查是否为物理连接相关错误或结构不匹配错误
                                const errorMsg = error.message || '';
                                const isConnectionError =
                                    error.name === 'PrismaClientInitializationError' ||
                                    errorMsg.includes('Can\'t reach database server') ||
                                    errorMsg.includes('Server has closed the connection') ||
                                    errorMsg.includes('Connection refused') ||
                                    error.code === 'P1001' || // Can't reach database
                                    error.code === 'P1017' || // Server has closed the connection
                                    error.code === 'P2024';   // Connection timed out

                                const isSchemaMismatch =
                                    error.code === 'P2021' || // Table does not exist
                                    error.code === 'P2022' || // Column does not exist
                                    errorMsg.includes('does not exist in the current database');

                                if (isConnectionError || isSchemaMismatch) {
                                    const errorType = isConnectionError ? 'Connectivity' : 'Schema Mismatch';
                                    console.warn(`[DB Shield] ${errorType} issue on ${String(prop)}.${String(modelProp)}. Bypassing with fallback data.`);

                                    // 根据常见的查询方法返回合理的空值（降级方案）
                                    const methodName = String(modelProp);
                                    if (methodName.startsWith('findMany')) return [];
                                    if (methodName.startsWith('findFirst') || methodName.startsWith('findUnique')) return null;
                                    if (methodName.startsWith('count')) return 0;
                                    return null;
                                }
                                throw error;
                            }
                        };
                    }
                    return method;
                }
            });
        }
        return original;
    }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
