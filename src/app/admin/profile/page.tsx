'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Save, Loader2, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileData {
    id: string;
    email: string;
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    // 密码修改状态
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

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
                alert('个人资料已更新');
                router.refresh();
            } else {
                const data = await res.json();
                alert('更新失败: ' + data.error);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('更新失败，请重试');
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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <User className="w-8 h-8 text-blue-600" />
                        个人资料
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        管理您的个人信息和安全设置
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 左侧：基本信息 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            基本信息
                        </h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            {/* 头像 */}
                            <div className="flex items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200">
                                        {profile.avatar ? (
                                            <img src={profile.avatar} alt={profile.name || ''} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <User className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-gray-700">头像 URL</label>
                                    <input
                                        type="text"
                                        value={profile.avatar || ''}
                                        onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                    <p className="text-xs text-gray-500">支持 JPG, PNG, WebP 格式图片链接</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">昵称</label>
                                    <input
                                        type="text"
                                        value={profile.name || ''}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">邮箱</label>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">个人简介</label>
                                <textarea
                                    value={profile.bio || ''}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    rows={3}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">专业领域</label>
                                <input
                                    type="text"
                                    value={profile.expertise || ''}
                                    onChange={(e) => setProfile({ ...profile, expertise: e.target.value })}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="例如：SEO 专家, 全栈开发"
                                />
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-medium text-gray-900 mb-4">社交链接</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={profile.website || ''}
                                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="个人网站 URL"
                                    />
                                    <input
                                        type="text"
                                        value={profile.github || ''}
                                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="GitHub URL"
                                    />
                                    <input
                                        type="text"
                                        value={profile.twitter || ''}
                                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Twitter URL"
                                    />
                                    <input
                                        type="text"
                                        value={profile.linkedin || ''}
                                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="LinkedIn URL"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={isSaving}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    保存修改
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* 右侧：安全设置 */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900 flex items-center gap-2">
                            <Lock className="w-5 h-5" />
                            修改密码
                        </h2>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            {passwordError && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{passwordError}</span>
                                </div>
                            )}
                            {passwordSuccess && (
                                <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-start gap-2">
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <span>{passwordSuccess}</span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">当前密码</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="请输入当前密码"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">新密码</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="至少6位字符"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">确认新密码</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="再次输入新密码"
                                    required
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSaving || !currentPassword || !newPassword}
                                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                                    修改密码
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
