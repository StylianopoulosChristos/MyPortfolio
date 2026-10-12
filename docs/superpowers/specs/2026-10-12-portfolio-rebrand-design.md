# Portfolio Rebrand — Design Spec

- **Date:** 2026-10-12
- **Owner:** Chris Stylianopoulos
- **Status:** Draft, awaiting review

---

## 1. Goal

Reposition Chris from **"Front-End Developer · WordPress, PHP & SQL"** to **"UI / Design Systems Engineer"**. The portfolio itself becomes the main proof: a real design system (Figma variables → tokens → React/TypeScript components → Storybook), and the site is built only from that system.

**Audience:** hiring managers and recruiters for design-systems and UI-engineering roles. That means remote/international companies plus the Athens market.

### Success criteria

1. Within 10 seconds of landing, a visitor can name the role ("UI / Design Systems Engineer").
2. Every visual value on the site traces back to a token. No hard-coded colors, sizes or spacing in `apps/site` or `packages/ui`.
3. Public links exist to the **Storybook**, the **Figma file** and the **GitHub repo**, and the site links to all three.
4. Three case studies are published, each with Problem / Key decisions / Result.
5. All text/background token pairs meet **WCAG 2.2 AA** in both themes; this is enforced in CI. Storybook's axe add-on reports zero violations, and Lighthouse accessibility scores ≥ 95 on every page.
6. Chris can explain every token-structure and component-API decision. The decision log (§9) records them.
7. The new site is live by about week 12, and Chris is applying by about week 14.

### What was decided vs. assumed

| Decided by Chris | Assumed (Claude's default; change if wrong) |
|---|---|
| Target role: UI / Design Systems Engineer | English-only site |
| Markets: remote/international **and** Athens | Tagline #1 (see §2) |
| Timeline: 3+ months, ~10 h/week | Next.js, pnpm workspaces, CSS Modules, Radix for complex components |
| Personality: precise & systematic | Theme defaults to the OS preference, falling back to dark |
| Identity: evolve (keep CS initials, new system) | Accent color differs per theme to meet AA (§5.2) |
| Approach A: the site *is* the system | |
| Visual direction: **B, Graphite** | |
| Mark: **Monoline** | |
| Collaboration: pair (Claude builds plumbing; Chris builds tokens, components and site) | |
| Hosting: free GitHub Pages URL | |

---

## 2. Positioning & narrative

- **Title:** UI / Design Systems Engineer
- **Location line:** Athens, Greece · open to remote
- **Tagline:** *"I turn design decisions into systems: from Figma variables to typed React components."*
- **Framing line (About page / intros):** *"I've been building design systems for years. Now I'm building them in code."*

### Story arc (used on the home page strip and the About page)

1. **Data & databases (2018–2022):** freelance data analyst, then database developer at the Hellenic Army Reserve. This is where structure, naming and consistency come from.
2. **Enterprise UI support (Cosmote E-Value, 10/2024 → agency start):** debugging rendering, responsiveness and cross-browser behavior in enterprise web apps. This is where "how real UIs break" comes from.
3. **Agency (current):** building reusable systems in Divi/Elementor (global colors and fonts = tokens, presets = variants, saved sections and templates = component library) across many client sites.
4. **Next:** the same discipline in code: React, TypeScript, Figma.

### Experience order (newest first)

Agency (name, start date and bullets are inputs, see §11) → Cosmote E-Value → Hellenic Army Reserve → Freelance.

### Skills hierarchy

1. **Design Systems:** design tokens, component API design, documentation, accessibility
2. **UI Engineering:** React, TypeScript, CSS, React Native
3. **Design:** Figma (variables, components, auto layout)
4. *Also:* WordPress, Elementor, Divi, PHP, SQL (one small line)

ASPX and C# are removed from the site. They stay on the CV only if relevant to a specific application.

### Case studies

| # | Title (working) | Source material |
|---|---|---|
| 1 | **The system behind this site** (flagship) | This project and its decision log |
| 2 | **A reusable page-builder system across N client sites** | Chris's agency work (needs the numbers listed in §11) |
| 3 | **Best existing React / TS / RN project** | Chosen from Chris's repos in Phase 4 |

The Cosmote role is shown as experience bullets, not as a case study.

---

## 3. Information architecture

| Route | Content |
|---|---|
| `/` | Hero (title, tagline, CTAs *See my work* → `/#work`, *Explore the system* → `/system`), 3 case-study cards, story strip, compact skills, compact experience timeline, contact block |
| `/work/[slug]` | One page per case study, MDX, fixed template: **Overview** (role, timeline, tools) → **Problem** → **Key decisions** → **Result** → **What I'd do next** |
| `/system` | Live tokens rendered from code (color, type scale, spacing, radius), component gallery, light/dark toggle, "redline" spec annotations, links to Storybook / Figma / GitHub |
| `/about` | Long-form story, full experience, CV download (PDF) |
| `/storybook/` | Built Storybook, deployed with the site |
| `404` | On-brand not-found page that links home |

- **Nav:** Work (`/#work`) · System (`/system`) · About (`/about`) · Contact (`/#contact`). The anchors work from every page.
- **Footer:** "This site is built with my own design system. View the source →" (repo link), © year, location line
- **Removed from the current site:** placeholder project cards, the four big skill cards, the stats row

---

## 4. Visual identity: Graphite

**Direction:** dark-first and product-UI-like (references: Linear, Vercel, Raycast). The current gold evolves into a warm amber accent. Signature motif: **components shown with their token names** (in the hero, in Geist Mono). The `/system` page borrows "redline" spec annotations (thin red line + mono label) from the Blueprint exploration.

Mockups are saved in `.superpowers/brainstorm/` (gitignored):
- `visual-direction.html`: option B is the chosen direction
- `mark.html`: option 2 is the chosen mark

### 4.1 Mark: Monoline

The C and S are built from one rule: the C is an open circle arc of radius *r*. The S is two stacked half-circles of radius *r/2*. Both use the same stroke and round caps.

Reference geometry (viewBox `0 0 44 32`):

```svg
<path d="M21.07 8.93 A10 10 0 1 0 21.07 23.07"/>                    <!-- C -->
<path d="M38.33 8.5 A5 5 0 1 0 34 16 A5 5 0 1 1 29.67 23.5"/>       <!-- S -->
```

| Context | Stroke width (in viewBox units) | Colors |
|---|---|---|
| ≥ 32 px display | 2.6 | Dark: both strokes `accent`. Light: C `text`, S `accent` |
| Favicon 32 px | 4 | Mark on `surface` rounded square (radius 8) |
| Favicon 16 px | 5 | Same as 32 px |

Stroke width per size is a deliberate token decision and gets documented in the decision log. The final vector is redrawn and optically adjusted in Figma during Phase 1. The geometry above is the starting point.

---

## 5. Design tokens (starting values)

Tokens use the **W3C DTCG** format with three tiers: **primitive** (raw values) → **semantic** (theme-aware intent) → **component** (only when a component truly needs its own). Components consume semantic tokens only.

### 5.1 Typography

- **Families:** `font.family.sans` = Geist · `font.family.mono` = Geist Mono (both self-hosted via `next/font`)
- **Scale** (rem, 16px base; display and h1 are fluid via `clamp()`):

| Token | Size / line-height | Weight | Tracking | Family |
|---|---|---|---|---|
| `display` | 40→56 / 1.07 | 600 | −0.035em | sans |
| `h1` | 32→40 / 1.1 | 600 | −0.03em | sans |
| `h2` | 28 / 34 | 600 | −0.02em | sans |
| `h3` | 20 / 28 | 600 | −0.01em | sans |
| `body.lg` | 18 / 28 | 400 | 0 | sans |
| `body` | 16 / 26 | 400 | 0 | sans |
| `small` | 14 / 20 | 400 | 0 | sans |
| `label` | 12 / 16 | 500 | +0.06em, uppercase | mono |
| `code` | 13 / 20 | 400 | 0 | mono |

### 5.2 Color (semantic, per theme)

Primitives are defined in Phase 1. These are the semantic starting values, with contrast checked against `bg`:

| Semantic token | Dark | Light | Note |
|---|---|---|---|
| `color.bg` | `#0C0D0F` | `#FAFAF9` | |
| `color.surface` | `#141518` | `#FFFFFF` | cards, panels |
| `color.surface.raised` | `#1B1D21` | `#F2F2F0` | hover / nested |
| `color.border` | `#24262B` | `#E4E4E0` | |
| `color.border.strong` | `#2F3238` | `#CFCFCA` | |
| `color.text` | `#EDEDEF` | `#0C0D0F` | |
| `color.text.muted` | `#8A8F98` (≈6.0:1) | `#5F636B` (≈5.8:1) | AA body text |
| `color.accent` | `#F5B544` (≈10.8:1) | `#9A5B00` (≈5.2:1) | links, primary button, mark |
| `color.accent.fg` | `#17130A` | `#FFFFFF` | text on accent (≈10.2:1 / ≈5.4:1) |
| `color.success` | `#3DD68C` | `#1A7F4B` | "available" dot |
| `color.focus` | = `accent` | = `accent` | 2px focus ring, 2px offset |
| `color.redline` | `#E5484D` | `#D13438` | `/system` annotations only |

**Why the accent differs per theme:** amber `#F5B544` on a light background is about 1.7:1, which fails AA. The light theme resolves `color.accent` to a darker amber instead. This is a central example for the flagship case study.

### 5.3 Spacing, radius, motion, layout

- **Spacing (4px base):** `space.1`=4 · `2`=8 · `3`=12 · `4`=16 · `5`=24 · `6`=32 · `7`=48 · `8`=64 · `9`=96 · `10`=128
- **Radius:** `sm`=4 · `md`=8 · `lg`=12 · `xl`=16 · `full`=9999
- **Motion:** `duration.fast`=120ms · `base`=200ms · `slow`=320ms · `easing.standard`=`cubic-bezier(0.2, 0, 0, 1)`. All motion is disabled under `prefers-reduced-motion: reduce`.
- **Layout:** max content width 1120px · 12-column grid · 24px gutter · page side padding 16px (mobile) / 32px (≥ 768px). Must work at 320px width with no horizontal scroll.

### 5.4 Theming behavior

- Theme is set with `data-theme="dark|light"` on `<html>`.
- On first visit the theme follows `prefers-color-scheme`, falling back to **dark**. A toggle choice is saved in `localStorage`.
- A tiny inline script in `<head>` applies the theme before first paint, so there's no flash. All `localStorage` access is wrapped in try/catch.
- Without JS the site renders fully in the OS-preferred theme, and the toggle is hidden.

---

## 6. Architecture

### 6.1 Repository layout (pnpm workspaces)

```
MyPortfolio/
├── packages/
│   ├── tokens/        # DTCG JSON source + Style Dictionary build
│   │   ├── src/       #   primitive/, semantic/{dark,light}, component/
│   │   └── dist/      #   tokens.css, tokens.ts (generated, gitignored)
│   └── ui/            # React + TS component library
│       └── src/components/<Name>/{Name.tsx, Name.module.css, Name.stories.tsx, Name.test.tsx, index.ts}
├── apps/
│   ├── site/          # Next.js (App Router), static export, MDX case studies
│   └── mobile/        # Phase 5, optional: Expo app consuming packages/tokens
├── docs/
│   ├── decisions/     # decision log (§9)
│   └── superpowers/specs/
└── .github/workflows/ # CI + Pages deploy
```

### 6.2 Design → code pipeline

```
Figma variables
   │  (manual export with a free DTCG-export plugin, chosen in Phase 1.
   │   Figma's Variables REST API needs an Enterprise plan, so this step stays manual)
   ▼
packages/tokens/src/*.json  (DTCG, committed)
   │  Style Dictionary v4
   ▼
dist/tokens.css   → :root[data-theme="dark"], :root[data-theme="light"] custom properties
dist/tokens.ts    → typed token names/values (for /system page + tests)
(Phase 5) dist/tokens.native.ts → React Native values
   ▼
packages/ui (CSS Modules read var(--…))  →  apps/site
```

### 6.3 Component library (`packages/ui`)

- **Stack:** React + TypeScript (strict), CSS Modules, no runtime styling library.
- **Components (target ~12):** Heading, Text, Stack, Container, Button, Link, Icon, Tag, Card, Divider, ThemeToggle, TokenSwatch, Tabs.
- **Build vs. wrap rule:** simple components are built from scratch. Components with complex interaction or ARIA patterns (Tabs; any future Dialog or Tooltip) wrap **Radix** primitives.
- **Library/site boundary:** anything generic goes in `ui`. Anything site-specific (Header, Footer, CaseStudyLayout, Hero) goes in `apps/site`.
- **Definition of done, per component:** matching Figma component → implementation → Storybook story covering all variants and states → tests for behavior and keyboard/ARIA → zero axe violations → a decision-log entry if a non-obvious API choice was made.

### 6.4 Site (`apps/site`)

- Next.js App Router with `output: 'export'` (fully static).
- `basePath` comes from one config value: `/MyPortfolio` today, empty if the repo is renamed to `stylianopouloschristos.github.io` or a domain is added.
- Case studies are MDX files rendered through the fixed template (§3).
- The `/system` page imports `tokens.ts`, so what it displays is always the real token values.

#### Content model: add content later without touching layout code

All content lives in `apps/site/content/`, separate from layout and components. Adding content means editing these files and nothing else:

| File | Holds |
|---|---|
| `profile.ts` | Name, title, tagline, location line, availability, links (email, GitHub, LinkedIn), CV file path |
| `experience.ts` | Typed list of roles: company, title, period, bullets, tags |
| `skills.ts` | Skill groups in the §2 order |
| `work/<slug>.mdx` | One case study per file. Its metadata (title, summary, role, timeline, tools, order, `published`) drives the cards and the page |
| `work/_template.mdx` | A documented case-study template. It is never published |

- Content files are typed with TypeScript, so a missing required field fails the build instead of shipping a broken page.
- **Sections render only when they have content.** For example, the Work section and its nav link are hidden while there are no `published` case studies. No placeholder text ever ships.
- The skeleton is seeded only with content we already have (from the CV and this spec): profile, experience (agency role omitted until its details arrive), skills.

### 6.5 Quality & CI

- **Checks on every PR and on `main`:** `typecheck` → `lint` (ESLint + Prettier) → `test` (Vitest + Testing Library) → **contrast check** → build tokens → build ui → build Storybook → build site.
- **Contrast check:** a script reads the built tokens and asserts that every listed foreground/background semantic pair meets AA in both themes. It fails CI otherwise.
- **Deploy (on `main` only):** Storybook output is copied into the site's `out/storybook/`, then published with `actions/deploy-pages` to `https://stylianopouloschristos.github.io/MyPortfolio/`.
- **Launch check (manual):** Lighthouse on every route, both themes, mobile and desktop.

---

## 7. Migration from the current site

1. **Phase 0 (on `main`, independent: any time inputs arrive):** edit the existing static `index.html`:
   - new title and meta description
   - new hero copy (title + tagline)
   - remove the placeholder Work section
   - fix the GitHub and LinkedIn links
   - add the agency role to the experience timeline
   - re-order skills per §2
   - update the footer year
   - rewrite `README.md` to describe the actual project (it currently references a deleted workflow and placeholder usernames)
2. **Phases 1–4 (on the `rebrand` branch):** build the monorepo alongside the old files. The old site stays live the whole time.
3. **Launch (end of Phase 4):** delete the old `index.html`, `css/` and `js/`, merge `rebrand` into `main`, and switch Pages to the Actions deploy.

---

## 8. Roadmap (~10 h/week)

| Phase | Weeks | Chris | Claude | Exit criteria |
|---|---|---|---|---|
The site comes first: a working skeleton with every page, then real Figma tokens, then components, then content.

| Phase | Weeks | Chris | Claude | Exit criteria |
|---|---|---|---|---|
| 0. Stop the bleeding | Any time (independent) | Provide LinkedIn URL + agency details | Apply §7 step 1 | Current site has no placeholders or broken links |
| 1. Site skeleton | 1–2 | Run it locally, review the structure, learn where things live | Monorepo; `tokens` seeded from §5 values (DTCG JSON → Style Dictionary → CSS + TS); contrast check; Next.js site with every route (§3), header/footer with Monoline mark, theme toggle, content model (§6.4); CI | `pnpm dev` serves every route in both themes; `pnpm build` produces the static export; contrast check and CI pass |
| 2. Figma + tokens | 3–4 | Rebuild the seeded tokens as Figma variables; draw the Monoline vector; take over token naming. The Figma export replaces the seed files | Wire export → build; review naming | A Figma export rebuilds `tokens.css` with only intended diffs |
| 3. Component library | 5–9 | Build ~12 components per the definition of done, and swap them into the site in place of skeleton markup | Storybook setup; guidance, code review, harder TS patterns | All stories pass axe; site pages use only `ui` components |
| 4. Content + launch | 10–12 | Write About copy and case study #2 (agency) | Edit copy; deploy switch | New site live; old files removed |
| 5. Case studies | 13–14 | Write case studies #1 (flagship) and #3 | Edit and tighten copy | All three case studies live; start applying |
| 6. Optional | 15+ | Expo app on shared tokens; npm publish; visual regression tests | Support | Scope decided at the time |

**Stall rule:** if a component goes past one working session, cut its scope rather than polish it.

**Planning granularity:** each phase gets its own implementation plan, written when the phase starts. The first plan covers Phase 1 (site skeleton).

---

## 9. Collaboration model & decision log

- **Claude builds:** tooling, configuration, CI, pipelines, scaffolding (including the Phase 1 site skeleton, which Chris then reworks with his own components in Phase 3), and anything interviewers are unlikely to probe.
- **Chris builds:** Figma work, token naming and structure, component code, page code, and case-study writing. Claude guides step by step and reviews.
- **Decision log:** `docs/decisions/NNNN-short-title.md`, a few lines each, with headings **Context / Options considered / Decision / Why**. Add an entry for every non-obvious token or API decision. This is the raw material for case study #1 and for interview preparation.

---

## 10. Out of scope

- CV, LinkedIn and GitHub profile rebrand (a separate follow-up, timed to Phase 3 launch, reusing this identity)
- Greek-language version
- Blog or notes section
- CMS, analytics, contact form (contact stays as `mailto:` and links)
- Publishing `ui` to npm, Changesets, visual regression testing (all candidates for Phase 5)

---

## 11. Inputs required from Chris

| Input | Needed by |
|---|---|
| LinkedIn profile URL | Phase 0 |
| Agency name, start date, 2–3 bullets about the role | Phase 0 |
| Agency case study: number of client sites using the system; before/after estimates (build time, consistency, fewer fixes); permission to show client sites (otherwise anonymized) | Phase 4 |
| Links to existing React / TS / RN repos | Phase 5 |
