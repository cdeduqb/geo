import * as cheerio from 'cheerio';

interface FAQItem {
    question: string;
    answer: string;
}

/**
 * 从 HTML 内容中提取 FAQ (常见问题解答)
 * 寻找 <h3> 包含 FAQ 字样的章节，并提取后续的问答对
 */
export function extractFAQFromHTML(html: string): FAQItem[] {
    if (!html) return [];

    try {
        const $ = cheerio.load(html);
        const faqs: FAQItem[] = [];

        // 寻找包含 "常见问题" 或 "FAQ" 的 h3
        const faqHeader = $('h3').filter((_, el) => {
            const text = $(el).text().toLowerCase();
            return text.includes('常见问题') || text.includes('faq');
        }).first();

        if (faqHeader.length > 0) {
            let current = faqHeader.next();
            let currentQuestion = '';
            let currentAnswer = '';

            while (current.length > 0 && current[0].tagName !== 'h3' && current[0].tagName !== 'h2') {
                const text = current.text().trim();

                if (current[0].tagName === 'h4' || (current.find('strong').length > 0 && text.length < 200)) {
                    if (currentQuestion && currentAnswer) {
                        faqs.push({ question: currentQuestion, answer: currentAnswer });
                        currentAnswer = '';
                    }
                    currentQuestion = text.replace(/^[0-9]+[.\s、]+/, '').replace(/^问：/, '').trim();
                } else if (text) {
                    if (currentQuestion) {
                        const cleanAnswer = text.replace(/^答：/, '').trim();
                        currentAnswer += (currentAnswer ? '\n' : '') + cleanAnswer;
                    }
                }
                current = current.next();
            }

            if (currentQuestion && currentAnswer) {
                faqs.push({ question: currentQuestion, answer: currentAnswer });
            }
        }

        // 回退方案：寻找包含 "问：" 和 "答：" 的段落
        if (faqs.length === 0) {
            let tempQuestion = '';
            $('p, strong, li').each((_, el) => {
                const text = $(el).text().trim();
                if (text.startsWith('问：') || (text.includes('？') && text.length < 100)) {
                    tempQuestion = text.replace(/^问：/, '').trim();
                } else if ((text.startsWith('答：') || text.length > 10) && tempQuestion) {
                    faqs.push({ question: tempQuestion, answer: text.replace(/^答：/, '').trim() });
                    tempQuestion = '';
                }
            });
        }

        return faqs.filter(f => f.question && f.answer);
    } catch (error) {
        console.error('[GEO Parser] Failed to extract FAQ:', error);
        return [];
    }
}

/**
 * 从 HTML 内容中提取数据集 (表格数据)
 */
export function extractDatasetsFromHTML(html: string) {
    if (!html) return [];
    try {
        const $ = cheerio.load(html);
        const datasets: any[] = [];

        $('table').each((index, el) => {
            const table = $(el);
            const headers: string[] = [];
            table.find('th').each((_, th) => {
                headers.push($(th).text().trim());
            });

            if (headers.length > 0) {
                datasets.push({
                    name: `Data Table ${index + 1}`,
                    description: table.prev('p, h2, h3').text().trim() || 'Statistical data table from the article',
                    // 在此可以扩展为真正的 Dataset Schema
                });
            }
        });

        return datasets;
    } catch (error) {
        return [];
    }
}
