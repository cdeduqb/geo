import { ReactNode } from 'react';

// 区块配置接口（存储在数据库中）
export interface SectionConfig {
    id: string;
    type: string;
    data: Record<string, any>;
    style?: Record<string, any>;
}

// 区块组件属性接口
export interface SectionProps {
    data: Record<string, any>;
    style?: Record<string, any>;
    isEditing?: boolean; // 是否处于编辑模式
    systemSettings?: Record<string, any>; // 全局系统设置 (Logo, contact info, etc.)
}

// 区块定义接口（用于编辑器 UI）
export interface SectionDefinition {
    type: string;
    name: string;
    description: string;
    category: 'layout' | 'content' | 'data' | 'marketing' | 'contact' | 'footer' | 'process';
    icon?: ReactNode;
    defaultData: Record<string, any>;
    defaultStyle?: Record<string, any>;
    component: React.ComponentType<SectionProps>;
    schema: {
        data: Record<string, {
            type: 'text' | 'image' | 'rich-text' | 'color' | 'select' | 'boolean' | 'list' | 'code' | 'number' | 'link' | 'menu' | 'textarea';
            label: string;
            options?: { label: string; value: string }[];
            itemSchema?: Record<string, { type: string; label: string }>;
        }>;
        style?: Record<string, {
            type: 'text' | 'color' | 'select' | 'number' | 'link' | 'boolean';
            label: string;
            options?: { label: string; value: string }[];
        }>;
    };
    variants?: {
        label: string;
        description?: string;
        icon?: ReactNode;
        data: Record<string, any>;
        style?: Record<string, any>;
    }[];
}

// 组件注册表
export const sectionRegistry: Record<string, SectionDefinition> = {};

// 注册函数
export function registerSection(definition: SectionDefinition) {
    sectionRegistry[definition.type] = definition;
}

// 获取所有已注册的区块
export function getRegisteredSections() {
    return Object.values(sectionRegistry);
}

// 获取特定区块定义
export function getSectionDefinition(type: string) {
    return sectionRegistry[type];
}


