import { registerSection } from '@/lib/sections/registry';
import { DownloadCenter01Section } from './DownloadCenter01Section';

registerSection({
    name: '下载中心',
    type: 'download-center-01',
    description: '文档资料下载列表',
    category: 'content',
    component: DownloadCenter01Section,
    defaultData: {
        title: '资料下载',
        subtitle: '下载我们的产品手册和相关资料',
        items: [
            { title: '产品手册', description: '详细的产品功能说明和使用指南', fileType: 'PDF', fileSize: '2.5MB', downloadUrl: '#' },
            { title: '用户协议', description: '服务条款及隐私政策', fileType: 'PDF', fileSize: '1.2MB', downloadUrl: '#' },
            { title: '安装程序', description: 'Windows/Mac版本客户端下载', fileType: 'EXE', fileSize: '45MB', downloadUrl: '#' },
        ],
    },
    defaultStyle: {
        backgroundColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#3b82f6',
    },
    schema: {
        data: {
            title: { type: 'text', label: '标题' },
            subtitle: { type: 'textarea', label: '副标题' },
            items: {
                type: 'list', label: '下载项', itemSchema: {
                    title: { type: 'text', label: '文件名称' },
                    description: { type: 'textarea', label: '描述' },
                    fileType: { type: 'text', label: '文件类型' },
                    fileSize: { type: 'text', label: '文件大小' },
                    downloadUrl: { type: 'link', label: '下载链接' },
                }
            },
        },
        style: {
            backgroundColor: { type: 'color', label: '背景颜色' },
            textColor: { type: 'color', label: '文字颜色' },
            accentColor: { type: 'color', label: '强调色' },
        }
    }
});
