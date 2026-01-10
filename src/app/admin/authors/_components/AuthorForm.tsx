'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Globe, GlobeLock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthorFormProps {
    authorId: string;
}

export default function AuthorForm({ authorId }: AuthorFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [author, setAuthor] = useState<any>(null);

    useEffect(() => {
        fetchAuthor();
    }, [authorId]);

    const fetchAuthor = async () => {
        try {
            const res = await fetch(`/api/admin/authors/${authorId}`);
            if (res.ok) {
                const data = await res.json();
                setAuthor(data);
            }
        } catch (error) {
            console.error('Error fetching author:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            bio: formData.get('bio') as string,
            expertise: formData.get('expertise') as string,
            avatar: formData.get('avatar') as string,
            website: formData.get('website') as string,
            twitter: formData.get('twitter') as string,
            linkedin: formData.get('linkedin') as string,
            github: formData.get('github') as string,
            isPublicAuthor: formData.get('isPublicAuthor') === 'on',
        };

        try {
            const res = await fetch(`/api/admin/authors/${authorId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                alert('保存成功！');
                router.refresh();
            } else {
                alert('保存失败，请重试');
            }
        } catch (error) {
            console.error('Error saving author:', error);
            alert('保存失败，请重试');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!author) {
        return <div>作者不存在</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧主要内容 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">基本信息</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                                    姓名
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={author.name || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="张三"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                    邮箱 (不可修改)
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={author.email}
                                    disabled
                                    className="w-full rounded-lg border border-gray-300 bg-gray-100 px-3 py-2 text-sm cursor-not-allowed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="bio" className="text-sm font-medium text-gray-700">
                                    个人简介
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={author.bio || ''}
                                    rows={4}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                                    placeholder="介绍一下您的背景、经验和专长..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="expertise" className="text-sm font-medium text-gray-700">
                                    专业领域
                                </label>
                                <input
                                    type="text"
                                    id="expertise"
                                    name="expertise"
                                    defaultValue={author.expertise || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="人工智能, 机器学习, 前端开发 (用逗号分隔)"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="avatar" className="text-sm font-medium text-gray-700">
                                    头像 URL
                                </label>
                                <input
                                    type="url"
                                    id="avatar"
                                    name="avatar"
                                    defaultValue={author.avatar || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">社交链接</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="website" className="text-sm font-medium text-gray-700">
                                    个人网站
                                </label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    defaultValue={author.website || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="twitter" className="text-sm font-medium text-gray-700">
                                    Twitter
                                </label>
                                <input
                                    type="text"
                                    id="twitter"
                                    name="twitter"
                                    defaultValue={author.twitter || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="@username"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="linkedin" className="text-sm font-medium text-gray-700">
                                    LinkedIn
                                </label>
                                <input
                                    type="url"
                                    id="linkedin"
                                    name="linkedin"
                                    defaultValue={author.linkedin || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="github" className="text-sm font-medium text-gray-700">
                                    GitHub
                                </label>
                                <input
                                    type="text"
                                    id="github"
                                    name="github"
                                    defaultValue={author.github || ''}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    placeholder="username"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧设置 */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                        <h2 className="text-lg font-semibold mb-6 text-gray-900">发布设置</h2>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <label htmlFor="isPublicAuthor" className="text-sm font-medium text-gray-700 block mb-1">
                                        公开展示
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        开启后，作者信息将在前台显示
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    id="isPublicAuthor"
                                    name="isPublicAuthor"
                                    defaultChecked={author.isPublicAuthor}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    {saving ? '保存中...' : '保存修改'}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">统计信息</h3>
                        <div className="space-y-2 text-sm text-blue-700">
                            <div className="flex justify-between">
                                <span>文章数量：</span>
                                <span className="font-mono">{author._count.articles}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>加入时间：</span>
                                <span className="font-mono text-xs">{new Date(author.createdAt).toLocaleDateString('zh-CN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
