export interface TagInfo {
    tag: string;
    attrs: string;
    originalContent: string;
    isSelfClosing: boolean;
}

export interface MarkedText {
    markedText: string;
    tagMap: Map<string, TagInfo>;
}

export interface ValidationResult {
    success: boolean;
    missingTags?: string[];
    extraTags?: string[];
}

export class HtmlRewriter {
    private tagCounter = 0;

    /**
     * 将HTML转换为带有标记的文本
     * 例如: <strong>text</strong> -> [TAG0]text[/TAG0]
     */
    toMarked(html: string): MarkedText {
        const tagMap = new Map<string, TagInfo>();
        this.tagCounter = 0;

        // 处理自闭合标签 (如 <img />, <br />)
        let processedHtml = html.replace(/<([a-zA-Z0-9]+)([^>]*)\/>/g, (match, tag, attrs) => {
            const id = `TAG${this.tagCounter++}`;
            tagMap.set(id, {
                tag,
                attrs,
                originalContent: '',
                isSelfClosing: true
            });
            return `[${id}/]`;
        });

        // 处理成对标签 (如 <strong>...</strong>)
        // 使用递归或多次替换处理嵌套标签
        // 简单起见,这里使用正则处理最内层标签,然后逐层向外
        // 注意: 这种简单的正则无法完美处理所有嵌套情况,但对于富文本编辑器的输出通常足够

        // 更健壮的方法是使用栈来解析HTML,这里实现一个简化的栈解析器
        const result = this.parseHtmlWithStack(processedHtml, tagMap);

        return {
            markedText: result,
            tagMap
        };
    }

    /**
     * 将带有标记的文本转换回HTML
     */
    fromMarked(markedText: string, tagMap: Map<string, TagInfo>): string {
        let html = markedText;

        // 恢复自闭合标签
        html = html.replace(/\[(TAG\d+)\/\]/g, (match, id) => {
            const info = tagMap.get(id);
            if (!info) return match;
            return `<${info.tag}${info.attrs}/>`;
        });

        // 恢复成对标签
        // 需要多次替换以处理嵌套
        let lastHtml = '';
        while (html !== lastHtml) {
            lastHtml = html;
            html = html.replace(/\[(TAG\d+)\]([\s\S]*?)\[\/\1\]/, (match, id, content) => {
                const info = tagMap.get(id);
                if (!info) return match;
                return `<${info.tag}${info.attrs}>${content}</${info.tag}>`;
            });
        }

        return html;
    }

    /**
     * 验证标记完整性
     */
    validateMarks(text: string, tagMap: Map<string, TagInfo>): ValidationResult {
        const missingTags: string[] = [];

        for (const [id, info] of tagMap.entries()) {
            if (info.isSelfClosing) {
                if (!text.includes(`[${id}/]`)) {
                    missingTags.push(id);
                }
            } else {
                if (!text.includes(`[${id}]`) || !text.includes(`[/${id}]`)) {
                    missingTags.push(id);
                }
            }
        }

        return {
            success: missingTags.length === 0,
            missingTags: missingTags.length > 0 ? missingTags : undefined
        };
    }

    /**
     * 使用栈解析HTML以正确处理嵌套
     */
    private parseHtmlWithStack(html: string, tagMap: Map<string, TagInfo>): string {
        let result = '';
        let currentIndex = 0;
        const stack: { tag: string, attrs: string, id: string }[] = [];

        // 匹配开始标签 <tag attrs> 或结束标签 </tag>
        const tagRegex = /<\/?([a-zA-Z0-9]+)([^>]*)>/g;
        let match;

        while ((match = tagRegex.exec(html)) !== null) {
            // 添加标签前的文本
            result += html.substring(currentIndex, match.index);

            const isClosing = match[0].startsWith('</');
            const tag = match[1];
            const attrs = match[2];

            if (isClosing) {
                // 结束标签
                // 查找栈中最近的匹配标签
                let found = false;
                for (let i = stack.length - 1; i >= 0; i--) {
                    if (stack[i].tag === tag) {
                        // 找到匹配,闭合它
                        const info = stack[i];
                        result += `[/${info.id}]`;

                        // 保存标签信息
                        tagMap.set(info.id, {
                            tag: info.tag,
                            attrs: info.attrs,
                            originalContent: '', // 内容在重组时不需要
                            isSelfClosing: false
                        });

                        // 移除栈顶元素
                        stack.splice(i, 1);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    // 未匹配的结束标签,保留原样或忽略
                    // 这里选择保留原样,作为普通文本
                    result += match[0];
                }
            } else {
                // 开始标签
                // 检查是否是自闭合标签(虽然前面已经处理过,但以防万一)
                if (match[0].endsWith('/>')) {
                    const id = `TAG${this.tagCounter++}`;
                    result += `[${id}/]`;
                    tagMap.set(id, {
                        tag,
                        attrs,
                        originalContent: '',
                        isSelfClosing: true
                    });
                } else {
                    // 普通开始标签,压入栈
                    const id = `TAG${this.tagCounter++}`;
                    result += `[${id}]`;
                    stack.push({ tag, attrs, id });
                }
            }

            currentIndex = tagRegex.lastIndex;
        }

        // 添加剩余文本
        result += html.substring(currentIndex);

        // 处理未闭合的标签
        // 如果栈不为空,说明有未闭合的标签
        // 我们可以选择自动闭合它们,或者保留标记
        // 这里选择自动闭合标记
        while (stack.length > 0) {
            const info = stack.pop()!;
            result += `[/${info.id}]`;
            tagMap.set(info.id, {
                tag: info.tag,
                attrs: info.attrs,
                originalContent: '',
                isSelfClosing: false
            });
        }

        return result;
    }
}
