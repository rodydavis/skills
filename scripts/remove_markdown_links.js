const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../skills');
const dryRun = false; // Set to false to actually modify files

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

console.log(`Scanning ${skillsDir} for markdown links...`);
if (dryRun) console.log('--- DRY RUN MODE: No changes will be made ---');

const skillFiles = walk(skillsDir);
let changesCount = 0;

skillFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Regex to find the specific link format: [](/api/posts/... "View as markdown")
    // It seems to be on its own line usually, but we should target the exact string pattern.
    // The pattern is roughly: \[\]\(/api/posts/[a-zA-Z0-9]+/markdown "View as markdown"\)
    // We also want to handle potential surrounding whitespace/newlines if it's on a standalone line to leave it clean.

    const regex = /(\r?\n|^)\[\]\(\/api\/posts\/[a-zA-Z0-9]+\/markdown "View as markdown"\)(\r?\n|$)/g;

    if (regex.test(content)) {
        console.log(`[${dryRun ? 'DRY RUN' : 'FIX'}] Found markdown link in ${path.relative(skillsDir, file)}`);

        if (!dryRun) {
            const newContent = content.replace(regex, '$2'); // Keep one newline if it was surrounded by them, or just empty if at start/end
            fs.writeFileSync(file, newContent);
        }
        changesCount++;
    }
});

console.log(`\n${dryRun ? 'Found' : 'Fixed'} markdown links in ${changesCount} files.`);
