import { registerSection, SectionProps } from '@/lib/sections/registry';

export const TableSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { title, description, headers, rows } = data;
    const { backgroundColor = 'bg-white', padding = 'py-20', striped = true } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className="container mx-auto px-4">
                {(title || description) && (
                    <div className="mb-8">
                        {title && <h2 className="text-2xl font-bold mb-2 text-gray-900 ">{title}</h2>}
                        {description && <p className="text-gray-600 ">{description}</p>}
                    </div>
                )}

                <div className="overflow-x-auto rounded-lg border border-gray-200  shadow-sm">
                    <table className="w-full text-sm text-left text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                            <tr>
                                {headers?.map((header: string, index: number) => (
                                    <th key={index} scope="col" className="px-6 py-3">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows?.map((row: string[], rowIndex: number) => (
                                <tr
                                    key={rowIndex}
                                    className={`border-b  hover:bg-gray-50 :bg-gray-600 
                                        ${striped && rowIndex % 2 !== 0 ? 'bg-gray-50 ' : 'bg-white '}`}
                                >
                                    {row.map((cell: string, cellIndex: number) => (
                                        <td key={cellIndex} className="px-6 py-4 font-medium text-gray-900  whitespace-nowrap">
                                            {cell}
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
    type: 'table',
    name: '数据表格',
    description: '展示结构化数据',
    category: 'data',
    component: TableSection,
    defaultData: {
        title: '产品参数对比',
        description: '详细的技术规格参数对比表',
        headers: ['特性', '基础版', '专业版', '企业版'],
        rows: [
            ['用户数量', '5人', '20人', '无限'],
            ['存储空间', '10GB', '100GB', '1TB'],
            ['API 调用', '1,000次/天', '10,000次/天', '无限'],
            ['技术支持', '邮件', '邮件+工单', '7x24小时专属'],
            ['自定义域名', '❌', '✅', '✅']
        ]
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-20',
        striped: true
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            description: { type: 'text', label: '描述' },
            headers: { type: 'list', label: '表头 (List<String>)' },
            rows: { type: 'list', label: '行数据 (List<List<String>>)' }
        },
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '浅灰', value: 'bg-gray-50' }
                ]
            },
            padding: {
                type: 'select',
                label: '垂直间距',
                options: [
                    { label: '中', value: 'py-12' },
                    { label: '大', value: 'py-20' }
                ]
            }
        }
    }
});
