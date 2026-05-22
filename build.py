import os
import re
import html

# Path Constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(SCRIPT_DIR, "data.md")
TEMPLATE_PATH = os.path.join(SCRIPT_DIR, "template.html")
OUTPUT_PATH = os.path.join(SCRIPT_DIR, "index.html")

def escape_html(text):
    return html.escape(text.strip())

def parse_profile(section_text):
    profile = {}
    lines = section_text.strip().split("\n")
    about_started = False
    about_paragraphs = []
    
    for line in lines:
        if about_started:
            if line.strip():
                about_paragraphs.append(f"<p>{escape_html(line)}</p>")
            continue
            
        if line.startswith("Name:"):
            profile["Name"] = line.replace("Name:", "").strip()
        elif line.startswith("Title:"):
            profile["Title"] = line.replace("Title:", "").strip()
        elif line.startswith("Tagline:"):
            profile["Tagline"] = line.replace("Tagline:", "").strip()
        elif line.startswith("About:"):
            about_started = True
            about_body = line.replace("About:", "").strip()
            if about_body:
                about_paragraphs.append(f"<p>{escape_html(about_body)}</p>")
                
    profile["About"] = "\n".join(about_paragraphs)
    return profile

def parse_skills(section_text):
    # Split skills by ## categories
    categories = re.split(r'\n##\s+', '\n' + section_text.strip())
    skills_html = []
    
    for category in categories:
        if not category.strip() or category.startswith("#"):
            continue
        
        lines = category.strip().split("\n")
        title = lines[0].strip()
        skills = []
        
        for line in lines[1:]:
            line_str = line.strip()
            if line_str.startswith("- ") or line_str.startswith("* "):
                skill_name = line_str[2:].strip()
                skills.append(f'<span class="skill-pill">{escape_html(skill_name)}</span>')
                
        if skills:
            skills_joined = "\n                        ".join(skills)
            skills_html.append(f"""
                        <div class="skills-category-card">
                            <h3 class="skills-category-title">{escape_html(title)}</h3>
                            <div class="skills-category-grid">
                                {skills_joined}
                            </div>
                        </div>""")
            
    return "\n".join(skills_html)

def parse_projects(section_text):
    projects = re.split(r'\n##\s+', '\n' + section_text.strip())
    projects_html = []
    
    for project in projects:
        if not project.strip() or project.startswith("#"):
            continue
            
        lines = project.strip().split("\n")
        title = lines[0].strip()
        meta = {"Type": "Project", "Link": "#", "Tags": [], "Status": ""}
        desc_elements = []
        in_list = False
        
        for line in lines[1:]:
            line_str = line.strip()
            if line_str.startswith("### Type:"):
                meta["Type"] = line_str.replace("### Type:", "").strip()
            elif line_str.startswith("### Link:"):
                meta["Link"] = line_str.replace("### Link:", "").strip()
            elif line_str.startswith("### Status:"):
                meta["Status"] = line_str.replace("### Status:", "").strip()
            elif line_str.startswith("### Tags:"):
                tags_str = line_str.replace("### Tags:", "").strip()
                meta["Tags"] = [t.strip() for t in tags_str.split(",") if t.strip()]
            elif line_str:
                if line_str.startswith("- ") or line_str.startswith("* "):
                    if not in_list:
                        desc_elements.append('<ul class="project-bullets">')
                        in_list = True
                    bullet_text = line_str[2:].strip()
                    bullet_parsed = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', escape_html(bullet_text))
                    desc_elements.append(f'<li>{bullet_parsed}</li>')
                else:
                    if in_list:
                        desc_elements.append('</ul>')
                        in_list = False
                    text_parsed = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', escape_html(line_str))
                    desc_elements.append(f'<p class="project-desc-para">{text_parsed}</p>')
                    
        if in_list:
            desc_elements.append('</ul>')
            
        description = "\n".join(desc_elements)
        
        # Tags HTML
        tags_html = ""
        if meta["Tags"]:
            tags_html = "\n                                    ".join([f'<span class="project-tag">{escape_html(t)}</span>' for t in meta["Tags"]])
            tags_html = f"""<div class="project-tags">
                                    {tags_html}
                                </div>"""
            
        # Link Action HTML
        if meta["Link"] == "#":
            status_text = meta["Status"] if meta["Status"] else "Analytics Model"
            if status_text.lower() == "loading":
                link_html = f'<span class="project-status-badge loading"><span class="spinner"></span>{escape_html(status_text)}</span>'
            else:
                link_html = f'<span class="project-status-badge">{escape_html(status_text)}</span>'
        else:
            link_html = f"""<a href="{escape_html(meta['Link'])}" class="project-link-btn">
                                    <span>Launch Site</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="project-link-icon"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                                </a>"""
            
        projects_html.append(f"""
                        <div class="project-row">
                            <div class="project-info">
                                <div class="project-meta-row">
                                    <span class="project-type-badge">{escape_html(meta['Type'])}</span>
                                </div>
                                <h3 class="project-name">{escape_html(title)}</h3>
                                <div class="project-desc">{description}</div>
                                {tags_html}
                            </div>
                            <div class="project-link-container">
                                {link_html}
                            </div>
                        </div>""")
        
    return "\n".join(projects_html)

def parse_experience(section_text):
    roles = re.split(r'\n##\s+', '\n' + section_text.strip())
    roles_html = []
    
    for role in roles:
        if not role.strip() or role.startswith("#"):
            continue
            
        lines = role.strip().split("\n")
        title = lines[0].strip()
        meta = {"Company": "Accenture", "Period": "", "Highlights": []}
        highlights_mode = False
        
        for line in lines[1:]:
            line_str = line.strip()
            if line_str.startswith("### Company:"):
                meta["Company"] = line_str.replace("### Company:", "").strip()
            elif line_str.startswith("### Period:"):
                meta["Period"] = line_str.replace("### Period:", "").strip()
            elif line_str.startswith("### Highlights:"):
                highlights_mode = True
            elif highlights_mode and (line_str.startswith("- ") or line_str.startswith("* ")):
                bullet = line_str[2:].strip()
                # Parse bold syntax **text** within bullet highlights
                bullet_parsed = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', escape_html(bullet))
                meta["Highlights"].append(f"<li>{bullet_parsed}</li>")
                
        highlights_joined = "\n                            ".join(meta["Highlights"])
        roles_html.append(f"""
                        <div class="timeline-item">
                            <div class="timeline-dot"></div>
                            <div class="timeline-header" style="margin-bottom: 0.25rem;">
                                <h3 class="timeline-title">{escape_html(meta['Company'])}</h3>
                                <span class="timeline-date">{escape_html(meta['Period'])}</span>
                            </div>
                            <div class="timeline-role" style="font-size: 1.025rem; color: var(--accent-color); font-weight: 600; margin-bottom: 0.75rem;">{escape_html(title)}</div>
                            <ul class="timeline-bullets">
                                {highlights_joined}
                            </ul>
                        </div>""")
        
    return "\n".join(roles_html)

def parse_education(section_text):
    items = re.split(r'\n##\s+', '\n' + section_text.strip())
    education_html = []
    
    for item in items:
        if not item.strip() or item.startswith("#"):
            continue
            
        lines = item.strip().split("\n")
        title = lines[0].strip()
        meta = {"Institution": "", "Detail": "", "Bullets": []}
        
        for line in lines[1:]:
            line_str = line.strip()
            if line_str.startswith("### Institution:"):
                meta["Institution"] = line_str.replace("### Institution:", "").strip()
            elif line_str.startswith("### Detail:"):
                meta["Detail"] = line_str.replace("### Detail:", "").strip()
            elif line_str.startswith("- ") or line_str.startswith("* "):
                bullet = line_str[2:].strip()
                bullet_parsed = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', escape_html(bullet))
                meta["Bullets"].append(f"<li>{bullet_parsed}</li>")
                
        bullets_html = ""
        if meta["Bullets"]:
            bullets_joined = "\n                                ".join(meta["Bullets"])
            bullets_html = f"""<ul class="credential-bullets">
                                {bullets_joined}
                            </ul>"""
            
        institution_part = ""
        if meta["Institution"]:
            institution_part = f'<p class="education-card-institution">{escape_html(meta["Institution"])}</p>'
        
        detail_part = ""
        if meta["Detail"]:
            detail_part = f'<p class="education-card-detail">{escape_html(meta["Detail"])}</p>'
            
        education_html.append(f"""
                        <div class="education-card">
                            <h3 class="education-card-title">{escape_html(title)}</h3>
                            {institution_part}
                            {detail_part}
                            {bullets_html}
                        </div>""")
        
    return "\n".join(education_html)

def main():
    print("Compiling Prahladraj Creator Portfolio...")
    
    if not os.path.exists(DATA_PATH):
        print(f"Error: {DATA_PATH} not found.")
        return
        
    if not os.path.exists(TEMPLATE_PATH):
        print(f"Error: {TEMPLATE_PATH} not found.")
        return
        
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        md_content = f.read()
        
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        html_template = f.read()
        
    # Split MD content by heading sections
    sections = re.split(r'\n#\s+', '\n' + md_content)
    
    profile_data = {}
    skills_data = ""
    projects_data = ""
    experience_data = ""
    education_data = ""
    
    for sec in sections:
        sec_str = sec.strip()
        if not sec_str:
            continue
            
        title = sec_str.split("\n")[0].strip()
        body = "\n".join(sec_str.split("\n")[1:])
        
        if title == "Profile":
            profile_data = parse_profile(body)
        elif title == "Skills":
            skills_data = parse_skills(body)
        elif title == "Projects":
            projects_data = parse_projects(body)
        elif title == "Experience":
            experience_data = parse_experience(body)
        elif title == "Education & Credentials":
            education_data = parse_education(body)
            
    # Inject placeholders into template
    output_html = html_template
    output_html = output_html.replace("{{TITLE}}", profile_data.get("Title", "Portfolio"))
    output_html = output_html.replace("{{HERO_NAME}}", profile_data.get("Name", "Prahlad"))
    output_html = output_html.replace("{{HERO_TAGLINE}}", profile_data.get("Tagline", ""))
    output_html = output_html.replace("{{ABOUT_TEXT}}", profile_data.get("About", ""))
    output_html = output_html.replace("{{SKILLS_GRID}}", skills_data)
    output_html = output_html.replace("{{PROJECTS_GRID}}", projects_data)
    output_html = output_html.replace("{{EXPERIENCE_TIMELINE}}", experience_data)
    output_html = output_html.replace("{{EDUCATION_CARDS}}", education_data)
    
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write(output_html)
        
    print(f"Compilation Successful! Saved to {OUTPUT_PATH}")

    # Automatically compile the nested x01 animated blueprint portfolio as well
    x01_build_path = os.path.join(SCRIPT_DIR, "x01", "build.py")
    if os.path.exists(x01_build_path):
        print("\n[Builder] Detected nested x01 animated blueprint portfolio. Compiling it...")
        try:
            import subprocess
            subprocess.run(["python", x01_build_path], check=True)
        except Exception as e:
            print(f"[Builder] Error compiling nested x01 portfolio: {e}")

if __name__ == "__main__":
    main()
