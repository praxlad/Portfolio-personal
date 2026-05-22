# Portfolio Hosting Guide: GitHub Pages vs. Google Sites

This guide helps you choose the best hosting platform for your creator portfolio and provides step-by-step instructions to get your merged site live.

---

## 📊 Google Sites vs. GitHub Pages: Which is Better?

For a custom-engineered, premium developer portfolio like yours, **GitHub Pages is significantly better**. Here is a detailed breakdown of why:

| Feature | Google Sites | GitHub Pages |
| :--- | :--- | :--- |
| **Custom HTML/CSS/JS** | 🛑 **Very Poor** (Runs inside isolated sandboxed `<iframe>` tags) |  **Excellent** (Serves files directly to the browser natively) |
| **Vibrant Animations & Canvas** | 🛑 **Broken** (Sandboxed iframes restrict background canvas drawings and smooth cursor events) |  **Flawless** (The interactive Sourcing Network vectors in your Blueprint Edition will render with 100% fluid performance) |
| **Responsive & Sticky Layouts** | 🛑 **Broken** (Iframe borders clip layout overflow, breaking `position: sticky` and viewport `vh`/`vw` units) |  **Perfect** (Clean relative positioning works perfectly on all mobile and desktop devices) |
| **Service Worker & PWA Support** | 🛑 **No Support** (No custom Service Worker registration is allowed inside Google's sandboxed host) |  **Full Support** (HTTPS by default, enabling `sw.js` to cache files offline successfully) |
| **Custom Domain Support** |  Yes (Requires complex DNS verification inside Google Console) |  **Yes** (Simple CNAME configuration with automatic free Let's Encrypt SSL certificates) |
| **Cost** |  Free |  **100% Free** |

> [!IMPORTANT]
> **The Verdict:** Google Sites is meant for basic, template-based text pages. Because your portfolio features a custom Python compilation system, advanced glassmorphism CSS, and interactive Canvas/SVG animations, **hosting on Google Sites will completely break your site's aesthetics and interactions**. **GitHub Pages** is the standard, industry-approved choice that will display your work exactly as intended.

---

## 🚀 Step-by-Step Guide: Deploying to GitHub Pages

Since your site contains a nested compilation structure, follow these steps to compile both editions and deploy them together.

### 1. Compile Both Portfolio Editions Locally
Before pushing to GitHub, you need to compile the latest changes from your shared `data.md` file into the HTML files:

1. Open a terminal in the root of your `portfolio-site/` folder.
2. Compile the **Clean Minimalist (Original) Portfolio**:
   ```bash
   python build.py
   ```
3. Compile the **Animated Blueprint (x01) Portfolio**:
   ```bash
   cd x01
   python build.py
   cd ..
   ```

Now both `index.html` (at the root) and `x01/index.html` are compiled and fully loaded with the same text details from your shared `data.md`.

---

### 2. Initialize a Git Repository
If you haven't initialized git in your project directory:

```bash
# Initialize git
git init

# (Optional) Create a .gitignore to exclude build caching scripts if you want
# Otherwise, we want to make sure your HTML files, styles, assets, and project pages are tracked.
```

---

### 3. Commit Your Files
Add all files, templates, styles, and the pre-compiled projects to your repository:

```bash
# Add all files to the staging area
git add .

# Create your first commit
git commit -m "feat: merge animated blueprint portfolio and shared-data compiler architecture"
```

---

### 4. Push to GitHub
1. Go to [GitHub](https://github.com) and log in.
2. Create a new repository named `portfolio` (or your preferred name). Leave it **Public** and do not initialize with a README.
3. Link your local project to the GitHub repository and push:
   ```bash
   # Replace your-username with your actual GitHub username!
   git remote add origin https://github.com/your-username/portfolio.git
   git branch -M main
   git push -u origin main
   ```

---

### 5. Enable GitHub Pages
Once your code is pushed, enabling the website takes only a few clicks:

1. Open your repository on GitHub.
2. Click on the **Settings** tab in the top navigation bar.
3. In the left sidebar under the **Code and automation** section, click on **Pages**.
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Click the dropdown, select `main`, and keep the folder as `/ (root)`.
   - Click **Save**.
5. Wait about 1-2 minutes. Refresh the page, and GitHub will display a notification at the top:
   > 🚀 **Your site is live at:** `https://your-username.github.io/portfolio/`

---

## 🔗 Shared Codebase Navigation Flow

Once hosted, your visitors will experience a seamless, integrated, and bidirectional flow between both editions:

1. **Clean Minimalist Landing Page:** When visitors land on `https://your-username.github.io/portfolio/`, they see the clean version. Under your introduction, they'll see:
   > ✨ Want to see something cool? [Explore the Animated Blueprint Edition ⚡](x01/index.html)
2. **Animated Blueprint Page:** Clicking the link takes them to `https://your-username.github.io/portfolio/x01/` where they see the full vector-interactive blueprint. Under that hero section, they'll see:
   > 🌿 Want to see the original? [Switch to the Clean Minimalist Edition 🌿](../index.html)
3. **Shared Projects Folder:** Both editions successfully share resources. A project link clicked in either edition points directly to the parent directory's `/projects/` folder without breaking paths or requiring duplicated code.
