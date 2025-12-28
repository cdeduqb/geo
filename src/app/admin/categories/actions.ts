'use server';

import { db } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CategorySchema = z.object({
    name: z.string().min(1, '分类名称不能为空'),
    slug: z.string().min(1, 'URL 路径不能为空'),
    description: z.string().optional(),
    parentId: z.string().optional().nullable(),
    sortOrder: z.coerce.number().default(0),
});

export async function createCategory(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        parentId: formData.get('parentId') || null,
        sortOrder: formData.get('sortOrder'),
    };

    const validatedData = CategorySchema.parse(rawData);

    try {
        await db.category.create({
            data: validatedData,
        });
    } catch (error) {
        console.error('创建分类失败:', error);
        return { error: '创建分类失败，可能是 URL 路径重复' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function updateCategory(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    const id = formData.get('id') as string;

    if (!id) {
        throw new Error('分类 ID 不能为空');
    }

    const rawData = {
        name: formData.get('name'),
        slug: formData.get('slug'),
        description: formData.get('description'),
        parentId: formData.get('parentId') || null,
        sortOrder: formData.get('sortOrder'),
    };

    const validatedData = CategorySchema.parse(rawData);

    try {
        await db.category.update({
            where: { id },
            data: validatedData,
        });
    } catch (error) {
        console.error('更新分类失败:', error);
        return { error: '更新分类失败' };
    }

    revalidatePath('/admin/categories');
    redirect('/admin/categories');
}

export async function deleteCategory(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error('未授权');
    }

    const id = formData.get('id') as string;

    if (!id) {
        throw new Error('分类 ID 不能为空');
    }

    try {
        await db.category.delete({
            where: { id },
        });
    } catch (error) {
        console.error('删除分类失败:', error);
        return { error: '删除分类失败' };
    }

    revalidatePath('/admin/categories');
}
