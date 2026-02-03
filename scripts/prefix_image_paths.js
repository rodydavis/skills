const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../skills');
const dryRun = false; // Set to false to actually modify files
const prefix = 'https://rodydavis.com';

function walk(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath, fileList);
        } else {
            if (file === 'SKILL.md') {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

console.log(`Scanning ${skillsDir} for relative image paths...`);
if (dryRun) console.log('--- DRY RUN MODE: No changes will be made ---');

const skillFiles = walk(skillsDir);
let changesCount = 0;

skillFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Regex to find markdown images with relative paths starting with /
    // Pattern: ![alt](url)
    // We want to capture the whole link to be safe, or just the URL part.
    // Let's replace `](/` with `](${prefix}/`

    // This regex looks for:
    // 1. `![` (start of image)
    // 2. `...` (alt text, non-greedy)
    // 3. `](` (start of url)
    // 4. `/` (path starting with slash)
    // 5. `...` (rest of url)
    // 6. `)` (end of url)

    // To safely replace, we can target the `](/` sequence that follows `![...]`
    const regex = /(!\[.*?\])\((\/[^)]+)\)/g;

    if (regex.test(content)) {
        console.log(`[${dryRun ? 'DRY RUN' : 'FIX'}] Found relative image path in ${path.relative(skillsDir, file)}`);

        if (!dryRun) {
            const newContent = content.replace(regex, (match, alt, url) => {
                return `${alt}(${prefix}${url})`;
            });
            fs.writeFileSync(file, newContent);
        }
        changesCount++;
    }
});

console.log(`\n${dryRun ? 'Found' : 'Fixed'} relative image paths in ${changesCount} files.`);
