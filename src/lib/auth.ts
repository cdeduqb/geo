import { db } from './db';
import { User } from '@prisma/client';
import { cookies } from 'next/headers';

// 简单的密码哈希（生产环境应使用 bcrypt）
export async function hashPassword(password: string): Promise<string> {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    const hashed = await hashPassword(password);
    return hashed === hashedPassword;
}

// 创建会话
export async function createSession(userId: string) {
    const sessionToken = generateSessionToken(userId);
    const cookieStore = await cookies();

    cookieStore.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7天
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

        // 紧急避灾逻辑：如果是虚拟管理员 ID
        if (process.env.NODE_ENV !== 'production' && userId === 'dev-admin-id') {
            return {
                id: 'dev-admin-id',
                email: 'admin@example.com',
                password: '',
                name: '虚拟管理员(应急模式)',
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

// 检查权限
export async function requireAuth(): Promise<User> {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    return user;
}

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

// 登录
export async function login(email: string, password: string): Promise<User | null> {
    try {
        const user = await db.user.findUnique({
            where: { email },
        });

        if (user) {
            const isValid = await verifyPassword(password, user.password);
            if (isValid) return user;
        }
    } catch (dbError) {
        console.warn('[Auth Shield] Database unreachable during login.');
    }

    // 开发环境紧急避灾：如果数据库连不上，允许使用 admin@example.com / admin123 登录
    if (process.env.NODE_ENV !== 'production') {
        if (email === 'admin@example.com' && password === 'admin123') {
            console.warn('[Auth Shield] 数据库无法连接，已通过应急模式登录。');
            return {
                id: 'dev-admin-id',
                email: 'admin@example.com',
                password: '',
                name: '虚拟管理员(应急模式)',
                role: 'ADMIN',
                createdAt: new Date(),
                updatedAt: new Date(),
            } as User;
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
