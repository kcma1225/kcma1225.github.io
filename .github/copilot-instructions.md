# AI Developer Guidelines — Astro Blog

> This file is written **for AI coding agents** (Copilot, Cursor, Cline, Windsurf, etc.) so they can understand the project quickly and make correct edits without human hand-holding.

---

## 1. Project Overview

| Key | Value |
|---|---|
| Framework | [Astro](https://astro.build/) v5 (static-output, SSG) |
| Language | TypeScript (strict via `astro/tsconfigs/base`) |
| Styling | Vanilla CSS (no Tailwind, no CSS-in-JS) — global styles in `src/styles/global.css` |
| Content | Markdown (`.md`) & MDX (`.mdx`) via `@astrojs/mdx` |
| Package manager | **pnpm** — always use `pnpm` commands, never `npm` or `yarn` |
| Node version | 22+ |
| Site URL | Configured in `astro.config.mjs` → `site` field |
| Deploy target | GitHub Pages via `.github/workflows/deploy.yml` |

---

## 2. Directory Structure

```
├── public/               # Static assets copied as-is to build output
│   ├── fonts/            # Atkinson Hyperlegible font files
│   ├── favicon.ico
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── assets/           # Images processed by Astro (optimized at build)
│   ├── components/       # Reusable `.astro` components
│   │   ├── BaseHead.astro    # <head> meta, OG tags, font preloads
│   │   ├── Header.astro      # Site-wide nav bar
│   │   ├── HeaderLink.astro  # Individual nav link
│   │   ├── Footer.astro      # Site-wide footer
│   │   └── FormattedDate.astro  # Date formatter helper
│   ├── content/
│   │   └── blog/         # Blog posts (Markdown/MDX) — content collection
│   ├── layouts/
│   │   ├── BlogPost.astro      # Single blog post layout
│   │   ├── BlogListLayout.astro # Blog listing page layout
│   │   └── SiteLayout.astro     # Generic site page layout
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── about.astro          # About page
│   │   ├── blog.astro           # Blog listing page
│   │   ├── blog/
│   │   │   ├── index.astro      # Blog index (alt route)
│   │   │   └── [...slug].astro  # Dynamic blog post route
│   │   └── rss.xml.js           # RSS feed endpoint
│   ├── styles/
│   │   └── global.css           # Global CSS (Bear Blog–inspired)
│   ├── consts.ts                # Site-wide constants (SITE_TITLE, SITE_DESCRIPTION)
│   ├── content.config.ts        # Content collection schema definitions
│   └── env.d.ts                 # Astro client types
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

---

## 3. Content Collection Schema

Blog posts in `src/content/blog/` must have this frontmatter:

```yaml
---
title: string          # Required — post title
description: string    # Required — short description (used in meta tags & listing)
pubDate: date          # Required — publish date (ISO 8601 or JS-parseable string)
updatedDate: date      # Optional — last-updated date
heroImage: string      # Optional — path to hero image in src/assets/
---
```

The schema is defined in `src/content.config.ts` using Zod. The collection uses `glob` loader targeting `src/content/blog/**/*.{md,mdx}`.

---

## 4. Common Tasks

### Add a new blog post

1. Create a new `.md` or `.mdx` file in `src/content/blog/`.
2. Include required frontmatter (`title`, `description`, `pubDate`).
3. The post automatically appears on the blog listing page and in the RSS feed — no routing changes needed.

### Add a new page

1. Create a new `.astro` file in `src/pages/`.
2. Import and use an existing layout (`SiteLayout.astro` or `BlogPost.astro`).
3. Add a nav link in `src/components/Header.astro` if the page should appear in navigation.

### Modify site metadata

- **Site title / description**: Edit `src/consts.ts` (`SITE_TITLE`, `SITE_DESCRIPTION`).
- **Site URL**: Edit the `site` field in `astro.config.mjs`.
- **SEO meta tags / OG tags**: Edit `src/components/BaseHead.astro`.
- **robots.txt**: Edit `public/robots.txt`.

### Modify global styling

- All global CSS lives in `src/styles/global.css`.
- CSS variables (colors, shadows) are defined in `:root` at the top of that file.
- Component-scoped styles use `<style>` blocks inside `.astro` files (Astro scoped CSS).

---

## 5. Commands

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm dev` | Start dev server (localhost:4321) |
| `pnpm build` | Production build → `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm astro check` | Run Astro type checking |

---

## 6. Integrations

| Integration | Purpose | Config location |
|---|---|---|
| `@astrojs/mdx` | MDX support for blog posts | `astro.config.mjs` → `integrations` |
| `@astrojs/sitemap` | Auto-generates `sitemap-index.xml` | `astro.config.mjs` → `integrations` |
| `@astrojs/rss` | RSS feed generation | `src/pages/rss.xml.js` |
| `sharp` | Image optimization | Used internally by Astro's `<Image>` component |

---

## 7. Coding Conventions

- **Components**: Use `.astro` single-file components. No React/Vue/Svelte.
- **Styling**: Prefer scoped `<style>` in components. Use `global.css` only for truly global styles and CSS variables.
- **Imports**: Use relative paths for local imports. Use `astro:content` and `astro:assets` for Astro built-in APIs.
- **TypeScript**: Use TypeScript for type safety. Define `Props` interfaces in component frontmatter.
- **Naming**: Files use kebab-case. Components use PascalCase filenames.
- **Images**: Place images in `src/assets/` (for optimization) or `public/` (for static serving). Use Astro's `<Image>` component for optimized images.

---

## 8. Deployment

The site deploys to **GitHub Pages** via the workflow at `.github/workflows/deploy.yml`.

- **Trigger**: Push to `main` branch or manual dispatch.
- **Build**: Uses `pnpm` with Node 22 on `ubuntu-latest`.
- **Output**: Static files in `dist/` are uploaded as a Pages artifact.
- The site URL and base path are injected from GitHub Pages config automatically.

> **Important**: When changing the production domain, update **both** the `site` field in `astro.config.mjs` and the `Sitemap` entry in `public/robots.txt`.

---

## 9. Do's and Don'ts

### Do ✅
- Run `pnpm astro check` after making changes to catch type errors.
- Keep blog post filenames URL-friendly (lowercase, hyphens, no spaces).
- Provide `title` + `description` in every blog post's frontmatter.
- Use Astro's `<Image>` component (from `astro:assets`) for images that need optimization.

### Don't ❌
- Don't install React/Vue/Svelte unless explicitly asked — this is a pure Astro project.
- Don't use `npm` or `yarn` — the lockfile is `pnpm-lock.yaml`.
- Don't put blog posts outside of `src/content/blog/`.
- Don't bypass the content collection schema — if a new field is needed, update `src/content.config.ts` first.
- Don't add inline `<script>` tags in layouts unless there's a clear need — Astro ships zero JS by default.
