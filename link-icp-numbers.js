const fs = require('fs');
const path = require('path');

const directory = './src/components/sections';

function updateFooter(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Pattern: {icpNumber && <span className="ml-4">{icpNumber}</span>}
    // We want to replace it with an anchor tag.
    // Note: className might vary slightly or have different spacing in the scan, but based on previous script it should be "ml-4".
    // I'll use a regex that is flexible with classnames if possible, but "ml-4" was the standard insertion.

    const targetRegex = /\{icpNumber\s*&&\s*<span\s+className="([^"]+)">\{icpNumber\}<\/span>\}/g;

    // Replacement function to keep the existing classes and add hover:underline if not present (though usually we just want to replace the whole tag structure)
    // Actually, simply replacing the span with an a tag is safer if we want specific attributes.
    // The previous script added `className="ml-4"`.

    // Let's just target the specific string we injected if it matches.

    content = content.replace(
        /\{icpNumber\s*&&\s*<span\s+className="ml-4">\{icpNumber\}<\/span>\}/g,
        `{icpNumber && <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="ml-4 hover:underline">{icpNumber}</a>}`
    );

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    } else {
        // Fallback for potential minor variations or already updated files?
        // Let's try a slightly more generic regex if the exact match fails?
        // No, let's stick to the exact match first as I just generated it. 
        // If I see files skipped, I can refine.
    }
}

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.startsWith('Footer') && file.endsWith('.tsx')) {
            updateFooter(path.join(directory, file));
        }
    });
});
