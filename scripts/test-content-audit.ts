
// 模拟审计逻辑，直接复制自 src/app/api/admin/articles/audit/route.ts 以便在本地运行测试
// 这样可以避免启动服务器和网络请求，直接测试核心逻辑

interface AuditIssue {
    type: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    impact: number;
}

interface AuditResult {
    overallScore: number;
    issues: AuditIssue[];
    suggestions: string[];
    metrics: {
        wordCount: number;
        paragraphCount: number;
        headingCount: number;
        imageCount: number;
        linkCount: number;
        readabilityScore: number;
    };
}

function performContentAudit(title: string, content: string): AuditResult {
    const issues: AuditIssue[] = [];
    const suggestions: string[] = [];

    // 去除 HTML 标签获取纯文本
    const plainText = content.replace(/<[^>]*>/g, ' ').trim();

    // 改进的字数统计逻辑（支持中英文混合）
    // 1. 统计中文字符数
    const cjkMatch = plainText.match(/[\u4e00-\u9fa5]/g);
    const cjkCount = cjkMatch ? cjkMatch.length : 0;

    // 2. 统计非中文字符（英文单词等），先去除中文，再按非单词字符分割
    const nonCjkText = plainText.replace(/[\u4e00-\u9fa5]/g, ' ');
    const words = nonCjkText.split(/[\s,，。.、！!？?；;：:""''《》<>（）()【】\[\]]+/).filter(w => w.length > 0);
    const wordCount = cjkCount + words.length;

    // 改进的段落提取（更健壮的正则）
    const paragraphs = content.match(/<(p|div)[^>]*>.*?<\/\1>/gi) || [];
    const paragraphCount = paragraphs.length > 0 ? paragraphs.length : (content.split(/\n\s*\n/).length);

    // 提取标题
    const headings = content.match(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi) || [];
    const headingCount = headings.length;
    const h1Count = (content.match(/<h1[^>]*>.*?<\/h1>/gi) || []).length;

    // 提取图片
    const images = content.match(/<img[^>]*>/gi) || [];
    const imageCount = images.length;

    // 提取链接
    const links = content.match(/<a[^>]*href/gi) || [];
    const linkCount = links.length;

    // ... (省略部分评分逻辑，主要关注指标统计)

    // 2. 内容长度检查
    if (wordCount < 300) {
        issues.push({
            type: 'error',
            category: '内容长度',
            message: `文章过短（${wordCount} 字），建议至少 300-500 字以提升SEO效果`,
            impact: 9,
        });
    }

    // ...

    // 计算总体得分
    let overallScore = 100;
    issues.forEach(issue => {
        if (issue.type === 'error') {
            overallScore -= issue.impact * 1.5;
        } else if (issue.type === 'warning') {
            overallScore -= issue.impact;
        } else {
            overallScore -= issue.impact * 0.5;
        }
    });

    overallScore = Math.max(0, Math.min(100, overallScore));

    return {
        overallScore: Math.round(overallScore),
        issues,
        suggestions,
        metrics: {
            wordCount,
            paragraphCount,
            headingCount,
            imageCount,
            linkCount,
            readabilityScore: 100, // 简化
        },
    };
}

// 测试用例
const testCases = [
    {
        name: "中文短文",
        title: "测试标题",
        content: "<p>这是一个测试段落。</p><p>这是第二个段落。</p>"
    },
    {
        name: "中文长文模拟",
        title: "关于人工智能的未来发展趋势",
        content: `
            <h1>人工智能的未来</h1>
            <p>人工智能（AI）正在迅速改变我们的世界。从自动驾驶汽车到智能助手，AI的应用无处不在。</p>
            <h2>生成式AI的崛起</h2>
            <p>生成式AI，如ChatGPT和Midjourney，展示了机器创造内容的能力。它们可以生成文本、图像甚至视频。</p>
            <p>这种技术的核心是深度学习模型，特别是Transformer架构。它允许模型处理大量数据并学习复杂的模式。</p>
            <h2>对行业的影响</h2>
            <p>医疗、金融、教育等行业都将受到深远影响。例如，AI可以帮助医生诊断疾病，帮助分析师预测市场趋势。</p>
        `
    },
    {
        name: "英文混合内容",
        title: "AI Trends in 2025",
        content: "<p>AI technology is evolving rapidly. 人工智能技术发展迅速。</p>"
    }
];

console.log("🔍 开始测试内容审计逻辑...\n");

testCases.forEach(test => {
    console.log(`--- 测试用例: ${test.name} ---`);
    const result = performContentAudit(test.title, test.content);
    console.log(`标题: ${test.title}`);
    console.log(`统计指标:`);
    console.log(`  - 字数 (Word Count): ${result.metrics.wordCount}`);
    console.log(`  - 段落数: ${result.metrics.paragraphCount}`);
    console.log(`  - 标题数: ${result.metrics.headingCount}`);
    console.log(`评分: ${result.overallScore}`);
    console.log(`发现问题: ${result.issues.length} 个`);
    result.issues.forEach(i => console.log(`  [${i.type}] ${i.message}`));
    console.log("\n");
});
