# Welcome to My Personal Portfolio & Systems Sandbox!

Hello! I am Prahlad. This repository hosts my personal developer portfolio and systems engineering sandbox. 

I designed and engineered this custom website from scratch to showcase my background in mechanical engineering, supply chain strategic sourcing, and technical web design. Rather than using rigid templates or site-builders, I wanted to build a fast, offline-first, custom dual-edition portfolio that runs on a custom markdown compilation engine.

---

## 🎨 Dual Portfolio Editions I Designed

### 🌿 1. Clean Minimalist Edition (Root)
* **My Goal:** To deliver a clean, fast, and high-readability layout focused on text structure and professional experience.
* **Key Features:** Designed with responsive, beautiful glassmorphism theme toggles (Dark and Light modes) that seamlessly adapt to browser/system preferences.
* **Live View:** [praxlad.github.io/Portfolio-personal/](https://praxlad.github.io/Portfolio-personal/)

### ⚡ 2. Interactive Animated Blueprint Edition (`/x01/`)
* **My Goal:** A highly visual, operations-themed interactive blueprint representing complex supply chain and strategic sourcing networks.
* **Key Features:** Features cyan, green, and pink neon-glowing SVG paths and dynamic vibration nodes. 
* **Performance Engineering:** To make sure my mobile visitors enjoy a smooth page experience, I wrote the animation engine to automatically detect screen sizes and **shut down the JavaScript calculation loops on mobile devices** (<768px). On desktop, it is hardware-accelerated (`translate3d`) to run at a rock-solid, buttery-smooth **60 FPS**.
* **Live View:** [praxlad.github.io/Portfolio-personal/x01/](https://praxlad.github.io/Portfolio-personal/x01/)

---

## 🛠️ How I Built the Architecture & Tech Stack

I custom-coded this entire system using vanilla web technologies and automated scripting:

### 1. The Core Frontend
* **Markup & Structure:** Clean, semantic HTML5.
* **Styling:** Custom Vanilla CSS3. I engineered flexible grid layouts and responsive media queries (including horizontal scrolling lists for ultra-narrow mobile viewports) without using massive styling frameworks.
* **Animation Math:** Modern ES6+ JavaScript. I wrote decoupled trigonometric wave equations to compute organic vector path drifts and high-frequency node sways dynamically.

### 2. My Markdown-Driven Compiler System
* To avoid duplicating my profile details, experience highlights, and projects across both templates, I engineered a **single source of truth** in [data.md](data.md).
* I wrote a custom compilation script in Python ([build.py](build.py)). When executed, it reads the markdown database, parses the sections, compiles both the minimalist landing page and the animated blueprint layout using clean templates, and automatically calibrates relative project paths.

### 3. PWA Capabilities & Offline Caching
* I integrated a Cache-First Service Worker ([sw.js](sw.js)). It pre-caches all shell styles and scripts so my portfolio loads instantaneously and runs 100% offline.
* Added a custom offline status badge in the footer that tracks connection states in real time.

### 4. Messaging & Secure Database Channels
* **Direct Messages:** Integrated Formspree endpoint integrations with custom monthly limits alert warnings.
* **Secure Notes Database:** A completely free, unlimited database connection connected to a private Google Sheet. It routes anonymously through a Google Apps Script Web App and features visually simulated public-key encryption (RSA-4096) console animations.

---

## 📁 Repository Structure Overview

Here is how I organized the codebase directories:

* `/x01/` - My interactive animated blueprint layout files.
* `/projects/` - Showcase directories for my engineered tools (including my **Supply Chain Scorecard Dashboard** and my **Open-Source Exam Platform**).
* `/hosting/` - Step-by-step instructions for setting up custom GitHub Pages deployments.
* `data.md` - My core profile content database.
* `build.py` - My Python compilation script.
* `sw.js` - My offline caching Service Worker.

---

*Thank you for visiting my sandbox! Feel free to explore the folders and take a look at the codebase[ignore any issues for now im still building] to see how it all works behind the scenes.*
