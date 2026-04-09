# Agents Guide

This document defines the essential rules AI agents should follow when editing this Astro blog.

## Stack & Commands
- Framework: Astro v5 (static site).
- Language: TypeScript.
- Styling: Vanilla CSS (no Tailwind).
- Package manager: `pnpm` only.
- Primary commands:
  - `pnpm install`
  - `pnpm dev`
  - `pnpm build`
  - `pnpm astro check`

## Content Rules
- Blog posts live in `src/content/blog/` only.
- Frontmatter schema is controlled by `src/content.config.ts`.
- Keep post IDs unique (avoid duplicate filenames/slugs).
- Use tags via `tags: ["tag-a", "tag-b"]` when applicable.

## UI / Design Rules
- Reuse existing layouts/components before creating new ones.
- Keep main reading width unchanged unless explicitly requested.
- Avoid hard-coded light-only colors like `#fff` for card/surface backgrounds.
- **When adjusting sizes (font-size, padding, gap, etc.):** always read the current value from the file first, then set the new explicit value. Never use relative descriptions like "increase a bit" translated into `calc(X + Y)` or vague deltas — write the actual target value (e.g. change `0.9rem` → `1.05rem`, not `calc(0.9rem + 0.15rem)`).
- Use theme-aware variables from `src/styles/global.css` such as:
  - `rgb(var(--surface))`
  - `rgb(var(--black))`
  - `rgb(var(--gray-dark))`
  - `rgb(var(--gray-light))`

## Theme Rules (Light / Dark / System)
- Theme state is persisted in `localStorage` key: `theme`.
- Allowed values: `light`, `dark`, `system`.
- `system` must follow `prefers-color-scheme`.
- Early theme bootstrapping must happen in head scripts to prevent FOUC:
  - `src/components/BaseHead.astro`
  - `src/layouts/SiteLayout.astro`

## Icon Rules
- **Never use emoji as icons or decorative UI elements.** Emoji are forbidden — always use the icon library instead.
- Current library: `astro-icon` integration in `astro.config.mjs`.
- Use icons like `lucide:*` via `import { Icon } from 'astro-icon/components'`.
- Ensure icons are static-build compatible (no runtime CDN dependency required).

## Routing Rules
- Do not create duplicate static routes (e.g., avoid both `src/pages/x.astro` and `src/pages/x/index.astro` unless intentional and non-conflicting).
- Blog routes:
  - Listing: `src/pages/blog.astro`
  - Detail: `src/pages/blog/[...slug].astro`

## Verification
- Always run `pnpm astro check` after changes.
- If styles/layout changed, sanity-check both light and dark themes.

## Scope Discipline
- Make focused edits only for requested behavior.
- Do not introduce new frameworks or large refactors unless requested.
- Keep output suitable for static deployment (GitHub Pages).

## Blog Post Sidebar Layout (`src/layouts/BlogPost.astro`)

The left sidebar in blog posts has two distinct zones with **different scroll behaviors**. Never collapse them into one element.

### HTML Structure

```html
<aside class="left-sidebar">
  <div id="sidebar-static">
    <!-- folder tree, tags, previous article -->
  </div>
  <div id="sidebar-toc-mount" class="sidebar-toc-outer">
    <!-- TOC injected here by JS on desktop only -->
  </div>
</aside>
```

### Zone A — Static (non-TOC)

- **Element**: `#sidebar-static` / `.sidebar-static`
- **CSS**: `position: static` (normal document flow)
- **Behavior**: scrolls away with the page when the user scrolls down; visible again only when scrolled back to the top
- **Never use** `position: sticky` or `position: fixed` on this zone

### Zone B — TOC (sticky)

- **Element**: `#sidebar-toc-mount` / `.sidebar-toc-outer`
- **CSS**: `position: sticky; top: 6rem`
- **Behavior**: stays visible in the viewport while the article scrolls; users can always click headings
- `max-height: calc(100vh - 6rem - 2rem)` + `overflow-y: auto` so an overflowing TOC scrolls internally
- TOC DOM is injected client-side by an `is:inline` script — only on `window.innerWidth > 1200`

### CSS Prerequisites for `sticky` to Work

- `.left-sidebar` must have `align-self: stretch` so it spans the full article column height (sticky needs room to travel)
- `.article-grid` must **not** have `align-items: start` (use the default `stretch`)
- `.post-shell` (the prose column) uses `align-self: start` to stay top-aligned
- No ancestor of `.sidebar-toc-outer` may have `overflow: hidden`, `overflow: auto`, or `overflow: scroll`

### Responsive

| Breakpoint | Behavior |
|---|---|
| `> 1200px` | Split behavior active; TOC injected by JS |
| `≤ 1200px` | Both zones reset to `position: static`; TOC DOM cleared by JS |
| `≤ 640px` | Mobile tweaks only; sidebar stacks below prose |

### Pitfalls to Avoid

- **Do NOT** make `.sidebar-static` sticky — it must scroll away
- **Do NOT** calculate or set `top` on `.sidebar-toc-outer` via JS (CSS `top: 6rem` is sufficient)
- **Do NOT** add `overflow: hidden/auto/scroll` to `.left-sidebar`, `.article-grid`, or `<main>` — this breaks sticky
- **Do NOT** render the TOC on mobile (hide it by clearing `mount.innerHTML` below 1200 px)