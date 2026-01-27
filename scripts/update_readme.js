const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '../skills');
const readmePath = path.join(__dirname, '../README.md');

// Helper to look for SKILL.md files recursively
function findSkillFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findSkillFiles(filePath, fileList);
        } else if (file === 'SKILL.md') {
            fileList.push(filePath);
        }
    });

    return fileList;
}

// Helper to parse frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const frontmatter = {};
    const lines = match[1].split('\n');

    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            frontmatter[key.trim()] = valueParts.join(':').trim();
        }
    });

    return frontmatter;
}

function main() {
    console.log('Scanning for skills...');
    const skillFiles = findSkillFiles(skillsDir);

    let readmeContent = '# Set of skills by @rodydavis\n\n';

    skillFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const frontmatter = parseFrontmatter(content);

        if (frontmatter && frontmatter.name) {
            console.log(`Found skill: ${frontmatter.name}`);

            readmeContent += `### ${frontmatter.name}\n`;
            if (frontmatter.description) {
                readmeContent += `${frontmatter.description}\n\n`;
            }

            readmeContent += '```bash\n';
            readmeContent += `npx skills add rodydavis/${frontmatter.name}\n`;
            readmeContent += '```\n\n';
        }
    });

    console.log('Updating README.md...');
    fs.writeFileSync(readmePath, readmeContent);
    console.log('Done!');
}

main();
