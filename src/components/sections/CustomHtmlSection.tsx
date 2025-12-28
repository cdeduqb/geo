import { registerSection, SectionProps } from '@/lib/sections/registry';

export const CustomHtmlSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { html } = data;

    // 如果没有内容，显示占位符（仅在编辑模式下，但这里简单处理）
    if (!html) {
        return (
            <div className="p-8 text-center border-2 border-dashed border-gray-200  rounded-lg text-gray-400">
                Custom HTML Section (Empty)
            </div>
        );
    }

    return (
        <div
            className="custom-html-section w-full"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

registerSection({
    type: 'custom-html',
    name: '自定义 HTML',
    description: '直接编写 HTML 代码，支持 Tailwind CSS',
    category: 'layout',
    component: CustomHtmlSection,
    defaultData: {
        html: '<div class="p-8 bg-blue-50 text-center"><h2 class="text-2xl font-bold text-blue-900">Hello World</h2><p class="text-blue-700 mt-2">This is a custom HTML section.</p></div>'
    },
    schema: {
        data: {
            html: { type: 'code', label: 'HTML 代码' }
        }
    }
});
