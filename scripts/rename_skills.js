const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../skills');
const prefixToRemove = 'rodydavis_com_posts_';

console.log(`Scanning ${skillsDir} for folders starting with "${prefixToRemove}"...`);

if (!fs.existsSync(skillsDir)) {
    console.error(`Skills directory not found at ${skillsDir}`);
    process.exit(1);
}

const files = fs.readdirSync(skillsDir);
let count = 0;

files.forEach(file => {
    const oldPath = path.join(skillsDir, file);
    const stat = fs.statSync(oldPath);

    if (stat.isDirectory() && file.startsWith(prefixToRemove)) {
        const newName = file.substring(prefixToRemove.length);
        const newPath = path.join(skillsDir, newName);

        console.log(`Renaming: ${file} -> ${newName}`);

        try {
            if (fs.existsSync(newPath)) {
                console.warn(`WARNING: Destination ${newName} already exists. Skipping.`);
            } else {
                fs.renameSync(oldPath, newPath);
                count++;
            }
        } catch (e) {
            console.error(`ERROR renaming ${file}: ${e.message}`);
        }
    }
});

console.log(`\nRenamed ${count} directories.`);
