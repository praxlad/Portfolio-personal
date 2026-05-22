# Personal Portfolio Website

A fast, highly polished, minimalist, and offline-first personal portfolio website.

## 🚀 Key Features

*   **Responsive Layout**: Scales flawlessly from mobile viewports to wide desktop monitors.
*   **Light & Night Themes**: Simple, elegant, and respects system preferences.
*   **Offline-First Resilience**: Integrated Service Worker (`sw.js`) for fast page loads and offline support.
*   **Flexible Contact Forms**: Built-in tabs supporting direct message notifications and secure database entries.

## 🛠️ Markdown Compilation

This website uses a Markdown-driven compilation engine. All profile details are loaded from a shared `data.md` file. 

To recompile the website after updating your text in `data.md`:

```powershell
python build.py
```

This single command automatically compiles and updates both the minimalist landing page (`index.html`) and the nested animated blueprint portfolio (`x01/index.html`).

## 💻 Local Preview

To preview the website locally and verify all offline assets and caching, start a local server:

```powershell
python -m http.server 8000
```

Then visit `http://localhost:8000` in your web browser.
