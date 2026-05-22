const fs = require('fs');
const path = require('path');

// Path Constants
const DATA_PATH = path.join(__dirname, 'data.md');
const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const OUTPUT_PATH = path.join(__dirname, 'index.html');

function escapeHtml(text) {
    if (!text) return '';
    return text.trim()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function parseProfile(sectionText) {
    const profile = {};
    const lines = sectionText.trim().split('\n');
    let aboutStarted = false;
    const aboutParagraphs = [];

    for (const line of lines) {
        if (aboutStarted) {
            if (line.trim()) {
                aboutParagraphs.push(`<p>${escapeHtml(line)}</p>`);
            }
            continue;
        }

        if (line.startsWith('Name:')) {
            profile.Name = line.replace('Name:', '').trim();
        } else if (line.startsWith('Title:')) {
            profile.Title = line.replace('Title:', '').trim();
        } else if (line.startsWith('Tagline:')) {
            profile.Tagline = line.replace('Tagline:', '').trim();
        } else if (line.startsWith('About:')) {
            aboutStarted = true;
            const aboutBody = line.replace('About:', '').trim();
            if (aboutBody) {
                aboutParagraphs.push(`<p>${escapeHtml(aboutBody)}</p>`);
            }
        }
    }

    profile.About = aboutParagraphs.join('\n');
    return profile;
}

function parseSkills(sectionText) {
    // Split skills by ## categories
    const categories = ('\n' + sectionText.trim()).split(/\n##\s+/);
    const skillsHtml = [];

    for (const category of categories) {
        if (!category.trim() || category.startsWith('#')) continue;

        const lines = category.trim().split('\n');
        const title = lines[0].trim();
        const skills = [];

        for (let i = 1; i < lines.length; i++) {
            const lineStr = lines[i].trim();
            if (lineStr.startsWith('- ') || lineStr.startsWith('* ')) {
                const skillName = lineStr.substring(2).trim();
                skills.push(`<span class="skill-pill">${escapeHtml(skillName)}</span>`);
            }
        }

        if (skills.length > 0) {
            const skillsJoined = skills.join('\n                                ');
            skillsHtml.push(`
                        <div class="skills-category-card">
                            <h3 class="skills-category-title">${escapeHtml(title)}</h3>
                            <div class="skills-category-grid">
                                ${skillsJoined}
                            </div>
                        </div>`);
        }
    }

    return skillsHtml.join('\n');
}

function parseProjects(sectionText) {
    const projects = ('\n' + sectionText.trim()).split(/\n##\s+/);
    const projectsHtml = [];

    for (const project of projects) {
        if (!project.trim() || project.startsWith('#')) continue;

        const lines = project.trim().split('\n');
        const title = lines[0].trim();
        const meta = { Type: 'Project', Link: '#', Tags: [], Status: '' };
        const descElements = [];
        let inList = false;

        for (let i = 1; i < lines.length; i++) {
            const lineStr = lines[i].trim();
            if (lineStr.startsWith('### Type:')) {
                meta.Type = lineStr.replace('### Type:', '').trim();
            } else if (lineStr.startsWith('### Link:')) {
                meta.Link = lineStr.replace('### Link:', '').trim();
            } else if (lineStr.startsWith('### Status:')) {
                meta.Status = lineStr.replace('### Status:', '').trim();
            } else if (lineStr.startsWith('### Tags:')) {
                const tagsStr = lineStr.replace('### Tags:', '').trim();
                meta.Tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
            } else if (lineStr) {
                if (lineStr.startsWith('- ') || lineStr.startsWith('* ')) {
                    if (!inList) {
                        descElements.push('<ul class="project-bullets">');
                        inList = true;
                    }
                    const bulletText = lineStr.substring(2).trim();
                    const bulletParsed = escapeHtml(bulletText).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    descElements.push(`<li>${bulletParsed}</li>`);
                } else {
                    if (inList) {
                        descElements.push('</ul>');
                        inList = false;
                    }
                    const textParsed = escapeHtml(lineStr).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    descElements.push(`<p class="project-desc-para">${textParsed}</p>`);
                }
            }
        }

        if (inList) {
            descElements.push('</ul>');
        }

        const description = descElements.join('\n');

        // Tags HTML
        let tagsHtml = '';
        if (meta.Tags.length > 0) {
            const tagsJoined = meta.Tags.map(t => `<span class="project-tag">${escapeHtml(t)}</span>`).join('\n                                    ');
            tagsHtml = `<div class="project-tags">
                                    ${tagsJoined}
                                </div>`;
        }

        // Link Action HTML
        let linkHtml = '';
        if (meta.Link === '#') {
            const statusText = meta.Status ? meta.Status : 'Analytics Model';
            if (statusText.toLowerCase() === 'loading') {
                linkHtml = `<span class="project-status-badge loading"><span class="spinner"></span>${escapeHtml(statusText)}</span>`;
            } else {
                linkHtml = `<span class="project-status-badge">${escapeHtml(statusText)}</span>`;
            }
        } else {
            linkHtml = `<a href="${escapeHtml(meta.Link)}" class="project-link-btn">
                                    <span>Launch Site</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="project-link-icon"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                                </a>`;
        }

        projectsHtml.push(`
                        <div class="project-row">
                            <div class="project-info">
                                <div class="project-meta-row">
                                    <span class="project-type-badge">${escapeHtml(meta.Type)}</span>
                                </div>
                                <h3 class="project-name">${escapeHtml(title)}</h3>
                                <div class="project-desc">${description}</div>
                                ${tagsHtml}
                            </div>
                            <div class="project-link-container">
                                ${linkHtml}
                            </div>
                        </div>`);
    }

    return projectsHtml.join('\n');
}

function parseExperience(sectionText) {
    const roles = ('\n' + sectionText.trim()).split(/\n##\s+/);
    const rolesHtml = [];

    for (const role of roles) {
        if (!role.trim() || role.startsWith('#')) continue;

        const lines = role.trim().split('\n');
        const title = lines[0].trim();
        const meta = { Company: 'Accenture', Period: '', Highlights: [] };
        let highlightsMode = false;

        for (let i = 1; i < lines.length; i++) {
            const lineStr = lines[i].trim();
            if (lineStr.startsWith('### Company:')) {
                meta.Company = lineStr.replace('### Company:', '').trim();
            } else if (lineStr.startsWith('### Period:')) {
                meta.Period = lineStr.replace('### Period:', '').trim();
            } else if (lineStr.startsWith('### Highlights:')) {
                highlightsMode = true;
            } else if (highlightsMode && (lineStr.startsWith('- ') || lineStr.startsWith('* '))) {
                const bullet = lineStr.substring(2).trim();
                const bulletParsed = escapeHtml(bullet).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                meta.Highlights.push(`<li>${bulletParsed}</li>`);
            }
        }

        const highlightsJoined = meta.Highlights.join('\n                                ');
        rolesHtml.push(`
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-header">
                                <h3 class="timeline-title">${escapeHtml(title)} <span class="timeline-company">@ ${escapeHtml(meta.Company)}</span></h3>
                                <span class="timeline-date">${escapeHtml(meta.Period)}</span>
                            </div>
                            <ul class="timeline-bullets">
                                ${highlightsJoined}
                            </ul>
                        </div>`);
    }

    return rolesHtml.join('\n');
}

function parseEducation(sectionText) {
    const items = ('\n' + sectionText.trim()).split(/\n##\s+/);
    const educationHtml = [];

    for (const item of items) {
        if (!item.trim() || item.startsWith('#')) continue;

        const lines = item.trim().split('\n');
        const title = lines[0].trim();
        const meta = { Institution: '', Detail: '', Bullets: [] };

        for (let i = 1; i < lines.length; i++) {
            const lineStr = lines[i].trim();
            if (lineStr.startsWith('### Institution:')) {
                meta.Institution = lineStr.replace('### Institution:', '').trim();
            } else if (lineStr.startsWith('### Detail:')) {
                meta.Detail = lineStr.replace('### Detail:', '').trim();
            } else if (lineStr.startsWith('- ') || lineStr.startsWith('* ')) {
                const bullet = lineStr.substring(2).trim();
                const bulletParsed = escapeHtml(bullet).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                meta.Bullets.push(`<li>${bulletParsed}</li>`);
            }
        }

        let bulletsHtml = '';
        if (meta.Bullets.length > 0) {
            const bulletsJoined = meta.Bullets.join('\n                                ');
            bulletsHtml = `<ul class="credential-bullets">
                                ${bulletsJoined}
                            </ul>`;
        }

        let institutionPart = '';
        if (meta.Institution) {
            institutionPart = `<p class="education-card-institution">${escapeHtml(meta.Institution)}</p>`;
        }

        let detailPart = '';
        if (meta.Detail) {
            detailPart = `<p class="education-card-detail">${escapeHtml(meta.Detail)}</p>`;
        }

        educationHtml.push(`
                        <div class="education-card">
                            <h3 class="education-card-title">${escapeHtml(title)}</h3>
                            ${institutionPart}
                            ${detailPart}
                            ${bulletsHtml}
                        </div>`);
    }

    return educationHtml.join('\n');
}

function main() {
    console.log("Compiling Prahladraj Creator Portfolio using Node.js...");

    if (!fs.existsSync(DATA_PATH)) {
        console.error(`Error: ${DATA_PATH} not found.`);
        return;
    }

    if (!fs.existsSync(TEMPLATE_PATH)) {
        console.error(`Error: ${TEMPLATE_PATH} not found.`);
        return;
    }

    const mdContent = fs.readFileSync(DATA_PATH, 'utf8');
    const htmlTemplate = fs.readFileSync(TEMPLATE_PATH, 'utf8');

    // Split MD content by heading sections
    const sections = ('\n' + mdContent).split(/\n#\s+/);

    let profileData = {};
    let skillsData = '';
    let projectsData = '';
    let experienceData = '';
    let educationData = '';

    for (const sec of sections) {
        const secStr = sec.trim();
        if (!secStr) continue;

        const lines = secStr.split('\n');
        const title = lines[0].trim();
        const body = lines.slice(1).join('\n');

        if (title === 'Profile') {
            profileData = parseProfile(body);
        } else if (title === 'Skills') {
            skillsData = parseSkills(body);
        } else if (title === 'Projects') {
            projectsData = parseProjects(body);
        } else if (title === 'Experience') {
            experienceData = parseExperience(body);
        } else if (title === 'Education & Credentials') {
            educationData = parseEducation(body);
        }
    }

    // Inject placeholders into template
    let outputHtml = htmlTemplate;
    outputHtml = outputHtml.replace(/\{\{TITLE\}\}/g, profileData.Title || 'Portfolio');
    outputHtml = outputHtml.replace(/\{\{HERO_NAME\}\}/g, profileData.Name || 'Prahlad');
    outputHtml = outputHtml.replace(/\{\{HERO_TAGLINE\}\}/g, profileData.Tagline || '');
    outputHtml = outputHtml.replace(/\{\{ABOUT_TEXT\}\}/g, profileData.About || '');
    outputHtml = outputHtml.replace(/\{\{SKILLS_GRID\}\}/g, skillsData);
    outputHtml = outputHtml.replace(/\{\{PROJECTS_GRID\}\}/g, projectsData);
    outputHtml = outputHtml.replace(/\{\{EXPERIENCE_TIMELINE\}\}/g, experienceData);
    outputHtml = outputHtml.replace(/\{\{EDUCATION_CARDS\}\}/g, educationData);

    fs.writeFileSync(OUTPUT_PATH, outputHtml, 'utf8');
    console.log(`Compilation Successful! Saved to ${OUTPUT_PATH}`);
}

main();
