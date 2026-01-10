'use client';

import { useState, useEffect, useRef } from 'react';
import { User, Lock, Save, Loader2, Camera, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

interface ProfileData {
    id: string;
    email: string;
    username: string | null;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    expertise: string | null;
    website: string | null;
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
}

export default function ProfilePage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    // 密码修改状态
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');


    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('文件大小不能超过 5MB', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await fetch('/api/admin/files/upload', {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                // Check data.file.url first, fallback to data.url
                const url = data.file?.url || data.url;
                if (url) {
                    setProfile(prev => prev ? { ...prev, avatar: url } : null);
                    showToast('头像上传成功', 'success');
                } else {
                    showToast('上传成功但未返回URL', 'warning');
                }
            } else {
                const err = await res.json();
                showToast('图片上传失败: ' + (err.error || '未知错误'), 'error');
            }
        } catch (error) {
            console.error('Upload error:', error);
            showToast('上传出错', 'error');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/admin/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: profile.name,
                    username: profile.username,
                    avatar: profile.avatar,
                    bio: profile.bio,
                    expertise: profile.expertise,
                    website: profile.website,
                    twitter: profile.twitter,
                    linkedin: profile.linkedin,
                    github: profile.github,
                }),
            });

            if (res.ok) {
                showToast('个人资料已更新', 'success');
                router.refresh();
            } else {
                const data = await res.json();
                showToast('更新失败: ' + data.error, 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('更新失败，请重试', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (newPassword !== confirmPassword) {
            setPasswordError('两次输入的新密码不一致');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('新密码长度不能少于6位');
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setPasswordSuccess('密码修改成功');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setPasswordError(data.error || '密码修改失败');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('系统错误，请重试');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-100/50">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">个人资料</h1>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider opacity-60">Personal Account Settings</p>
                    </div>
                </div>


            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧：基本信息 */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm shadow-gray-100/30">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">基本信息</h2>
                        </div>

                        <form onSubmit={handleProfileUpdate} className="space-y-8">
                            {/* 头像区域 */}
                            <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                                <div className="relative group cursor-pointer" onClick={() => !isUploading && fileInputRef.current?.click()}>
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/png,image/jpeg,image/gif,image/webp"
                                    />
                                    <div className="w-32 h-32 rounded-[40px] bg-white overflow-hidden border-4 border-white shadow-xl shadow-gray-200/50 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105 relative">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt={profile.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                                                <User className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className={`absolute inset-0 bg-gray-900/40 flex items-center justify-center transition-opacity ${isUploading ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}>
                                            <Camera className="w-8 h-8 text-white" />
                                        </div>
                                        {isUploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                                <Loader2 className="w-8 h-8 text-white animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-100 border-4 border-white">
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-3 w-full">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">头像图片地址</label>
                                    <input
                                        type="text"
                                        value={profile.avatar || ''}
                                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                        placeholder="请输入头像 URL"
                                    />
                                    <p className="text-[10px] text-gray-400 font-bold ml-1">支持常见图片格式的公开链接</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">展示昵称</label>
                                    <input
                                        type="text"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">登录账号</label>
                                    <input
                                        type="text"
                                        value={profile.username || ''}
                                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none"
                                    />
                                </div>

                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">个人简介</label>
                                <textarea
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={4}
                                    className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none resize-none leading-relaxed placeholder:text-gray-300"
                                    placeholder="写一点关于您的简介..."
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">专业技能 / 领域</label>
                                <input
                                    type="text"
                                    value={profile.expertise || ''}
                                    onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
                                    className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none placeholder:text-gray-300"
                                    placeholder="例如：SEO 专家, 全栈开发"
                                />
                            </div>



                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center px-10 py-4 bg-blue-600 text-white text-sm font-black rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-100 hover:shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    保存个人资料
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 右侧：安全设置 */}
                <div className="space-y-8">
                    <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm shadow-gray-100/30">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-1.5 h-6 bg-gray-900 rounded-full" />
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">安全中心</h2>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            {passwordError && (
                                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-start gap-3 animate-shake">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{passwordError}</span>
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold rounded-2xl flex items-start gap-3">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{passwordSuccess}</span>
                                </div>
                            )}

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">当前密码</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 pl-12 pr-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none"
                                        placeholder="确认身份"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">新密码</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none"
                                    placeholder="至少6位安全密码"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">确认新密码</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-2xl border border-gray-300 bg-gray-50/50 px-6 py-4 text-sm font-bold text-gray-900 focus:border-blue-600 focus:bg-white transition-all outline-none"
                                    placeholder="确保一致"
                                    required
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving || !currentPassword || !newPassword}
                                    className="w-full h-14 bg-red-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : '重设安全密码'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-8 bg-blue-50/50 rounded-[32px] border border-blue-100/50">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <h4 className="text-sm font-black text-gray-900">安全建议</h4>
                        </div>
                        <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                            为了您的账户安全，建议定期更改密码并使用包含字母、数字和特殊字符的复杂组合。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
