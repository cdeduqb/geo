import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

import { getCurrentUser } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

// GET /api/admin/settings - Get all settings
export async function GET() {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const settings = await db.systemSetting.findMany();

        // Convert to key-value object for easier frontend consumption
        const settingsObject: Record<string, string> = {};
        settings.forEach((setting: { key: string; value: string }) => {
            settingsObject[setting.key] = setting.value;
        });

        return NextResponse.json(settingsObject);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// POST /api/admin/settings - Update settings (batch)
export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // 特殊处理：站点验证文件物理同步到 public 目录
        if (body.site_verification_files) {
            try {
                const publicDir = path.join(process.cwd(), 'public');
                let verificationFiles: any[] = [];
                try {
                    verificationFiles = JSON.parse(body.site_verification_files);
                } catch (e) {
                    console.error('Json parse error', e);
                }

                if (Array.isArray(verificationFiles)) {
                    // 1. 获取旧配置以处理删除
                    const oldSetting = await db.systemSetting.findUnique({
                        where: { key: 'site_verification_files' }
                    });

                    if (oldSetting?.value) {
                        try {
                            const oldFiles = JSON.parse(oldSetting.value);
                            if (Array.isArray(oldFiles)) {
                                for (const oldFile of oldFiles) {
                                    // 如果旧文件不在新列表中，删除它
                                    const exists = verificationFiles.find((f: any) => f.filename === oldFile.filename);
                                    if (!exists && oldFile.filename) {
                                        const filePath = path.join(publicDir, oldFile.filename);
                                        // 简单安全检查：只允许当前目录
                                        if (!oldFile.filename.includes('/') && !oldFile.filename.includes('\\') && fs.existsSync(filePath)) {
                                            fs.unlinkSync(filePath);
                                        }
                                    }
                                }
                            }
                        } catch (e) {
                            console.error('Error cleaning up old files', e);
                        }
                    }

                    // 2. 写入新文件
                    for (const file of verificationFiles) {
                        if (file.filename && file.content) {
                            // 安全检查：防止路径遍历
                            const safeFilename = path.basename(file.filename);
                            if (safeFilename !== file.filename) {
                                console.warn('Skipping unsafe filename:', file.filename);
                                continue;
                            }
                            const filePath = path.join(publicDir, safeFilename);
                            fs.writeFileSync(filePath, file.content, 'utf-8');
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to sync verification files to disk:', error);
                // 不阻塞数据库保存，只记录错误
            }
        }

        // Batch upsert settings
        const updatePromises = Object.entries(body).map(([key, value]) => {
            return db.systemSetting.upsert({
                where: { key },
                update: { value: value as string },
                create: {
                    key,
                    value: value as string,
                    description: getSettingDescription(key),
                },
            });
        });

        await Promise.all(updatePromises);

        // Revalidate layout to update metadata like favicon
        revalidatePath('/', 'layout');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper function to get setting descriptions
function getSettingDescription(key: string): string {
    const descriptions: Record<string, string> = {
        site_name: '网站名称',
        site_url: '网站域名',
        site_description: '网站描述',
        site_logo: '网站 Logo URL',
        site_icon: '网站图标 URL',
        contact_email: '联系邮箱',
        contact_phone: '联系电话',
        contact_address: '联系地址',
        social_wechat: '微信公众号',
        social_weibo: '微博账号',
        social_github: 'GitHub 账号',
        social_twitter: 'Twitter 账号',
        icp_number: 'ICP 备案号',
        company_name: '公司名称',
        enable_multi_language: '是否开启多语言支持',
        copyright: '版权信息',
    };
    return descriptions[key] || '';
}
