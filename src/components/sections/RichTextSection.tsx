import { registerSection, SectionProps } from '@/lib/sections/registry';
import { RichTextContent } from '@/components/security/SafeHTML';

export const RichTextSection: React.FC<SectionProps> = ({ data, style = {} }) => {
    const { content } = data;
    const { backgroundColor = 'bg-white', padding = 'py-12', maxWidth = 'max-w-4xl' } = style;

    return (
        <section className={`${backgroundColor} ${padding}`}>
            <div className={`container mx-auto px-4 ${maxWidth} mx-auto`}>
                <RichTextContent
                    content={content || ''}
                    className="prose prose-lg max-w-none"
                />
            </div>
        </section>
    );
};

registerSection({
    type: 'rich-text',
    name: '富文本内容',
    description: '自由编辑的文本内容区域',
    category: 'content',
    component: RichTextSection,
    defaultData: {
        content: '<h2>关于我们</h2><p>这是一段示例文本内容。您可以在这里添加任何 HTML 内容。</p>'
    },
    defaultStyle: {
        backgroundColor: 'bg-white',
        padding: 'py-12',
        maxWidth: 'max-w-4xl'
    },
    schema: {
        data: {
            content: { type: 'rich-text', label: 'HTML 内容' }
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
            maxWidth: {
                type: 'select',
                label: '最大宽度',
                options: [
                    { label: '窄', value: 'max-w-2xl' },
                    { label: '中', value: 'max-w-4xl' },
                    { label: '宽', value: 'max-w-6xl' },
                    { label: '全宽', value: 'max-w-full' }
                ]
            }
        }
    }
});
