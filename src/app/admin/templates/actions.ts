'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// 全面刷新模板相关的所有缓存
async function revalidateAllTemplateRelatedPaths(templateId?: string) {
    // 1. 刷新管理后台
    revalidatePath('/admin/templates');
    revalidatePath('/admin/pages');
    revalidatePath('/admin/settings/site');

    // 2. 刷新首页（所有类型）
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');

    // 3. 刷新所有语言版本的首页
    const locales = ['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'ar'];
    for (const locale of locales) {
        revalidatePath(`/${locale}`, 'page');
        revalidatePath(`/${locale}`, 'layout');
    }

    // 4. 如果提供了模板ID，查找并刷新所有使用该模板的页面
    if (templateId) {
        try {
            const pagesUsingTemplate = await db.page.findMany({
                where: {
                    OR: [
                        { headerTemplateId: templateId },
                        { footerTemplateId: templateId },
                        { templateId: templateId },
                    ],
                },
                select: { slug: true, lang: true },
            });

            for (const page of pagesUsingTemplate) {
                revalidatePath(`/${page.lang}/${page.slug}`, 'page');
            }
        } catch (e) {
            console.error('Failed to revalidate pages using template:', e);
        }
    }
}


export async function createTemplate(formData: FormData) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        return { success: false, error: '需要管理员权限' };
    }

    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        content: formData.get('content'),
        style: formData.get('style'),
        moduleType: formData.get('moduleType'),
        type: formData.get('type'),
    };

    try {
        await db.pageTemplate.create({
            data: {
                name: rawData.name as string,
                description: rawData.description as string || null,
                content: rawData.content as string,
                style: rawData.style as string || null,
                moduleType: rawData.moduleType as any,
                type: rawData.type as any,
                version: 1,
                isDefault: false,
                isActive: false,
            },
        });
    } catch (error) {
        console.error('创建模板失败:', error);
        return { success: false, error: '创建模板失败' };
    }

    await revalidateAllTemplateRelatedPaths();
    return { success: true };
}

export async function updateTemplate(formData: FormData) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        return { success: false, error: '需要管理员权限' };
    }

    const id = formData.get('id') as string;

    const rawData = {
        name: formData.get('name'),
        description: formData.get('description'),
        content: formData.get('content'),
        style: formData.get('style'),
        moduleType: formData.get('moduleType'),
        type: formData.get('type'),
    };

    try {
        await db.pageTemplate.update({
            where: { id },
            data: {
                name: rawData.name as string,
                description: rawData.description as string || null,
                content: rawData.content as string,
                style: rawData.style as string || null,
                moduleType: rawData.moduleType as any,
                type: rawData.type as any,
            },
        });
    } catch (error) {
        console.error('更新模板失败:', error);
        return { success: false, error: '更新模板失败' };
    }

    await revalidateAllTemplateRelatedPaths(id);
    return { success: true };
}

export async function toggleTemplateStatus(templateId: string, moduleType: string, isActive: boolean) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        throw new Error('需要管理员权限');
    }

    try {
        if (isActive) {
            // 如果是要启用，先停用同类型的所有模板（保持单选逻辑）
            // 注意：对于某些类型可能允许通过，但目前保持严格单选比较安全
            await db.pageTemplate.updateMany({
                where: { moduleType: moduleType as any },
                data: { isActive: false },
            });

            // 激活选定的模板
            await db.pageTemplate.update({
                where: { id: templateId },
                data: { isActive: true },
            });
        } else {
            // 如果是要禁用，直接更新
            await db.pageTemplate.update({
                where: { id: templateId },
                data: { isActive: false },
            });
        }
    } catch (error) {
        console.error('更新模板状态失败:', error);
        return { error: '更新模板状态失败' };
    }

    await revalidateAllTemplateRelatedPaths(templateId);
}

export async function deleteTemplate(id: string) {
    const user = await getCurrentUser();

    if (!user || user.role !== 'ADMIN') {
        throw new Error('需要管理员权限');
    }

    try {
        await db.pageTemplate.delete({
            where: { id },
        });
    } catch (error) {
        console.error('删除模板失败:', error);
        return { error: '删除模板失败' };
    }

    await revalidateAllTemplateRelatedPaths(id);
}

export async function activateTemplate(templateId: string, moduleType: string) {
    return toggleTemplateStatus(templateId, moduleType, true);
}
