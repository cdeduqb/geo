import { registerSection, SectionProps } from '@/lib/sections/registry';

export const DividerSection: React.FC<SectionProps> = ({ style = {} }) => {
    const { backgroundColor = 'bg-white', height = 'h-px', color = 'bg-gray-200', margin = 'my-8' } = style;

    return (
        <section className={backgroundColor}>
            <div className={`container mx-auto px-4 ${margin}`}>
                <div className={`w-full ${height} ${color}`}></div>
            </div>
        </section>
    );
};

registerSection({
    type: 'divider',
    name: '分割线',
    description: '简单的视觉分隔符',
    category: 'layout',
    component: DividerSection,
    defaultData: {},
    defaultStyle: {
        backgroundColor: 'bg-white',
        height: 'h-px',
        color: 'bg-gray-200',
        margin: 'my-12'
    },
    schema: {
        data: {},
        style: {
            backgroundColor: {
                type: 'select',
                label: '背景颜色',
                options: [
                    { label: '白色', value: 'bg-white' },
                    { label: '透明', value: 'bg-transparent' },
                    { label: '浅灰', value: 'bg-gray-50' }
                ]
            },
            height: {
                type: 'select',
                label: '线条高度',
                options: [
                    { label: '细 (1px)', value: 'h-px' },
                    { label: '中 (2px)', value: 'h-0.5' },
                    { label: '粗 (4px)', value: 'h-1' }
                ]
            },
            color: {
                type: 'select',
                label: '线条颜色',
                options: [
                    { label: '浅灰', value: 'bg-gray-200' },
                    { label: '深灰', value: 'bg-gray-400' },
                    { label: '蓝色', value: 'bg-blue-600' }
                ]
            },
            margin: {
                type: 'select',
                label: '垂直间距',
                options: [
                    { label: '小', value: 'my-4' },
                    { label: '中', value: 'my-8' },
                    { label: '大', value: 'my-16' }
                ]
            }
        }
    }
});
