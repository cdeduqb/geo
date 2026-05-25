'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Shield, UserPlus, Key, Trash2, Edit2, 
    Check, X, Loader2, Mail, User as UserIcon,
    FileText, Sparkles, Search, Palette, ShoppingBag, Settings,
    Lock
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface UserAccount {
    id: string;
    email: string;
    username: string | null;
    name: string | null;
    role: string;
    permissions: string[];
    createdAt: Date;
}

interface AccountManagerClientProps {
    initialUsers: UserAccount[];
    currentUserId: string;
}

const ALL_PERMISSIONS = [
    { id: 'articles', name: '内容管理', desc: '文章创作、内容分类及资源归档', icon: FileText, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'ai', name: 'AI 创作工厂', desc: '企业知识库、创作策略、定时发布与批量任务', icon: Sparkles, color: 'text-violet-500 bg-violet-50' },
    { id: 'seo', name: 'SEO/GEO 优化', desc: '引擎推送配置、生成式优化 (GEO)、301 重定向', icon: Search, color: 'text-blue-500 bg-blue-50' },
    { id: 'templates', name: '装修模板管理', desc: '全站页面排版、结构化模板及页眉页脚组装', icon: Palette, color: 'text-amber-500 bg-amber-50' },
    { id: 'products', name: '产品与分类', desc: '企业产品信息发布、产品属性及多级分类管理', icon: ShoppingBag, color: 'text-pink-500 bg-pink-50' },
    { id: 'settings', name: '系统核心配置', desc: '站点基础设置、多语言映射、AI 与存储密钥等', icon: Settings, color: 'text-gray-500 bg-gray-50' },
];

export default function AccountManagerClient({ initialUsers, currentUserId }: AccountManagerClientProps) {
    const router = useRouter();
    const [users, setUsers] = useState<UserAccount[]>(initialUsers);
    
    // 弹窗与加载状态
    const [isLoading, setIsLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
    const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserAccount | null>(null); // 自定义删除确认状态
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // 表单状态
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('EDITOR'); // 默认固定为协作编辑
    const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

    const showMessage = (msg: string, isError = false) => {
        if (isError) {
            setErrorMessage(msg);
            setTimeout(() => setErrorMessage(''), 4000);
        } else {
            setSuccessMessage(msg);
            setTimeout(() => setSuccessMessage(''), 4000);
        }
    };

    // 开启新增模式
    const handleOpenCreate = () => {
        setEditingUser(null);
        setEmail('');
        setUsername('');
        setName('');
        setPassword('');
        setRole('EDITOR'); // 角色隐藏并强制设为协作编辑
        setSelectedPerms(['articles', 'ai']); // 默认开启内容和 AI 创作权限
        setErrorMessage('');
        setIsFormOpen(true);
    };

    // 开启编辑模式
    const handleOpenEdit = (user: UserAccount) => {
        setEditingUser(user);
        setEmail(user.email);
        setUsername(user.username || '');
        setName(user.name || '');
        setPassword(''); // 密码留空代表不修改
        setRole(user.role);
        setSelectedPerms(user.permissions || []);
        setErrorMessage('');
        setIsFormOpen(true);
    };

    // 切换权限勾选
    const togglePermission = (permId: string) => {
        setSelectedPerms(prev => 
            prev.includes(permId) 
                ? prev.filter(id => id !== permId) 
                : [...prev, permId]
        );
    };

    // 提交保存 (新增或更新)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        const isEdit = !!editingUser;
        const url = '/api/admin/users';
        const method = isEdit ? 'PUT' : 'POST';

        // 构造提交参数。如果编辑的是原有管理员，则保持 ADMIN 角色不变，否则一律固定为 EDITOR
        const targetRole = editingUser?.role === 'ADMIN' ? 'ADMIN' : 'EDITOR';

        const payload: Record<string, any> = {
            email,
            username: username || null,
            name: name || null,
            role: targetRole,
            permissions: targetRole === 'ADMIN' ? ALL_PERMISSIONS.map(p => p.id) : selectedPerms,
        };

        if (isEdit) {
            payload.id = editingUser.id;
            if (password && password.trim() !== '') {
                payload.password = password;
            }
        } else {
            payload.password = password;
        }

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || '操作失败');
            }

            showMessage(isEdit ? '账号更新成功' : '账号创建成功');
            setIsFormOpen(false);
            
            // 重新刷新列表数据
            router.refresh();
            
            // 延时拉取最新状态
            const listRes = await fetch('/api/admin/users');
            if (listRes.ok) {
                const updatedList = await listRes.json();
                setUsers(updatedList);
            }
        } catch (error: any) {
            setErrorMessage(error.message || '网络连接错误，请稍后重试');
        } finally {
            setIsLoading(false);
        }
    };

    // 开启删除二次确认弹窗
    const handleOpenDelete = (user: UserAccount) => {
        if (user.id === currentUserId) {
            alert('无法注销您当前正在登录的账号！');
            return;
        }
        setDeleteConfirmUser(user);
    };

    // 确认执行注销/删除账号
    const handleConfirmDelete = async () => {
        if (!deleteConfirmUser) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users?id=${deleteConfirmUser.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || '注销失败');
            }

            showMessage('该协作账号已被成功注销');
            setUsers(prev => prev.filter(u => u.id !== deleteConfirmUser.id));
            setDeleteConfirmUser(null);
            router.refresh();
        } catch (error: any) {
            alert(error.message || '注销失败，请重试');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* 页头区 */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">权限与账号管理</h1>
                        <p className="text-[13px] text-gray-500 font-medium">
                            配置多用户协同工作，细粒度管理文章、AI创作、产品和系统设置等模块的使用权
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-100 transition-all"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>添加协作者</span>
                </button>
            </div>

            {/* 提示反馈条 */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-bold rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                    ✓ {successMessage}
                </div>
            )}

            {/* 成员账号列表表格 */}
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm ring-1 ring-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">成员姓名</th>
                                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">登录账号/邮箱</th>
                                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">系统角色</th>
                                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider">模块访问权限</th>
                                <th className="p-5 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-16 text-center text-gray-400">
                                        暂无协同管理账号
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                    {user.name?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                                                        {user.name || '未设置姓名'}
                                                        {user.id === currentUserId && (
                                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                                                当前登录
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-[11px] font-medium text-gray-400 mt-0.5">
                                                        ID: {user.id}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-sm font-bold text-gray-800">{user.username || '-'}</div>
                                            <div className="text-xs font-medium text-gray-400 mt-0.5">{user.email}</div>
                                        </td>
                                        <td className="p-5">
                                            {user.role === 'ADMIN' ? (
                                                <Badge className="bg-rose-50 border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 shadow-none">
                                                    超级管理员
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-indigo-50 border border-indigo-200 text-indigo-600 font-bold hover:bg-indigo-50 shadow-none">
                                                    协作编辑
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-5">
                                            {user.role === 'ADMIN' ? (
                                                <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full">
                                                    完整模块权限 (超级管理员限制)
                                                </span>
                                            ) : (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {ALL_PERMISSIONS.map(p => {
                                                        const hasPerm = user.permissions?.includes(p.id);
                                                        return (
                                                            <span 
                                                                key={p.id} 
                                                                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                                                                    hasPerm 
                                                                        ? `${p.color} border-current opacity-100` 
                                                                        : 'text-gray-300 bg-gray-50 border-gray-100 opacity-60'
                                                                }`}
                                                                title={p.desc}
                                                            >
                                                                {p.name}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => handleOpenEdit(user)}
                                                    className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                    title="编辑与授权"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDelete(user)}
                                                    disabled={user.id === currentUserId}
                                                    className={`p-2 rounded-xl transition-colors ${
                                                        user.id === currentUserId 
                                                            ? 'text-gray-200 cursor-not-allowed' 
                                                            : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                    }`}
                                                    title="注销账号"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 新增/编辑模态框弹窗 (Modal) */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[85vh] my-8">
                        {/* 弹窗头部 - 固定不滚动 */}
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    {editingUser ? <Edit2 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">
                                        {editingUser ? '编辑协作者账号' : '添加协作人员'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                                        {editingUser ? '修改个人信息与系统板块的授权权限' : '创建一个新的协作账号并分配功能权限'}
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsFormOpen(false)}
                                className="p-2 rounded-xl hover:bg-gray-200/50 text-gray-400 hover:text-gray-700 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* 弹窗主体表单 */}
                        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                            {/* 表单内容区 - 独立溢出滚动 */}
                            <div className="p-8 space-y-6 flex-1 overflow-y-auto">
                                {errorMessage && (
                                    <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-2xl animate-shake">
                                        ⚠️ {errorMessage}
                                    </div>
                                )}

                                {/* 基础字段 */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 ml-1">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            电子邮箱 *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="user@example.com"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm font-bold text-gray-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 ml-1">
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            登录账号名称 (用户名)
                                        </label>
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            placeholder="例如: developer"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm font-bold text-gray-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 ml-1">
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                            真实姓名
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="展示名称，例如: 张三"
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm font-bold text-gray-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[13px] font-bold text-gray-700 flex items-center gap-1.5 ml-1">
                                            <Key className="w-4 h-4 text-gray-400" />
                                            {editingUser ? '重置密码 (留空不改)' : '登录密码 *'}
                                        </label>
                                        <input
                                            type="password"
                                            required={!editingUser}
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            placeholder={editingUser ? "不更改则请留空" : "设置账号的登录密码"}
                                            className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm font-bold text-gray-900 focus:border-indigo-600 focus:bg-white transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* 账号默认角色说明 (去掉了 ADMIN 选择器，固定为协作者以符合超级管理员唯一的逻辑) */}
                                <div className="p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-xs font-bold text-indigo-950 block">协作身份：系统协作编辑 (EDITOR)</span>
                                        <p className="text-[11px] text-gray-400 leading-normal font-medium mt-1">
                                            系统默认仅支持配置协作者账号。您可以针对该协作者单独开启或锁定下方的系统核心业务模块。
                                        </p>
                                    </div>
                                </div>

                                {/* 细粒度模块访问授权 */}
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[13px] font-bold text-gray-900 block">细粒度模块授权</span>
                                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                                            {role === 'ADMIN' 
                                                ? '⚠️ 超级管理员默认拥有系统内全部模块所有权，无须单独勾选限制。' 
                                                : '勾选该人员被允许进入和编辑的系统功能模块，未勾选的模块将在侧边栏对该用户完全隐藏。'
                                            }
                                        </p>
                                    </div>

                                    {role === 'ADMIN' ? (
                                        <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-100 flex items-center gap-3">
                                            <Lock className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
                                            <span className="text-xs text-amber-800 font-bold leading-normal">
                                                该账号已被配置为 [超级管理员]，系统已自动赋予全模块（内容、AI、SEO、模板、产品、设置）最大操作权，无须再配置额外模块锁。
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {ALL_PERMISSIONS.map(perm => {
                                                const isChecked = selectedPerms.includes(perm.id);
                                                return (
                                                    <div
                                                        key={perm.id}
                                                        onClick={() => togglePermission(perm.id)}
                                                        className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-start gap-3 group ${
                                                            isChecked 
                                                                ? 'border-indigo-600 bg-indigo-50/10 shadow-sm' 
                                                                : 'border-gray-100 bg-gray-50/30 hover:border-gray-200'
                                                        }`}
                                                    >
                                                        <div className={`p-2.5 rounded-xl transition-colors ${isChecked ? perm.color : 'bg-gray-100 text-gray-400'}`}>
                                                            <perm.icon className="w-4.5 h-4.5" />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                                                                    {perm.name}
                                                                </span>
                                                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                                                                    isChecked 
                                                                        ? 'bg-indigo-600 border-indigo-600 text-white' 
                                                                        : 'border-gray-300'
                                                                }`}>
                                                                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] text-gray-400 leading-normal font-medium">
                                                                {perm.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 提交按钮栏 - 彻底固定吸底不滚动 */}
                            <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm transition"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm active:scale-95 shadow-md shadow-indigo-100 transition disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Check className="w-4 h-4" />
                                    )}
                                    <span>确认保存</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 自定义高质感删除二次确认弹窗 (Custom Alert Dialog) */}
            {deleteConfirmUser && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[28px] w-full max-w-md border border-gray-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 space-y-5">
                            <div className="flex items-center gap-4 text-red-600">
                                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                    <Trash2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">确认注销该协作账号？</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">注销后该账号将立即断开连接，失去所有系统访问权。</p>
                                </div>
                            </div>
                            
                            <div className="bg-red-50/40 border border-red-100/50 rounded-2xl p-4 space-y-2">
                                <div className="text-xs font-bold text-gray-800 flex items-center gap-2">
                                    <span className="text-gray-400">成员姓名：</span>
                                    <span className="text-red-700">{deleteConfirmUser.name || '未设置姓名'}</span>
                                </div>
                                <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                                    <span className="text-gray-400">登录账号：</span>
                                    <span className="text-gray-800">{deleteConfirmUser.username || '-'}</span>
                                </div>
                                <div className="text-xs font-medium text-gray-400 flex items-center gap-2">
                                    <span className="text-gray-400">绑定邮箱：</span>
                                    <span className="text-gray-800">{deleteConfirmUser.email}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirmUser(null)}
                                    className="px-5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs transition"
                                >
                                    返回
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmDelete}
                                    disabled={isLoading}
                                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-100 transition active:scale-95 disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-3.5 h-3.5" />
                                    )}
                                    <span>确认注销</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
