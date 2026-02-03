const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
});

const skillsDir = path.join(__dirname, '../skills');
const outputDir = path.join(__dirname, '../_site');
const baseHref = process.env.BASE_HREF || '/';

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Copy assets if any (none for now, but good practice)

// Theme Colors & Styles
const css = `
:root {
    --bg-color: oklch(0.15 0.02 260);
    --card-bg: oklch(0.2 0.03 260);
    --text-primary: oklch(0.95 0.01 260); /* Pearl White */
    --text-secondary: oklch(0.7 0.02 260); /* Silver-ish */
    --accent-blue: oklch(0.6 0.2 250); /* Electric Blue */
    --accent-glow: oklch(0.6 0.2 250 / 0.5);
    --border-color: oklch(0.3 0.05 260);
    --shining-silver: oklch(0.85 0.01 260);
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Outfit', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-primary);
    line-height: 1.6;
    overflow-x: hidden;
}

a {
    color: var(--accent-blue);
    text-decoration: none;
    transition: all 0.3s ease;
}

a:hover {
    text-shadow: 0 0 10px var(--accent-glow);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

header {
    text-align: center;
    margin-bottom: 3rem;
    padding: 2rem 0;
    border-bottom: 1px solid var(--border-color);
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, var(--bg-color) 100%);
}

h1 {
    font-size: 3rem;
    font-weight: 800;
    background: linear-gradient(to right, var(--text-primary), var(--accent-blue));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 2px;
}

h2, h3, h4, h5, h6 {
    color: var(--shining-silver);
    margin-top: 2rem;
    margin-bottom: 1rem;
}

/* Grid Layout */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
}

.skill-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
}

.skill-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, var(--accent-blue), var(--shining-silver));
    opacity: 0;
    transition: opacity 0.3s ease;
}

.skill-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px -10px var(--accent-glow);
    border-color: var(--accent-blue);
}

.skill-card:hover::before {
    opacity: 1;
}

.skill-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text-primary);
}

.skill-desc {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.btn {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: transparent;
    border: 1px solid var(--accent-blue);
    color: var(--accent-blue);
    border-radius: 6px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 0.8rem;
    transition: all 0.3s ease;
}

.btn:hover {
    background: var(--accent-blue);
    color: #fff;
    box-shadow: 0 0 15px var(--accent-glow);
}

/* Detail Page */
.detail-content {
    background-color: var(--card-bg);
    padding: 3rem;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 50px -20px #000;
}

.detail-content img {
    max-width: 100%;
    border-radius: 8px;
    margin: 1rem 0;
    border: 1px solid var(--border-color);
}

.detail-content pre {
    background-color: #0d0d0d;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    border: 1px solid var(--border-color);
    margin: 1.5rem 0;
}

.back-link {
    display: inline-block;
    margin-bottom: 2rem;
    color: var(--text-secondary);
    font-weight: 600;
}

.back-link:hover {
    color: var(--accent-blue);
    transform: translateX(-5px);
}

@media (max-width: 768px) {
    .container {
        padding: 1rem;
    }
    
    .detail-content {
        padding: 1.5rem;
    }

    h1 {
        font-size: 2rem;
    }
}

.install-block {
    background: #0d0d0d;
    padding: 1rem;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: monospace;
    color: var(--text-secondary);
}

.action-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
}

.copy-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--text-secondary);
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s;
}

.copy-btn:hover {
    border-color: var(--accent-blue);
    color: var(--accent-blue);
}

.nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.nav-header .back-link {
    margin-bottom: 0;
}

.gradient-btn {
    background: linear-gradient(90deg, var(--accent-blue), #9089fc);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.gradient-btn:hover {
    box-shadow: 0 0 15px var(--accent-glow);
    transform: translateY(-1px);
}

.gradient-btn:disabled, .copy-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}
`;

function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { frontmatter: {}, body: content };

    const frontmatter = {};
    const lines = match[1].split('\n');
    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            frontmatter[key.trim()] = valueParts.join(':').trim();
        }
    });

    const body = content.replace(match[0], '').trim();
    return { frontmatter, body };
}

function renderPage(title, content, isIndex = false, extra = {}) {
    // Note: The user manually updated this command in a previous step, preserving that change.
    const installCmd = `npx skills add rodydavis/skills --skill ${extra.skillPath}`;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <base href="${baseHref}">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        ${!isIndex ? `
        <div class="nav-header">
            <a href="." class="back-link">← Back to Skills</a>
            <button class="gradient-btn" onclick="copyMarkdown(this)">Copy as Markdown</button>
        </div>` : ''}
        ${isIndex ? `<header>
            <h1>Agent Skills</h1>
            <p style="color: var(--text-secondary); font-size: 1.2rem; opacity: 0.8; margin-bottom: 1.5rem;">by Rody Davis</p>
            <div class="install-block" style="display: flex; margin-bottom: 0; text-align: left;">
                <span id="index-install-cmd">npx skills add rodydavis/skills</span>
                <button class="copy-btn" onclick="copyInstall(this, 'index-install-cmd')">Copy</button>
            </div>
        </header>` : ''}

        ${!isIndex ? `
        <div class="install-block">
            <span id="install-cmd">${installCmd}</span>
            <button class="copy-btn" onclick="copyInstall(this, 'install-cmd')">Copy</button>
        </div>
        <div class="detail-content">
            ${content}
        </div>
        <textarea id="raw-markdown" style="display:none;">${extra.rawMarkdown}</textarea>` : `
        <main class="skills-grid">
            ${content}
        </main>
        <footer style="margin-top: 4rem; text-align: center; color: var(--text-secondary); padding-bottom: 2rem; border-top: 1px solid var(--border-color); padding-top: 2rem;">
            <a href="rss.xml" style="margin: 0 0.5rem;">RSS</a> • 
            <a href="https://github.com/rodydavis/skills" style="margin: 0 0.5rem;">GitHub</a>
        </footer>
        `}

        <script>
            function copyToClipboard(text, btn) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = '✅ Copied!';
                    btn.disabled = true;
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.disabled = false;
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            }
            function copyInstall(btn, elementId) {
                const text = document.getElementById(elementId).innerText;
                copyToClipboard(text, btn);
            }
            function copyMarkdown(btn) {
                const text = document.getElementById('raw-markdown').value;
                copyToClipboard(text, btn);
            }
        </script>
    </div>
</body>
</html>`;
}

// Generate Sitemap
function generateSitemap(skills) {
    const baseUrl = 'https://rodydavis.github.io/skills'; // Ideally derived from env or config
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    skills.forEach(skill => {
        xml += `
    <url>
        <loc>${baseUrl}/${skill.path}/</loc>
        <lastmod>${today}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    xml += `
</urlset>`;
    return xml;
}

// Generate RSS Feed
// Escape XML special characters
function escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function generateRSS(skills) {
    const baseUrl = 'https://rodydavis.github.io/skills';
    const now = new Date().toUTCString();

    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
    <title>Agent Skills</title>
    <link>${baseUrl}</link>
    <description>A collection of agent skills by Rody Davis.</description>
    <lastBuildDate>${now}</lastBuildDate>
    <language>en-us</language>`;

    skills.forEach(skill => {
        xml += `
    <item>
        <title>${escapeXml(skill.name)}</title>
        <link>${baseUrl}/${skill.path}/</link>
        <description>${escapeXml(skill.description)}</description>
        <guid>${baseUrl}/${skill.path}/</guid>
        <pubDate>${now}</pubDate>
    </item>`;
    });

    xml += `
</channel>
</rss>`;
    return xml;
}

function build() {
    console.log('Building site...');

    // Write CSS file
    fs.writeFileSync(path.join(outputDir, 'style.css'), css);
    console.log('Generated style.css');

    const skills = [];

    // 1. Scan and Parse Skills - Recursively
    function walk(dir) {
        const list = fs.readdirSync(dir);
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walk(filePath);
            } else if (file === 'SKILL.md') {
                const rawContent = fs.readFileSync(filePath, 'utf8');
                const { frontmatter, body } = parseFrontmatter(rawContent);
                const skillName = path.basename(path.dirname(filePath));

                skills.push({
                    name: frontmatter.name || skillName,
                    description: frontmatter.description || 'No description provided.',
                    path: skillName, // use folder name as path slug
                    content: body
                });
            }
        });
    }

    walk(skillsDir);

    // 2. Generate Skill Pages
    skills.forEach(skill => {
        const htmlContent = md.render(skill.content);
        const pageHtml = renderPage(skill.name, htmlContent, false, {
            skillPath: skill.path,
            rawMarkdown: skill.content
        });

        // Create directory for the skill page (prettier URLs: /skill-name/index.html)
        const skillOutputDir = path.join(outputDir, skill.path);
        if (!fs.existsSync(skillOutputDir)) {
            fs.mkdirSync(skillOutputDir, { recursive: true });
        }

        fs.writeFileSync(path.join(skillOutputDir, 'index.html'), pageHtml);
    });

    // 3. Generate Index Page
    const cardsHtml = skills.map(skill => `
        <article class="skill-card">
            <div>
                <h2 class="skill-title">${skill.name}</h2>
                <p class="skill-desc">${skill.description}</p>
            </div>
            <a href="${skill.path}/" class="btn">View Skill</a>
        </article>
    `).join('');

    const indexHtml = renderPage('Agent Skills', cardsHtml, true);
    fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

    // 4. Generate Sitemap & RSS
    fs.writeFileSync(path.join(outputDir, 'sitemap.xml'), generateSitemap(skills));
    fs.writeFileSync(path.join(outputDir, 'rss.xml'), generateRSS(skills));

    console.log(`Build complete! Generated ${skills.length} skill pages, sitemap, and RSS feed.`);
}

build();

