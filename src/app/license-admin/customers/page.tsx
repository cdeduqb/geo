'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Mail, Phone, Building, User, ArrowLeft, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<any>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/api/license-admin/customers/all');
            if (res.ok) {
                const data = await res.json();
                setCustomers(data.customers || []);
            }
        } catch (error) {
            console.error('获取客户失败:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        返回
                    </button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">客户管理</h1>
                            <p className="text-gray-500 mt-2">管理所有授权客户</p>
                        </div>

                        <button
                            onClick={() => setShowCreate(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Plus className="w-5 h-5" />
                            创建客户
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-gray-500">加载中...</div>
                ) : customers.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">暂无客户</h3>
                        <p className="text-gray-500 mb-6">创建第一个客户以开始使用授权系统</p>
                        <button
                            onClick={() => setShowCreate(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            创建客户
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customers.map((customer) => (
                            <CustomerCard
                                key={customer.id}
                                customer={customer}
                                onUpdate={fetchCustomers}
                                onEdit={() => setEditingCustomer(customer)}
                            />
                        ))}
                    </div>
                )}

                {showCreate && (
                    <CustomerModal
                        mode="create"
                        onClose={() => setShowCreate(false)}
                        onSuccess={() => {
                            setShowCreate(false);
                            fetchCustomers();
                        }}
                    />
                )}

                {editingCustomer && (
                    <CustomerModal
                        mode="edit"
                        customer={editingCustomer}
                        onClose={() => setEditingCustomer(null)}
                        onSuccess={() => {
                            setEditingCustomer(null);
                            fetchCustomers();
                        }}
                    />
                )}
            </div>
        </div>
    );
}

function CustomerCard({ customer, onUpdate, onEdit }: any) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'suspended': return 'bg-yellow-100 text-yellow-700';
            case 'closed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return '激活';
            case 'suspended': return '暂停';
            case 'closed': return '关闭';
            default: return status;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow relative group">
            <button
                onClick={onEdit}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="编辑"
            >
                <Edit className="w-4 h-4" />
            </button>

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">
                            {customer.companyName || '未命名公司'}
                        </h3>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(customer.status)}`}>
                            {getStatusText(customer.status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {customer.contactPerson && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{customer.contactPerson}</span>
                    </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                </div>

                {customer.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{customer.phone}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                创建于 {new Date(customer.createdAt).toLocaleDateString('zh-CN')}
            </div>
        </div>
    );
}

function CustomerModal({ mode = 'create', customer, onClose, onSuccess }: any) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: customer?.email || '',
        companyName: customer?.companyName || '',
        contactPerson: customer?.contactPerson || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
        status: customer?.status || 'active'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.email) {
            alert('请输入邮箱');
            return;
        }

        setLoading(true);
        try {
            const url = mode === 'create'
                ? '/api/license-admin/customers/create'
                : `/api/license-admin/customers/${customer.id}`;

            const res = await fetch(url, {
                method: mode === 'create' ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                onSuccess();
            } else {
                const error = await res.json();
                alert(error.error || `${mode === 'create' ? '创建' : '更新'}失败`);
            }
        } catch (error) {
            alert(`${mode === 'create' ? '创建' : '更新'}失败`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold">{mode === 'create' ? '创建客户' : '编辑客户'}</h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                邮箱 *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="customer@example.com"
                                required
                                disabled={mode === 'edit'}
                            />
                            {mode === 'edit' && (
                                <p className="text-xs text-gray-500 mt-1">邮箱不可修改</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                公司名称
                            </label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="示例公司"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                联系人
                            </label>
                            <input
                                type="text"
                                value={formData.contactPerson}
                                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="张三"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                联系电话
                            </label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="13800138000"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                状态
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            >
                                <option value="active">激活</option>
                                <option value="suspended">暂停</option>
                                <option value="closed">关闭</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                地址
                            </label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                rows={3}
                                placeholder="公司地址"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? '保存中...' : mode === 'create' ? '创建客户' : '保存修改'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            取消
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
