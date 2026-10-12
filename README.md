# Chris Stylianopoulos — Portfolio Website

A clean, minimal, single-page developer portfolio built with plain HTML, CSS, and JavaScript. No frameworks, no build tools — just open `index.html` in a browser or deploy straight to GitHub Pages.

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/chris-portfolio.git
cd chris-portfolio
# Open index.html in your browser — that's it.
```

## 📁 Structure

```
chris-portfolio/
├── index.html          ← All sections live here
├── css/
│   └── style.css       ← All styles (CSS variables at the top)
├── js/
│   └── main.js         ← Nav scroll, mobile menu, reveal animations
└── assets/             ← Put project screenshots here
    └── (images go here)
```

## ✏️ How to Customize

### 1. Update your info

Open `index.html` and search for the sections you want to edit:

- **Hero**: name, role, subtext, CTA links
- **About**: bio paragraph and stats
- **Experience**: job titles, companies, bullet points
- **Contact**: email, GitHub, LinkedIn, phone

### 2. Add your real projects

Find the three `<article class="project-card">` blocks in the `#work` section.

For each project, update:

- `project-type` — your tech stack
- `project-title` — project name
- `project-desc` — 2–3 sentence description
- `project-tags` — tech badges
- `.btn-link` hrefs — live site and GitHub URLs

**To show a screenshot instead of the placeholder:**
Replace the `<div class="project-thumb project-thumb-placeholder">` block with:

```html
<div class="project-thumb">
  <img src="assets/project-one.jpg" alt="Project One screenshot" />
</div>
```

Save screenshots (ideally 800×560px or 16:10 ratio) into the `assets/` folder.

### 3. Change accent color

Open `css/style.css` and edit the `--accent` variable at the top:

```css
:root {
  --accent: #b8965a; /* muted gold — change this */
  --accent-dark: #9a7a44; /* darker shade — change this too */
}
```

Some alternatives:

- Olive: `#7A8C5E` / `#64754C`
- Dusty blue: `#5B7FA6` / `#4A6A8E`
- Rust: `#B3624A` / `#9A4E38`

### 4. Update links

- GitHub: search for `github.com/chrisstyl` and replace
- LinkedIn: search for `linkedin.com/in/chrisstyl` and replace
- Email: search for `xrhstosstyl@gmail.com` and replace

## 🚀 Deploy with CI/CD (GitHub Actions)

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`).
Every time you push to `main`, the site builds and deploys automatically.

### First-time setup (do this once)

1. **Create a GitHub repo** and push this folder to it:

   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chris-portfolio.git
   git push -u origin main
   ```

2. **Enable GitHub Pages with Actions as the source:**
   - Go to your repo on GitHub
   - **Settings → Pages**
   - Under _Source_, select **GitHub Actions**
   - Save

3. That's it. The workflow runs automatically and your site goes live at:
   ```
   https://YOUR_USERNAME.github.io/chris-portfolio/
   ```

### After that — just push

```bash
git add .
git commit -m "update project cards"
git push
```

GitHub Actions picks it up, deploys within ~30 seconds. You can watch it live under the **Actions** tab in your repo.

## 🎨 Design Notes

- **Fonts**: DM Serif Display (headings) + DM Sans (body) — loaded from Google Fonts
- **Colors**: Warm off-white background, charcoal text, muted gold accent
- **Animations**: CSS scroll-reveal, subtle hover transitions — no heavy libraries
- **Responsive**: Mobile-first, tested down to 375px

## 📬 Contact

Chris Stylianopoulos · xrhstosstyl@gmail.com
