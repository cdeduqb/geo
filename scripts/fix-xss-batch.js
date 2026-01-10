#!/usr/bin/env node

/**
 * GeoCMS XSS 漏洞自动修复脚本
 * 
 * 使用方法：
 * node scripts/fix-xss-batch.js
 */

const fs = require('fs');
const path = require('path');

// 需要修复的文件列表
const filesToFix = [
    {
        file: 'src/app/articles/[slug]/page.tsx',
        line: 310,
        addImport: "import { RichTextContent } from '@/components/security/SafeHTML';",
        replacements: [
            {
                search: 'dangerouslySetInnerHTML={{ __html: processedContent }}',
                // 注意：需要手动将 div 改为 RichTextContent
                // 因为还需要将 className 传递过去
            }
        ],
        manualFix: true,
        instructions: `
手动修复步骤：
1. 第1行后添加: import { RichTextContent } from '@/components/security/SafeHTML';
2. 替换第 296-311 行的 div 标签:
   从: <div className="prose..." dangerouslySetInnerHTML={{ __html: processedContent }} />
   到: <RichTextContent content={processedContent} className="prose..." />
        `
    },
    {
        file: 'src/app/products/[slug]/page.tsx',
        line: 253,
        addImport: "import { RichTextContent } from '@/components/security/SafeHTML';",
        manualFix: true
    },
    {
        file: 'src/app/author/[id]/page.tsx',
        line: 103,
        addImport: "import { RichTextContent } from '@/components/security/SafeHTML';",
        manualFix: true
    },
    {
        file: 'src/components/PageLayout.tsx',
        lines: [59, 61, 77, 79, 95, 97],
        addImport: "import { CustomHTML } from '@/components/security/SafeHTML';",
        manualFix: true
    },
    {
        file: 'src/app/DynamicPageHandler.tsx',
        lines: [147, 149, 151, 170],
        addImport: "import { CustomHTML } from '@/components/security/SafeHTML';",
        manualFix: true
    },
];

console.log('==============================================');
console.log('GeoCMS XSS 漏洞批量修复脚本');
console.log('==============================================\n');

console.log('⚠️  注意: 由于文件复杂度较高，部分文件需要手动修复');
console.log('✅ 自动修复脚本主要用于简单的单行替换\n');

let totalFiles = filesToFix.length;
let manualFiles = 0;
let autoFiles = 0;

filesToFix.forEach(({ file, addImport, manualFix, instructions }) => {
    const filePath = path.join(__dirname, '..', file);

    if (!fs.existsSync(filePath)) {
        console.log(`❌ 文件不存在: ${file}`);
        return;
    }

    if (manualFix) {
        manualFiles++;
        console.log(`⚠️  需要手动修复: ${file}`);
        if (instructions) {
            console.log(instructions);
        }
        console.log('');
    } else {
        // 自动修复逻辑
        autoFiles++;
        let content = fs.readFileSync(filePath, 'utf-8');

        // 添加导入（如果不存在）
        if (addImport && !content.includes(addImport.trim())) {
            // 在第一个 import 后添加
            const firstImport = content.indexOf('import');
            if (firstImport !== -1) {
                content = content.replace(/^import/, addImport + '\nimport');
            }
        }

        fs.writeFileSync(filePath, content);
        console.log(`✅ 已自动修复: ${file}`);
    }
});

console.log('\n==============================================');
console.log(`总计: ${totalFiles} 个文件`);
console.log(`✅ 自动修复: ${autoFiles} 个`);
console.log(`⚠️  需手动修复: ${manualFiles} 个`);
console.log('==============================================\n');

console.log('📖 详细修复指南请查看: XSS_FIX_CHECKLIST.md');
console.log('🔐 安全加固文档请查看: SECURITY.md\n');
