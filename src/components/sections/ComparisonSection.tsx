import { registerSection, SectionProps } from '@/lib/sections/registry';
import { Check, X } from 'lucide-react';

export const ComparisonSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, subtitle, columns, features } = data;
    const { backgroundColor = 'bg-white', padding = 'py-20' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900  mb-4">{title}</h2>
                    {subtitle && <p className="text-gray-600  max-w-2xl mx-auto">{subtitle}</p>}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 text-left w-1/4"></th>
                                {columns?.map((col: string, index: number) => (
                                    <th key={index} className="p-4 text-center text-lg font-bold text-gray-900  border-b border-gray-200 ">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {features?.map((feature: any, rowIndex: number) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 :bg-gray-800/50 transition-colors">
                                    <td className="p-4 text-left font-medium text-gray-900  border-b border-gray-100 ">
                                        {feature.name}
                                    </td>
                                    {feature.values.map((val: any, colIndex: number) => (
                                        <td key={colIndex} className="p-4 text-center border-b border-gray-100  text-gray-600 ">
                                            {val === true ? (
                                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                                            ) : val === false ? (
                                                <X className="w-5 h-5 text-gray-300 mx-auto" />
                                            ) : (
                                                <span>{val}</span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

registerSection({
    type: 'comparison',
    name: '对比表',
    description: '产品或服务功能对比',
    category: 'data',
    component: ComparisonSection,
    defaultData: {
        title: '选择适合您的方案',
        subtitle: '详细对比各版本功能差异',
        columns: ['免费版', '专业版', '企业版'],
        features: [
            { name: '用户数量', values: ['1', '5', '无限'] },
            { name: '存储空间', values: ['5GB', '50GB', '1TB'] },
            { name: '自定义域名', values: [false, true, true] },
            { name: '移除广告', values: [false, true, true] },
            { name: 'API 访问', values: [false, false, true] },
            { name: '专属客服', values: [false, '邮件', '7x24小时'] }
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-20'
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'text', label: '副标题' },
            columns: { type: 'list', label: '列名 (List<String>)' },
            features: { type: 'list', label: '功能行 (name, values[])' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' }
                ]
            }
        }
    }
});
