import { db } from '@/lib/db';
import Link from 'next/link';
import { Users, Edit, Globe, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AuthorsPage() {
    const authors = await db.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            bio: true,
            expertise: true,
            isPublicAuthor: true,
            createdAt: true,
            _count: {
                select: { articles: true }
            }
        },
        orderBy: { createdAt: 'desc' },
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge variant="default">管理员</Badge>;
            case 'EDITOR':
                return <Badge variant="secondary">编辑</Badge>;
            default:
                return <Badge variant="outline">用户</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Users className="w-8 h-8 text-blue-600" />
                        作者管理
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理网站作者信息，设置公开展示和社交链接
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-200">
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">作者</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">角色</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">专业领域</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">文章数</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">状态</TableHead>
                                <TableHead className="py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">加入时间</TableHead>
                                <TableHead className="text-right py-3.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">操作</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {authors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Users className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-sm text-gray-500">暂无作者</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                authors.map((author: any) => (
                                    <TableRow
                                        key={author.id}
                                        className="group hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                {author.avatar ? (
                                                    <img src={author.avatar} alt={author.name || ''} className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-sm font-medium text-white shadow-sm">
                                                        {author.name?.[0] || author.email[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-sm text-gray-900">{author.name || '未设置'}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {author.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {getRoleBadge(author.role)}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {author.expertise ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {author.expertise.split(',').slice(0, 2).map((exp: string, idx: number) => (
                                                        <span key={idx} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                                                            {exp.trim()}
                                                        </span>
                                                    ))}
                                                    {author.expertise.split(',').length > 2 && (
                                                        <span className="text-xs text-gray-500">+{author.expertise.split(',').length - 2}</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">未设置</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-sm text-gray-700 font-mono">{author._count.articles}</span>
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {author.isPublicAuthor ? (
                                                <Badge variant="success" className="flex items-center gap-1 w-fit">
                                                    <Globe className="w-3 h-3" />
                                                    公开
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary">私有</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            <span className="text-xs text-gray-500 font-mono">
                                                {formatDate(author.createdAt)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Link
                                                href={`/admin/authors/${author.id}`}
                                                className="inline-flex items-center gap-1 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="编辑"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
