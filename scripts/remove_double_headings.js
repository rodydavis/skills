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

console.log(`Scanning ${skillsDir} for double headings...`);
if (dryRun) console.log('--- DRY RUN MODE: No changes will be made ---');

const skillFiles = walk(skillsDir);
let changesCount = 0;

skillFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    // Regex to find two identical H1 headers separated by newlines/whitespace
    // Captures:
    // Group 1: Start of string or previous newline
    // Group 2: The Heading line (e.g. "# Title")
    // Group 3: The separation (newlines)
    // Group 4: The repeated Heading line (backreference to \2)
    const regex = /(^|\n)(# [^\r\n]+)(\r?\n\s*)+(\2)/g;

    if (regex.test(content)) {
        console.log(`[${dryRun ? 'DRY RUN' : 'FIX'}] Found double heading in ${path.relative(skillsDir, file)}`);

        if (!dryRun) {
            // Replace with just the first heading (plus preceding newline)
            // We drop the intermediate newlines and the second heading.
            const newContent = content.replace(regex, '$1$2');
            fs.writeFileSync(file, newContent);
        }
        changesCount++;
    }
});

console.log(`\n${dryRun ? 'Found' : 'Fixed'} double headings in ${changesCount} files.`);
