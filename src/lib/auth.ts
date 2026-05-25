import { db } from './db';
import { User } from '@prisma/client';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

// bcrypt 配置
const SALT_ROUNDS = 12;

/**
 * 使用 bcrypt 对密码进行安全哈希
 * bcrypt 自动处理盐值生成和存储
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 验证密码是否匹配
 * 同时支持 bcrypt 哈希和旧版 SHA256 哈希（向后兼容）
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    // bcrypt 哈希以 $2a$, $2b$ 或 $2y$ 开头
    if (hashedPassword.startsWith('$2')) {
        return bcrypt.compare(password, hashedPassword);
    }

    // 向后兼容：支持旧版 SHA256 哈希
    const crypto = await import('crypto');
    const sha256Hash = crypto.createHash('sha256').update(password).digest('hex');
    return sha256Hash === hashedPassword;
}

// 创建会话
export async function createSession(userId: string) {
    const sessionToken = generateSessionToken(userId);
    const cookieStore = await cookies();

    // 从环境变量获取会话时效，默认为 24 小时
    const maxAge = parseInt(process.env.SESSION_MAX_AGE || '86400', 10);

    cookieStore.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: maxAge,
        path: '/',
    });

    return sessionToken;
}

// 获取当前用户
export async function getCurrentUser(): Promise<User | null> {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session')?.value;

        if (!sessionToken) {
            return null;
        }

        // 从session token中提取用户ID
        const userId = sessionToken.split(':')[0];

        // 紧急避灾逻辑：如果是虚拟管理员 ID（仅开发环境）
        if (process.env.NODE_ENV !== 'production' && userId === 'dev-admin-id') {
            const realAdmin = await db.user.findFirst({
                where: { role: 'ADMIN' }
            });

            return {
                id: realAdmin?.id || 'dev-admin-id',
                email: 'admin@example.com',
                password: '',
                name: realAdmin?.name || '虚拟管理员(应急模式)',
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as User;
        }

        const user = await db.user.findUnique({
            where: { id: userId },
        });

        return user;
    } catch (error) {
        console.error('获取当前用户失败:', error);
        return null;
    }
}

// 注销
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

// 检查权限：要求登录
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    return user;
}

// 检查权限：要求管理员
export async function requireAdmin(): Promise<User> {
    const user = await requireAuth();

    if (user.role !== 'ADMIN') {
        throw new Error('需要管理员权限');
    }

    return user;
}

// 生成session token
function generateSessionToken(userId: string): string {
    const crypto = require('crypto');
    const randomBytes = crypto.randomBytes(32).toString('hex');
    return `${userId}:${randomBytes}`;
}

// 登录 (支持邮箱或账号名)
export async function login(identifier: string, password: string): Promise<User | null> {
    try {
        // 首次安装自动初始化：如果数据库中没有任何用户，允许使用 admin/admin123 登录并自动创建
        const usersCount = await (db.user as any).count();
        if (usersCount === 0) {
            if ((identifier === 'admin' || identifier === 'admin@example.com') && password === 'admin123') {
                console.info('[Auth] 检测到数据库用户为空，正在自动初始化默认管理员。');
                // 创建初始用户
                const user = await register('admin@example.com', 'admin123', '管理员');
                // 提升为管理员并设置固定用户名
                await (db.user as any).update({
                    where: { id: user.id },
                    data: {
                        role: 'ADMIN',
                        username: 'admin'
                    }
                });
                return { ...user, role: 'ADMIN', username: 'admin' } as User;
            }
        }

        const user = await (db.user as any).findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
        });

        if (user) {
            const isValid = await verifyPassword(password, user.password);
            if (isValid) {
                // 如果用户使用旧版 SHA256 密码登录成功，自动升级为 bcrypt
                if (!user.password.startsWith('$2')) {
                    const newHash = await hashPassword(password);
                    await (db.user as any).update({
                        where: { id: user.id },
                        data: { password: newHash }
                    });
                }
                return user as User;
            }
        }
    } catch (dbError) {
        console.warn('[Auth Shield] Database unreachable during login.');
    }

    // 开发环境紧急避灾
    if (process.env.NODE_ENV !== 'production') {
        if ((identifier === 'admin@example.com' || identifier === 'admin') && password === 'admin123') {
            console.warn('[Auth Shield] 数据库无法连接，已通过应急模式登录。');
            return {
                id: 'dev-admin-id',
                email: 'admin@example.com',
                username: 'admin',
                password: '',
                name: '虚拟管理员(应急模式)',
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date(),
                avatar: null,
                bio: null,
                expertise: null,
                github: null,
                isPublicAuthor: false,
                linkedin: null,
                twitter: null,
                website: null,
            } as any as User;
        }
    }

    return null;
}

// 注册
export async function register(email: string, password: string, name?: string): Promise<User> {
    const hashedPassword = await hashPassword(password);

    const user = await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'USER',
        },
    });

    return user;
}

/**
 * 校验当前登录用户是否拥有某项模块权限
 * @param permission 模块权限标识（例如 'seo', 'articles', 'ai' 等）
 * @returns boolean
 */
export async function hasPermission(permission: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;
    
    // ADMIN 拥有所有权限
    if (user.role === 'ADMIN') return true;
    
    // 解析用户细粒度权限
    if (user.permissions) {
        try {
            let perms: string[] = [];
            if (typeof user.permissions === 'string') {
                perms = JSON.parse(user.permissions);
            } else if (Array.isArray(user.permissions)) {
                perms = user.permissions as unknown as string[];
            }
            return perms.includes(permission);
        } catch (e) {
            console.error('Error parsing user permissions in hasPermission:', e);
            return false;
        }
    }
    
    return false;
}

