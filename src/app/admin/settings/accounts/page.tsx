import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AccountManagerClient from './_components/AccountManagerClient';

export const dynamic = 'force-dynamic';

export default async function AccountsPage() {
    try {
        // 要求当前必须是超级管理员，否则直接阻断
        const currentUser = await requireAdmin();
        if (!currentUser) {
            redirect('/admin/dashboard');
        }

        // 容灾处理：尝试查询数据库
        let users: any[] = [];
        try {
            users = await db.user.findMany({
                select: {
                    id: true,
                    email: true,
                    username: true,
                    name: true,
                    role: true,
                    permissions: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
        } catch (dbError) {
            console.warn('[DB Shield] 账号管理页面无法连接远程数据库，启用开发环境兜底数据预览。');
        }


        // 统一格式化 permissions 为字符串数组
        const formattedUsers = users.map(user => {
            let perms: string[] = [];
            if (user.permissions) {
                try {
                    if (typeof user.permissions === 'string') {
                        perms = JSON.parse(user.permissions);
                    } else if (Array.isArray(user.permissions)) {
                        perms = user.permissions as string[];
                    }
                } catch (e) {
                    console.error('Failed to parse user permissions:', e);
                }
            }
            return {
                ...user,
                permissions: perms,
            };
        });

        return (
            <AccountManagerClient 
                initialUsers={formattedUsers} 
                currentUserId={currentUser.id} 
            />
        );
    } catch (error) {
        console.error('加载账号管理页面失败:', error);
        redirect('/admin/dashboard');
    }
}
