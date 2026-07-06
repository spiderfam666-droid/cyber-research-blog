# Cybersec Research Blog

A production-ready cybersecurity research blog built with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). Designed for security researchers who want a fast, minimal, and professional publishing platform.

![Astro](https://img.shields.io/badge/Astro-7.x-BC52EE)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Markdown-based blog** with frontmatter support (tags, categories, cover images, references)
- **14 research categories** with automatic article listing
- **Local full-text search** powered by [Pagefind](https://pagefind.app/) (no database required)
- **SEO optimized** — OpenGraph, Twitter Cards, JSON-LD, canonical URLs, RSS, sitemap
- **Syntax highlighting** with copy button, filename support, and line highlighting
- **Dark mode by default** with optional light mode toggle
- **Mermaid diagram** support in articles
- **Minimal JavaScript** for maximum performance (Lighthouse 95+ target)
- **GitHub Pages deployment** via GitHub Actions

## Pages

| Page | Route |
|------|-------|
| Home | `/` |
| About | `/about/` |
| Research | `/research/` |
| Blog | `/blog/` |
| Projects | `/projects/` |
| Categories | `/categories/` |
| Tags | `/tags/` |
| Search | `/search/` |
| Contact | `/contact/` |
| RSS Feed | `/rss.xml` |
| Sitemap | `/sitemap-index.xml` |

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) 22.12.0 or later
- npm 10+

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cybersec-research-blog.git
cd cybersec-research-blog

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:4321/cybersec-research-blog/](http://localhost:4321/cybersec-research-blog/) in your browser.

### Build

```bash
npm run build
npm run preview
```

The build command also generates the Pagefind search index automatically.

## Configuration

### Site Settings

Edit `src/consts.ts` to customize:

- Author name, role, and bio
- Social links (GitHub, LinkedIn, email)
- Site URL and navigation links

### GitHub Pages Base URL

Update `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://yourusername.github.io',
  base: '/cybersec-research-blog', // Change to '/' for custom domains
});
```

Also update the build script in `package.json` if needed:

```json
"build": "astro build && pagefind --site dist"
```

### Custom Domain

For a custom domain (e.g., `research.example.com`):

1. Set `base: '/'` in `astro.config.mjs`
2. Update `site` to your domain
3. Add a `public/CNAME` file with your domain
4. Update `package.json` build script: `pagefind --site dist --base-url /`

## Adding Content

### Blog Posts

Create a markdown file in `src/content/blog/`:

```markdown
---
title: "Your Article Title"
description: "Brief description for SEO and cards"
author: "Sivabalan Chandra Sekaran"
pubDate: 2025-07-02
coverImage: "images/covers/your-cover.svg"
tags: ["tag1", "tag2"]
categories: ["Reverse Engineering"]
references:
  - title: "Reference Title"
    url: "https://example.com"
---

Your content here...
```

### Projects

Create a markdown file in `src/content/projects/`:

```markdown
---
title: "Project Name"
description: "Project description"
github: "https://github.com/yourusername/project"
demo: "https://demo.example.com"
technologies: ["Rust", "Python"]
coverImage: "images/covers/project.svg"
featured: true
pubDate: 2025-07-02
---
```

## Deployment

### GitHub Pages (Automatic)

1. Push this repository to GitHub
2. Go to **Settings → Pages → Build and deployment**
3. Set source to **GitHub Actions**
4. Push to the `main` branch — the workflow in `.github/workflows/deploy.yml` handles the rest

### Manual Deployment

```bash
npm run build
# Upload the `dist/` folder to your hosting provider
```

## Project Structure

```
cybersec-research-blog/
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD
├── public/                         # Static assets
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
├── src/
│   ├── components/                 # Reusable UI components
│   ├── content/
│   │   ├── blog/                   # Blog articles (markdown)
│   │   └── projects/               # Project pages (markdown)
│   ├── layouts/                    # Page layouts
│   ├── pages/                      # Route pages
│   ├── styles/global.css           # Global styles + Tailwind
│   ├── utils/                      # Helper functions
│   └── consts.ts                   # Site configuration
├── astro.config.mjs
├── package.json
└── README.md
```

## Performance

This site is optimized for Lighthouse scores above 95:

- Zero unnecessary JavaScript on content pages
- Static HTML generation via Astro
- Lazy-loaded images with async decoding
- Pagefind search index built at compile time
- Minimal font loading (Inter + JetBrains Mono)

## License

MIT License — feel free to use this template for your own security research blog.

## Credits

Built with [Astro](https://astro.build), [Tailwind CSS](https://tailwindcss.com), [Pagefind](https://pagefind.app/), and [Shiki](https://shiki.style/) syntax highlighting.
