/**
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

    let readmeContent = '# Agent Skills by @rodydavis\n\n';

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
