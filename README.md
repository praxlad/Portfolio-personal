# Prahladraj — Procurement & Strategic Sourcing Portfolio

A fast, highly polished, ultra-minimalist, and offline-first personal portfolio website. Built specifically for **Prahladraj**, custom-tailored for a high-impact role as a **Procurement & Strategic Sourcing Analyst / Procurement Engineer**.

Crafted entirely with pure semantic HTML5, clean variable-driven CSS3, and minimal vanilla JavaScript. It is designed to be extremely lightweight, loading in under a fraction of a second, with zero-dependency system fonts and full offline availability.

## 🚀 Key Features

*   **Soothing Light & Night Themes**: Simple, elegant toggle icon on the navigation header. Dynamically respects system level preferences (`prefers-color-scheme`) and persists choices via `localStorage`.
*   **Tailored Sourcing Analytics Persona**: Pre-populated with rich, real-world Accenture procurement engineering experience, core sourcing competency tag clouds, and specific procurement analysis dashboards.
*   **True Offline-First Resilience**: An integrated Service Worker (`sw.js`) automatically caches page assets (HTML, CSS, JS) on first visit, enabling instant load times and offline execution on subsequent visits.
*   **Formspree Form Integration**: Instant client-side contact form submissions sent straight to your email inbox, requiring zero backend servers or complicated client side setups.
*   **Minimal Font Latency**: Powered by a highly-curated native system font stack to prevent render-blocking delays, ensuring instant layout loads on poor network speeds.
*   **100% Responsive Grid**: Scales flawlessly from smart watches and small mobile viewports (320px) up to ultra-wide desktop monitors.

---

## 🛠️ Configuration & Customization Guide

Your portfolio has been completely written and optimized with your professional credentials. To make it operational, you only need to perform two quick setups:

### 1. (Optional) Configure or Add Projects
You can expand or substitute the showcase entries inside `<section id="projects">`:
```html
<div class="project-row">
    <div class="project-info">
        <h3 class="project-name">Your New Project Title</h3>
        <p class="project-desc">A brief, high-impact description of what you designed or built.</p>
        <div class="project-tags">
            <span class="project-tag">HTML5</span>
            <span class="project-tag">CSS3</span>
        </div>
    </div>
    <div class="project-link-container">
        <a href="Your-GitHub-Repository-URL" target="_blank" rel="noopener noreferrer" class="project-link">
            <span>Code</span>
            <svg>...</svg>
        </a>
    </div>
</div>
```

### 2. Connect Contact Form (Formspree Setup)
To receive emails directly from your contact form:
1.  Go to [Formspree](https://formspree.io) and sign up for a free account.
2.  Create a new form named **"Portfolio Contact"** and set your preferred target email address.
3.  Formspree will generate a unique endpoint URL resembling `https://formspree.io/f/xbjnyqrz`.
4.  Open `index.html` and replace `https://formspree.io/f/YOUR_ENDPOINT_HERE` inside the `<form>` element action tag:
    ```html
    <form id="contact-form" action="https://formspree.io/f/xbjnyqrz" method="POST" class="contact-form">
    ```
5.  Save your files. That's it! Any message sent will now land directly in your email inbox.

---

## 💻 Markdown Compilation & Local Development

This portfolio uses a premium **Markdown-driven layout compilation engine**. Your entire profile, skills matrix, credentials, and upcoming projects are stored in [data.md](file:///C:/Users/m.prahladraj.badiger/.gemini/antigravity/scratch/portfolio-site/data.md). If you edit the markdown file, you can compile and preview the actual site instantly:

### 1. Manual Compilation
To compile your latest edits into `index.html` at any time, run the builder:
```bash
# Python Compiler (Recommended)
python build.py

# Node.js Compiler (Alternate)
node build.js
```

### 2. Auto-Compiler Watcher (Highly Recommended)
To make your edits reflect on the site in real-time on every save, run the local file watcher in the background. It will automatically recompile and update `index.html` in milliseconds whenever you edit `data.md` or `template.html`:
```bash
# Start Python File Watcher
python watch.py

# Start Node.js File Watcher (if Node is installed)
node watch.js
```
Simply keep this terminal open and refresh your browser page to see your changes instantly.

### 3. How to Run Locally
Because this project generates standard static web outputs, you don't need any complex local servers:
1.  Double-click `index.html` to open it inside any browser.
2.  To verify the **Service Worker caching** and offline capabilities, run it on a simple local web server:
    *   *If using Terminal/Command Prompt*:
        ```bash
        # Python 3
        python -m http.server 8000
        ```
        Then, open `http://localhost:8000` in your web browser.

---

## 🌐 Free Hosting Deployment on GitHub Pages

GitHub Pages will host your website for free with a secure HTTPS connection.
1.  Log in to your [GitHub Account](https://github.com).
2.  Create a new repository. You have two options:
    *   **Root Domain Portfolio**: Name your repository EXACTLY `yourusername.github.io` (replace `yourusername` with your actual GitHub username). Your site will be live at `https://yourusername.github.io`.
    *   **Subfolder Portfolio**: Name your repository something like `portfolio`. Your site will be live at `https://yourusername.github.io/portfolio`.
3.  Upload or commit all portfolio files (`index.html`, `style.css`, `app.js`, `sw.js`, `README.md`) to the main branch of your repository.
4.  Go to your repository settings page: **Settings** -> **Pages** (on the left menu bar).
5.  Under **Build and deployment**:
    *   Source: Select **"Deploy from a branch"**.
    *   Branch: Select **`main`** (or `master`) and folder **`/ (root)`**.
    *   Click **Save**.
6.  Wait 1–2 minutes, and your site will be live!
