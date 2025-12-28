const fs = require('fs');
const path = require('path');

const directory = './src/components/sections';

function fixFooter(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Remove useGradient from defaultStyle
    // Pattern: defaultStyle: { ... useGradient: true ... }
    // or defaultStyle: { useGradient: true }
    content = content.replace(/useGradient:\s*true\s*,?/g, '');
    content = content.replace(/useGradient:\s*false\s*,?/g, '');

    // 2. Remove useGradient from Schema if it remains
    // It might be "useGradient: { ... }" or "useGradient: { ... },"
    content = content.replace(/useGradient:\s*\{\s*type:\s*'boolean'[^}]*\s*\}\s*,?/g, '');

    // 3. Remove isolated commas
    // Pattern: Just whitespace and a comma on a line? or multiple commas
    // We can replace ",\s*," with ","
    content = content.replace(/,\s*,/g, ',');

    // Pattern: "{\s*," -> "{"
    content = content.replace(/\{\s*,/g, '{');

    // Pattern: ",\s*}" -> "}" (trailing comma is valid in JS but let's be clean)
    // Actually trailing comma is fine.

    // Pattern: Line with just comma and whitespace
    // Split by lines?
    const lines = content.split('\n');
    const newLines = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed !== ',';
    });
    content = newLines.join('\n');

    // 4. Fix useGradient interface definitions if any (interface Footer01Style)
    content = content.replace(/useGradient\?:\s*boolean;\s*/g, '');
    content = content.replace(/gradientFrom\?:\s*string;\s*/g, '');
    content = content.replace(/gradientTo\?:\s*string;\s*/g, '');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${filePath}`);
    }
}

fs.readdir(directory, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (file.startsWith('Footer') && file.endsWith('.tsx')) {
            fixFooter(path.join(directory, file));
        }
    });
});
