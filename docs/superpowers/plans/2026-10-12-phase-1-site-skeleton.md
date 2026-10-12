# Phase 1: Site Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A working, themeable portfolio skeleton with every route from the spec, built entirely on design tokens. Content lives in typed files that can be filled in later without touching layout code.

**Architecture:** A pnpm-workspaces monorepo. `packages/tokens` holds DTCG JSON seeded from the spec. Style Dictionary builds it into one `tokens.css` (dark default, light via `data-theme`, a no-JS `prefers-color-scheme` fallback) plus typed TS maps. `apps/site` is a statically exported Next.js App Router site: it reads content from `apps/site/content/`, renders case studies from MDX, and uses only token CSS variables for visual values.

**Tech Stack:** Node ≥ 24, pnpm 12, TypeScript ~6.0, Style Dictionary 5, Next.js 16 (App Router, `output: 'export'`), React 19, `@next/mdx` 16, `geist` fonts, Vitest 5 + Testing Library + jsdom, ESLint 10 + typescript-eslint + eslint-config-next, Prettier 3, Stylelint 17.

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-rebrand-design.md` (§2 copy, §3 routes, §4.1 mark, §5 tokens, §6.4 content model, §8 Phase 1 row)

## Global Constraints

- Work on the `rebrand` branch. Don't touch the old site files (`index.html`, `css/`, `js/`); every linter and formatter ignores them.
- Node `>=24` (`engines`), `packageManager: "pnpm@12.11.2"`. Install pnpm with `corepack enable pnpm`, or `npm i -g pnpm@12.11.2` if corepack lacks permission on Windows.
- Dependency ranges: `next ^16.4.0`, `react`/`react-dom ^19.3.0`, `typescript ~6.0.3` (typescript-eslint supports `<6.1`, so **not** TS 7), `style-dictionary ^5.6.1`, `@next/mdx ^16.4.0`, `@mdx-js/loader ^3.1.1`, `@mdx-js/react ^3.1.1`, `@types/mdx ^2.0.14`, `geist ^1.7.2`, `vitest ^5.0.4`, `vite ^8.3.4`, `@vitejs/plugin-react ^6.1.2`, `jsdom ^30.1.2`, `@testing-library/react ^16.3.3`, `@testing-library/jest-dom ^7.0.1`, `@testing-library/user-event ^14.6.7`, `eslint ^10.12.0`, `typescript-eslint ^8.71.1`, `eslint-config-next ^16.4.0`, `prettier ^3.9.10`, `stylelint ^17.16.0`, `stylelint-config-standard ^40.0.0`, `@types/node ^24.19.2`, `@types/react`/`@types/react-dom ^19.3.0`.
- Package names: `@cs/tokens` (packages/tokens) and `@cs/site` (apps/site). All private.
- **No hard-coded colors** in any `.css` under `apps/` or `packages/` (enforced by Stylelint, Task 3). Spacing, radius, type and motion values in CSS also come from `var(--…)`. The only exception is literal `768px` inside `@media` queries, because CSS variables can't be used there.
- **No placeholder copy ships.** Sections and links render only when their content exists (spec §6.4).
- English, US spelling. Copy that the spec fixes is quoted verbatim in the tasks.
- Generated output (`dist/`, `.next/`, `out/`) is gitignored. Add these entries to the existing `.gitignore`, along with `node_modules/`.
- Prettier settings: `singleQuote: true`, `semi: true`, `printWidth: 100` (matches the existing `js/main.js` style).

## Review Focus

1. **Zero published case studies** (the state this phase ships in): the build succeeds; the Work section, the Work nav link and the "See my work" CTA are absent; no `/work/*` page shows template content. Pinned by Task 5 (nav test) and Task 6 (export test).
2. **Site served under `BASE_PATH=/MyPortfolio`:** every internal link, the favicon and asset URLs carry the prefix; there's no bare `href="/system/"`. Pinned by Task 6 (export test, run in CI with the prefix by Task 7).
3. **Visitor with storage blocked or no `matchMedia`** (private mode, locked-down browser): the theme still resolves, the toggle still flips, and nothing throws. Pinned by Task 3 tests.
4. **Visitor without JavaScript:** the page renders in the OS-preferred theme and the theme toggle is hidden. Pinned by Task 1 (CSS media block) and Task 3 (toggle hide rule).
5. **A content mistake** (missing or invalid case-study field, or a case-study filename that isn't URL-safe) fails the build with a message naming the file and the field. It must never ship a broken page. Pinned by Task 4 tests.

---

### Task 1: Workspace + token build

**Files:**
- Create: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore`
- Modify: `.gitignore` (add `node_modules/`, `dist/`, `.next/`, `out/`, `*.tsbuildinfo`)
- Create: `packages/tokens/package.json`, `packages/tokens/tsconfig.json`, `packages/tokens/build.ts`, `packages/tokens/src/index.ts`
- Create: `packages/tokens/src/palette.json`, `packages/tokens/src/semantic/dark.json`, `packages/tokens/src/semantic/light.json`, `packages/tokens/src/base.json`
- Test: `packages/tokens/src/build.test.ts`

**Interfaces:**
- Produces:
  - `@cs/tokens` exports `base: Readonly<Record<string, string>>` and `themes: { dark: Readonly<Record<ColorToken, string>>; light: Readonly<Record<ColorToken, string>> }`, plus types `ThemeName = 'dark' | 'light'` and `ColorToken` (the union of dark-theme keys).
  - `@cs/tokens/tokens.css` (path `dist/tokens.css`).
  - Map keys are the CSS custom-property names without `--` (e.g. `color-accent-default`).
  - Root scripts: `tokens`, `dev`, `build`, `test`, `typecheck`, `lint`, `format`.

**Root scripts** (`package.json`):
- `"tokens": "pnpm --filter @cs/tokens build"`
- `"dev": "pnpm tokens && pnpm --filter @cs/site dev"`
- `"build": "pnpm -r build"` (topological order builds tokens first)
- `"test": "pnpm tokens && pnpm -r test"`
- `"typecheck": "pnpm tokens && pnpm -r typecheck"`
- `"lint": "eslint . && prettier --check ."` (Task 3 appends `&& stylelint \"{apps,packages}/**/*.css\"`)
- `"format": "prettier --write ."`

**ESLint** (`eslint.config.mjs`, flat config):
- Ignores: `**/dist/**`, `**/.next/**`, `**/out/**`, `index.html`, `css/**`, `js/**`, `.superpowers/**`.
- `typescript-eslint` recommended rules apply everywhere.
- Task 3 adds the Next rules, scoped to `apps/site/**`.

**`tsconfig.base.json`:** `strict`, `noUncheckedIndexedAccess`, `moduleResolution: "bundler"`, `module: "esnext"`, `target: "es2022"`, `isolatedModules`, `resolveJsonModule`, `skipLibCheck`, `esModuleInterop`. `packages/tokens/tsconfig.json` extends it and adds `noEmit: true` and `allowImportingTsExtensions: true`, because `src/index.ts` imports `../dist/*.ts`.

**`.prettierignore`:** `index.html`, `css/`, `js/`, `docs/superpowers/`, `.superpowers/`, `pnpm-lock.yaml`, `**/dist/`, `**/.next/`, `**/out/`, `**/next-env.d.ts`.

**`packages/tokens/package.json`:**
- `"type": "module"`
- Scripts: `"build": "node build.ts"` (Node 24 type stripping), `"test": "vitest run"`, `"typecheck": "tsc --noEmit"`
- Exports: `".": "./src/index.ts"`, `"./tokens.css": "./dist/tokens.css"`

**Token sources (DTCG: every token is `{ "$value": …, "$type": … }`).** Three tiers, kept apart by their top-level group:

`src/palette.json` holds primitives under the top-level group `palette`. These are **never emitted** to CSS or TS:

| Token | Value | Token | Value |
|---|---|---|---|
| `palette.graphite.100` | `#EDEDEF` | `palette.paper.0` | `#FFFFFF` |
| `palette.graphite.400` | `#8A8F98` | `palette.paper.50` | `#FAFAF9` |
| `palette.graphite.600` | `#5F636B` | `palette.paper.100` | `#F2F2F0` |
| `palette.graphite.700` | `#2F3238` | `palette.paper.200` | `#E4E4E0` |
| `palette.graphite.800` | `#24262B` | `palette.paper.300` | `#CFCFCA` |
| `palette.graphite.850` | `#1B1D21` | `palette.amber.400` | `#F5B544` |
| `palette.graphite.900` | `#141518` | `palette.amber.700` | `#9A5B00` |
| `palette.graphite.950` | `#0C0D0F` | `palette.amber.950` | `#17130A` |
| `palette.green.400` | `#3DD68C` | `palette.green.700` | `#1A7F4B` |
| `palette.red.400` | `#E5484D` | `palette.red.600` | `#D13438` |

`src/semantic/{dark,light}.json` holds the top-level group `color`. Values are references like `{palette.graphite.950}`. DTCG forbids a token that also has child tokens, so a name that has variants takes a `default` leaf (spec `color.surface` becomes `color.surface.default`, and likewise for `text`, `border` and `accent`):

| Semantic token | Dark → | Light → |
|---|---|---|
| `color.bg` | graphite.950 | paper.50 |
| `color.surface.default` | graphite.900 | paper.0 |
| `color.surface.raised` | graphite.850 | paper.100 |
| `color.border.default` | graphite.800 | paper.200 |
| `color.border.strong` | graphite.700 | paper.300 |
| `color.text.default` | graphite.100 | graphite.950 |
| `color.text.muted` | graphite.400 | graphite.600 |
| `color.accent.default` | amber.400 | amber.700 |
| `color.accent.fg` | amber.950 | paper.0 |
| `color.success` | green.400 | green.700 |
| `color.focus` | `{color.accent.default}` | `{color.accent.default}` |
| `color.redline` | red.400 | red.600 |
| `color.mark.primary` (the C of the mark) | `{color.accent.default}` | `{color.text.default}` |
| `color.mark.secondary` (the S of the mark) | `{color.accent.default}` | `{color.accent.default}` |

`src/base.json` holds theme-independent tokens (spec §5.1, §5.3):
- **`font.family`:** `sans` = `var(--font-geist-sans), system-ui, sans-serif`; `mono` = `var(--font-geist-mono), ui-monospace, monospace`
- **`font.size`:**
  - `display` = `clamp(2.5rem, 2rem + 2vw, 3.5rem)`
  - `h1` = `clamp(2rem, 1.75rem + 1vw, 2.5rem)`
  - `h2` = `1.75rem`, `h3` = `1.25rem`
  - `body-lg` = `1.125rem`, `body` = `1rem`, `small` = `0.875rem`
  - `label` = `0.75rem`, `code` = `0.8125rem`
- **`font.line-height`:**
  - `display` = `1.07`, `h1` = `1.1`
  - `h2` = `2.125rem`, `h3` = `1.75rem`
  - `body-lg` = `1.75rem`, `body` = `1.625rem`, `small` = `1.25rem`
  - `label` = `1rem`, `code` = `1.25rem`
- **`font.weight`:** `regular` 400, `medium` 500, `semibold` 600
- **`font.tracking`:** `display` −0.035em, `h1` −0.03em, `h2` −0.02em, `h3` −0.01em, `label` 0.06em
- **`space`:** `1`–`10` = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 px
- **`radius`:** `sm` 4px, `md` 8px, `lg` 12px, `xl` 16px, `full` 9999px
- **`duration`:** `fast` 120ms, `base` 200ms, `slow` 320ms
- **`easing.standard`:** `cubic-bezier(0.2, 0, 0, 1)`
- **`layout`:** `max-width` 1120px, `gutter` 24px, `page-padding` 16px, `page-padding-wide` 32px
- **`breakpoint.md`:** 768px (documentation only)

**Build (`build.ts`).** Runs three Style Dictionary instances, all with `usesDtcg: true` and `transforms: ['name/kebab']` only, so values pass through verbatim:

| Instance | Sources | Filter | CSS file | TS file | CSS blocks |
|---|---|---|---|---|---|
| base | `src/base.json` | none | `dist/base.css` | `dist/base.ts` | `:root` |
| dark | `src/palette.json` + `src/semantic/dark.json` | `token.path[0] === 'color'` | `dist/dark.css` | `dist/dark.ts` | `:root, :root[data-theme="dark"]`, with `color-scheme: dark` |
| light | `src/palette.json` + `src/semantic/light.json` | `token.path[0] === 'color'` | `dist/light.css` | `dist/light.ts` | `:root[data-theme="light"]` **and** `@media (prefers-color-scheme: light) { :root:not([data-theme]) {…} }`, both with `color-scheme: light` |

After the three builds, `build.ts` concatenates base, dark and light into `dist/tokens.css`.

Register two formats with `StyleDictionary.registerFormat`:
- `css/blocks` takes `options.blocks: Array<{ selector: string; media?: string }>` and `options.colorScheme?: 'dark' | 'light'`. It starts with the header comment `/* Generated by @cs/tokens — do not edit */`. For each block it emits (wrapped in `@media media { … }` when `media` is set) `selector {`, optional `color-scheme: …;`, one `--${token.name}: ${token.$value};` per token sorted by name, then `}`.
- `ts/flat-map` takes `options.exportName`. It emits `export const ${exportName} = {…} as const;` with `JSON.stringify` keys and values, sorted by name.

`src/index.ts` re-exports `base` from `../dist/base.ts` and builds `themes = { dark, light }` from `../dist/dark.ts` and `../dist/light.ts`. It also defines `ThemeName` and `ColorToken = keyof typeof dark`.

- [ ] **Step 1: Scaffold the workspace.** Create the root files and the tokens package files above (no token JSON yet), run `pnpm install`, then commit `pnpm-lock.yaml` with them.

- [ ] **Step 2: Write the failing test** `packages/tokens/src/build.test.ts`. It reads `dist/tokens.css` with `fs` and imports `{ base, themes }` from `./index.ts`:
  - `it('resolves the accent per theme')`: `themes.dark['color-accent-default']` is `'#F5B544'` and `themes.light['color-accent-default']` is `'#9A5B00'`
  - `it('resolves semantic-to-semantic references')`: in both themes, `color-focus` equals `color-accent-default`. In light, `color-mark-primary` is `'#0C0D0F'`
  - `it('never exposes primitives')`: no key in `themes.dark`, `themes.light` or `base` starts with `palette-`, and the CSS doesn't contain `--palette-`
  - `it('gives both themes the same token names')`: the sorted keys of dark and light are equal
  - `it('emits theme selectors and the no-JS fallback')`: the CSS contains `:root, :root[data-theme="dark"]`, `:root[data-theme="light"]`, `@media (prefers-color-scheme: light)`, `:root:not([data-theme])`, `color-scheme: dark` and `color-scheme: light`
  - `it('emits base tokens verbatim')`: `base['font-size-display']` is `'clamp(2.5rem, 2rem + 2vw, 3.5rem)'`, `base['space-5']` is `'24px'`, `base['easing-standard']` is `'cubic-bezier(0.2, 0, 0, 1)'`

- [ ] **Step 3: Run it and confirm it fails.** Run `pnpm --filter @cs/tokens test`. Expected: FAIL (`dist/` missing or the import can't be resolved).

- [ ] **Step 4: Add the token JSON and `build.ts`** as specified above.

- [ ] **Step 5: Build and test.** Run `pnpm tokens && pnpm --filter @cs/tokens test`. Expected: PASS, 6 tests. Then run `pnpm format && pnpm typecheck && pnpm lint`. Expected: no errors. The old `README.md` may get reformatted here, which is fine: Task 7 rewrites it.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json eslint.config.mjs .prettierrc.json .prettierignore .gitignore packages/tokens
git commit -m "feat(tokens): seed DTCG tokens and Style Dictionary build"
```

---

### Task 2: Contrast check

**Files:**
- Create: `packages/tokens/src/contrast.ts`, `packages/tokens/src/contrast-pairs.ts`
- Test: `packages/tokens/src/contrast.test.ts`

**Interfaces:**
- Consumes: `themes`, `ColorToken`, `ThemeName` from Task 1.
- Produces:
  - `relativeLuminance(hex: string): number`
  - `contrastRatio(foreground: string, background: string): number`
  - `contrastPairs: ReadonlyArray<{ fg: ColorToken; bg: ColorToken; min: 4.5 | 3; use: string }>`

`relativeLuminance` uses the WCAG 2.x sRGB formula: channel `c/255`, then linearize as `c ≤ 0.04045 ? c/12.92 : ((c+0.055)/1.055)^2.4`; luminance is `0.2126R + 0.7152G + 0.0722B`. It accepts `#RRGGBB` only, case-insensitive, and throws `Error('Unsupported color: <value>')` for anything else.

**Pairs** (spec §5.2). The mark and borders are left out on purpose: logos and decorative borders are exempt.

| fg | bg | min |
|---|---|---|
| text-default | bg, surface-default, surface-raised | 4.5 |
| text-muted | bg, surface-default, surface-raised | 4.5 |
| accent-default | bg, surface-default | 4.5 |
| accent-fg | accent-default | 4.5 |
| redline | bg | 4.5 |
| success | bg | 3 |
| focus | bg | 3 |

Token names in this table drop the `color-` prefix for readability. Use full keys (e.g. `color-text-muted`) in code.

- [ ] **Step 1: Write the failing tests** in `contrast.test.ts`:
  - `contrastRatio('#000000', '#FFFFFF')` is close to 21 (2 decimal places)
  - `contrastRatio('#FFFFFF', '#FFFFFF')` is 1
  - `contrastRatio('#777777', '#FFFFFF')` is close to 4.48 (2 decimal places)
  - the ratio is symmetric for `('#F5B544', '#0C0D0F')`
  - `relativeLuminance('red')` throws `/Unsupported color/`
  - `it.each` over every theme × pair: `contrastRatio(themes[t][fg], themes[t][bg]) >= min`. The test title includes the theme, both token names and `use`, so a failure names the exact pair.

- [ ] **Step 2: Run them and confirm they fail.** Run `pnpm --filter @cs/tokens test`. Expected: FAIL (`contrast.ts` doesn't exist).

- [ ] **Step 3: Implement** `contrast.ts` and `contrast-pairs.ts`.

- [ ] **Step 4: Run and confirm they pass.** Run `pnpm test`. Expected: PASS. Every pair passes with the seeded values. If a pair fails, **stop and report it**. Do not change token values to make it pass, because the spec owns those values.

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/src/contrast*.ts packages/tokens/src/contrast.test.ts
git commit -m "feat(tokens): enforce WCAG AA contrast for semantic color pairs"
```

---

### Task 3: Next.js app + theming

**Files:**
- Create: `apps/site/package.json`, `apps/site/next.config.ts`, `apps/site/tsconfig.json`, `apps/site/vitest.config.ts`, `apps/site/vitest.setup.ts`, `apps/site/next-env.d.ts` (generated)
- Create: `apps/site/src/app/layout.tsx`, `apps/site/src/app/globals.css`, `apps/site/src/app/page.tsx` (temporary; replaced in Task 6)
- Create: `apps/site/src/theme/theme.ts`, `apps/site/src/theme/ThemeToggle.tsx`, `apps/site/src/theme/ThemeToggle.module.css`
- Create: `.stylelintrc.json`. Modify: `eslint.config.mjs`, root `package.json` (`lint` script)
- Test: `apps/site/src/theme/theme.test.ts`, `apps/site/src/theme/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `@cs/tokens/tokens.css`.
- Produces:
  - `type Theme = 'dark' | 'light'`
  - `THEME_STORAGE_KEY = 'theme'`
  - `resolveTheme(stored: string | null, prefersLight: boolean): Theme`
  - `applyTheme(resolve: typeof resolveTheme, storageKey: string): void`
  - `themeScript: string`
  - `<ThemeToggle />` (client component, no props)
  - The root layout renders `{children}` inside `<body>`. Task 5 adds Header, `<main id="main">` and Footer around it.

**`apps/site/package.json`:**
- Scripts: `dev` = `next dev`, `build` = `next build`, `test` = `vitest run`, `typecheck` = `tsc --noEmit`
- Dependency: `@cs/tokens: "workspace:*"`

**`next.config.ts`:**
- `output: 'export'`
- `basePath: process.env.BASE_PATH ?? ''`
- `trailingSlash: true`
- `images: { unoptimized: true }`
- `pageExtensions: ['ts', 'tsx', 'mdx']`
- `transpilePackages: ['@cs/tokens']`
- Wrapped with `createMDX()` from `@next/mdx` (no plugins)

**Theme behavior:**
- `resolveTheme` returns `stored` when it is exactly `'dark'` or `'light'`. Otherwise it returns `'light'` if `prefersLight`, and `'dark'` if not.
- `applyTheme` must be **self-contained**, because it gets serialized: no imports or closures, only its parameters and globals.
  - It reads `localStorage.getItem(storageKey)` inside try/catch (null on error).
  - It computes `prefersLight` as `typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches`.
  - It sets `document.documentElement.dataset.theme`.
- `themeScript` is `` `(${applyTheme.toString()})(${resolveTheme.toString()}, ${JSON.stringify(THEME_STORAGE_KEY)})` ``.

**Layout:**
- `<html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>`, with `<script dangerouslySetInnerHTML={{ __html: themeScript }} />` in `<head>`.
- Imports `@cs/tokens/tokens.css` and then `./globals.css`. Fonts come from `geist/font/sans` and `geist/font/mono`.
- Metadata:
  - `title.default`: `'Chris Stylianopoulos — UI / Design Systems Engineer'`
  - `title.template`: `'%s · Chris Stylianopoulos'`
  - `description`: `'I turn design decisions into systems: from Figma variables to typed React components.'`

**`globals.css`:**
- Border-box reset and zero body margin.
- `body` uses the `bg`, `text-default`, `font-family-sans`, `font-size-body` and `font-line-height-body` tokens.
- `a { color: var(--color-accent-default); }`
- `:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }` (spec §5.2). The `2px` widths are the only literal sizes allowed in this file.
- `@media (prefers-reduced-motion: reduce)`: sets animation and transition durations to `0.01ms` and `scroll-behavior: auto`, all `!important`.

**`ThemeToggle`:**
- Before mount: `aria-label="Toggle theme"`.
- After mount it reads `document.documentElement.dataset.theme` and labels itself `Switch to light theme` or `Switch to dark theme`.
- Click: sets `dataset.theme` to the other theme, then writes `localStorage.setItem(THEME_STORAGE_KEY, next)` inside try/catch.
- The visible content is a sun/moon glyph with `aria-hidden`.
- The CSS module contains `:global(html:not([data-theme])) .toggle { display: none; }`.

**Lint additions:**
- `eslint.config.mjs`: spread `eslint-config-next/core-web-vitals` rules scoped to `files: ['apps/site/**']`, with `settings.next.rootDir: 'apps/site/'`.
- `.stylelintrc.json`:
  - Extends `stylelint-config-standard`.
  - Rules: `color-no-hex: true`, `color-named: 'never'`, `function-disallowed-list: ['rgb', 'rgba', 'hsl', 'hsla']`, `selector-class-pattern: null` (CSS Module classes are camelCase), and `selector-pseudo-class-no-unknown` with `ignorePseudoClasses: ['global']`.
  - `ignoreFiles`: `**/dist/**`, `**/.next/**`, `**/out/**`, `css/**`.
- Root `lint` script becomes `eslint . && prettier --check . && stylelint "{apps,packages}/**/*.css"`.

**Vitest:** `environment: 'jsdom'`, the React plugin, and a setup file that imports `@testing-library/jest-dom/vitest`.

- [ ] **Step 1: Write the failing tests.**
  - `theme.test.ts`:
    - `resolveTheme` cases: `('light', false)` → `'light'`, `('dark', true)` → `'dark'`, `(null, true)` → `'light'`, `(null, false)` → `'dark'`, `('purple', true)` → `'light'`
    - `it('serialized script applies the stored theme')`: set `localStorage.theme = 'light'`, run `new Function(themeScript)()`, expect `dataset.theme === 'light'`
    - `it('falls back to dark when storage throws and matchMedia is missing')`: spy `Storage.prototype.getItem` to throw, delete `window.matchMedia` (jsdom lacks it anyway), run the script, expect `'dark'`
    - `it('uses the OS preference when storage throws')`: stub `matchMedia` to return `{ matches: true }`, expect `'light'`
  - `ThemeToggle.test.tsx`:
    - Set `dataset.theme = 'dark'` and render. The button's accessible name is `Switch to light theme`. Click it: `dataset.theme` becomes `'light'`, `localStorage.theme` becomes `'light'`, and the name becomes `Switch to dark theme`.
    - `it('still toggles when storage writes throw')`: spy `Storage.prototype.setItem` to throw, click, expect `dataset.theme` flipped and no error.
    - `it('is hidden without JavaScript')`: read `ThemeToggle.module.css` as text and expect it to contain `:global(html:not([data-theme])) .toggle` and `display: none`.

- [ ] **Step 2: Run them and confirm they fail.** Run `pnpm --filter @cs/site test`. Expected: FAIL (modules missing).

- [ ] **Step 3: Implement** the app config, layout, globals, `theme.ts`, `ThemeToggle`, and a temporary `page.tsx` that renders `<h1>Chris Stylianopoulos</h1>` and `<ThemeToggle />`.

- [ ] **Step 4: Run all checks.** Run `pnpm test && pnpm typecheck && pnpm lint && pnpm build`. Expected:
  - all pass
  - `apps/site/out/index.html` exists and contains `data-theme` inside the head script

- [ ] **Step 5: Manual check.** Run `pnpm dev` and open `http://localhost:3000`. Toggle the theme and reload. Expected: the choice persists, there's no flash of the wrong theme, and the colors match the Graphite (dark) and paper (light) values.

- [ ] **Step 6: Commit**

```bash
git add apps/site .stylelintrc.json eslint.config.mjs package.json pnpm-lock.yaml
git commit -m "feat(site): Next.js static app with no-flash theming"
```

---

### Task 4: Content model

**Files:**
- Create: `apps/site/content/types.ts`, `profile.ts`, `story.ts`, `experience.ts`, `skills.ts`, `work/_template.mdx`
- Create: `apps/site/src/lib/case-studies.ts`, `apps/site/src/lib/format-period.ts`, `apps/site/src/mdx-components.tsx`
- Modify: `apps/site/tsconfig.json` (path alias `@content/*` → `./content/*`)
- Test: `apps/site/src/lib/case-studies.test.ts`, `apps/site/src/lib/format-period.test.ts`

**Interfaces:**
- Produces, from `content/types.ts`:
  - `Profile`:
    - `{ name; title; headline; subline; framing; location; availability; email: string }`
    - `links: { github: string; repo: string; linkedin: string | null; figma: string | null; storybook: string | null }`
    - `cvPath: string | null`
  - `StoryStep { period: string; title: string; summary: string }`
  - `YearMonth = `${number}-${number}``
  - `Role { company: string; title: string; start: YearMonth; end?: YearMonth | 'present'; bullets: string[]; tags: string[] }`
  - `Education { degree: string; school: string; year: number }`
  - `SkillGroup { name: string; items: string[]; minor?: boolean }`
  - `CaseStudyMeta { title: string; summary: string; role: string; timeline: string; tools: string[]; order: number; published: boolean }`
- Produces, data:
  - `profile` (`content/profile.ts`)
  - `story: StoryStep[]` (`content/story.ts`)
  - `experience: Role[]` and `education: Education[]` (`content/experience.ts`)
  - `skills: SkillGroup[]` (`content/skills.ts`)
  - Each file declares its data with `satisfies` against the type, so a missing field fails `typecheck`.
- Produces, functions:
  - `formatPeriod(start: YearMonth, end?: YearMonth | 'present'): string`
  - `CASE_STUDY_DIR` (absolute path to `content/work`)
  - `listCaseStudySlugs(dir?: string): string[]`
  - `parseCaseStudyMeta(raw: unknown, file: string): CaseStudyMeta`
  - `getPublishedCaseStudies(): Promise<Array<{ slug: string; meta: CaseStudyMeta }>>`
  - `getCaseStudy(slug: string): Promise<{ meta: CaseStudyMeta; Content: React.ComponentType } | null>`

**Seed content** (spec §2; CV bullets are verbatim except where noted):
- **`profile`:**
  - `name`: `'Chris Stylianopoulos'`
  - `title`: `'UI / Design Systems Engineer'`
  - `headline`: `'I turn design decisions into systems.'`
  - `subline`: `'From Figma variables to typed React components.'`
  - `framing`: `"I've been building design systems for years. Now I'm building them in code."`
  - `location`: `'Athens, Greece · open to remote'`
  - `availability`: `'Open to remote & Athens roles'`
  - `email`: `'xrhstosstyl@gmail.com'`
  - `links.github`: `'https://github.com/StylianopoulosChristos'`
  - `links.repo`: `'https://github.com/StylianopoulosChristos/MyPortfolio'`
  - `linkedin`, `figma`, `storybook` and `cvPath` are all `null`
- **`story`:**
  1. `2018–2022` · `Data & databases` · "Freelance data analyst, then database developer at the Hellenic Army Reserve. Where structure, naming and consistency come from."
  2. `2024` · `Enterprise UI support` · "Debugging rendering, responsiveness and cross-browser behavior in enterprise web apps at Cosmote E-Value. Where knowing how real UIs break comes from."
  3. `Now` · `Agency systems` · "Building reusable systems in Divi and Elementor — global colors and fonts as tokens, presets as variants, saved sections as a component library — across many client sites."
  4. `Next` · `Design systems in code` · "The same discipline in React, TypeScript and Figma."
- **`experience`** (newest first; no agency role until Chris provides it):
  - **Cosmote E-Value · Application Support Engineer** · start `2024-10`, `end` omitted (Chris supplies it). Tags: HTML, CSS, PHP, SQL. Bullets are the 4 from the CV, with the second reworded to "Worked with HTML and CSS to debug layout, responsiveness, and cross-browser compatibility" because spec §2 drops ASPX.
  - **Hellenic Army Reserve · Database Developer** · `2021-09` → `2022-03`. CV bullets. Tags: SQL, Database design, Automation.
  - **Freelance (Remote) · Data Analyst / Database Specialist** · `2018-01` → `2020-01`. CV bullets. Tags: Python, SQL, Data analysis, Automation.
- **`education`:** BSc Computer Science · University of West Attica · 2020
- **`skills`:**
  - Design Systems: Design tokens, Component API design, Documentation, Accessibility
  - UI Engineering: React, TypeScript, CSS, React Native
  - Design: Figma variables, Figma components, Auto layout
  - Also (`minor: true`): WordPress, Elementor, Divi, PHP, SQL

**Case-study rules:**
- A case study is `content/work/<slug>.mdx` exporting `export const meta = {…}`. Files starting with `_` are ignored.
- Slugs must match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. Otherwise `listCaseStudySlugs` throws `Error('content/work/<file>: file name must be lowercase-kebab-case')`.
- `parseCaseStudyMeta` throws `Error('<file>: missing or invalid "<field>"')` for the first field that is absent or has the wrong type. `tools` must be an array of strings.
- `getPublishedCaseStudies` loads each meta with `await import(`../../content/work/${slug}.mdx`)`, keeps entries where `published === true`, and sorts by `order` ascending.
- `getCaseStudy` returns `null` for a missing or unpublished slug.
- If Turbopack rejects the template-literal import, switch the site's `build` script to `next build --webpack` and note it in the commit.
- `_template.mdx` has `meta` with `published: false` and the headings `## Problem`, `## Key decisions`, `## Result`, `## What I'd do next`, each followed by a one-line MDX comment explaining what belongs there (spec §3). It starts with an MDX comment: "Copy this file to `<slug>.mdx`, fill in `meta`, set `published: true`."
- `mdx-components.tsx` exports `useMDXComponents(components: MDXComponents): MDXComponents` returning `components` unchanged.

**`formatPeriod`** uses fixed English short month names (no `Intl`, so output is stable):
- `('2024-10', 'present')` → `'Oct 2024 – Present'`
- `('2021-09', '2022-03')` → `'Sep 2021 – Mar 2022'`
- `('2024-10')` → `'Oct 2024'`

- [ ] **Step 1: Write the failing tests.**
  - `format-period.test.ts`: the three cases above.
  - `case-studies.test.ts`:
    - `parseCaseStudyMeta` accepts a valid object.
    - It throws `/x\.mdx: missing or invalid "title"/` when `title` is missing, `/"published"/` when `published: 'yes'`, and `/"tools"/` when `tools: 'React'`.
    - `listCaseStudySlugs(tmpDir)` returns `['a-study']` for a temp directory containing `a-study.mdx`, `_template.mdx` and `notes.txt`.
    - It throws `/lowercase-kebab-case/` when the directory contains `My Study.mdx`.
    - `listCaseStudySlugs()` on the real directory returns `[]`.

- [ ] **Step 2: Run them and confirm they fail.** Run `pnpm --filter @cs/site test`. Expected: FAIL.

- [ ] **Step 3: Implement** the types, seed content, `format-period.ts`, `case-studies.ts`, `mdx-components.tsx` and `_template.mdx`.

- [ ] **Step 4: Run all checks.** Run `pnpm test && pnpm typecheck && pnpm lint`. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/site/content apps/site/src/lib apps/site/src/mdx-components.tsx apps/site/tsconfig.json
git commit -m "feat(site): typed content model and case-study loader"
```

---

### Task 5: Site shell (mark, header, footer, 404, favicon)

**Files:**
- Create: `apps/site/src/components/MonolineMark.tsx` (+ `.module.css`), `apps/site/src/components/Header.tsx` (+ `.module.css`), `apps/site/src/components/Footer.tsx` (+ `.module.css`), `apps/site/src/components/nav.ts`
- Create: `apps/site/src/app/icon.svg`, `apps/site/src/app/not-found.tsx`
- Modify: `apps/site/src/app/layout.tsx`
- Test: `apps/site/src/components/nav.test.ts`, `apps/site/src/components/MonolineMark.test.tsx`

**Interfaces:**
- Consumes: `profile` (Task 4), `getPublishedCaseStudies` (Task 4), `ThemeToggle` (Task 3).
- Produces:
  - `NavItem { label: string; href: string }`
  - `getNavItems(hasWork: boolean): NavItem[]`
  - `<MonolineMark size?: number /* px height, default 32 */ strokeWidth?: number /* default 2.6 */ title?: string />`
  - `<Header hasWork: boolean />`
  - `<Footer />`

**Details:**
- **`getNavItems`:** returns Work `/#work` (only when `hasWork`), System `/system`, About `/about`, Contact `/#contact`, in that order (spec §3). Header links use `next/link` so `basePath` gets applied.
- **`MonolineMark`:**
  - An SVG with `viewBox="0 0 44 32"`, width `size * 44 / 32`, height `size`, `fill="none"` and `stroke-linecap="round"`.
  - The C path is `M21.07 8.93 A10 10 0 1 0 21.07 23.07`, stroked with `var(--color-mark-primary)`.
  - The S path is `M38.33 8.5 A5 5 0 1 0 34 16 A5 5 0 1 1 29.67 23.5`, stroked with `var(--color-mark-secondary)`.
  - With `title`, it gets `role="img"` and a `<title>`. Without one, it gets `aria-hidden="true"`.
- **Header:**
  - The mark (`size={28} strokeWidth={3.2}`) and the name link home, with accessible name `Chris Stylianopoulos — home`.
  - Then the nav, then `<ThemeToggle />`.
  - Inner width is capped at `layout-max-width`, with `layout-page-padding` (and `-wide` from 768px).
- **Footer:**
  - "This site is built with my own design system." followed by a link "View the source →" to `profile.links.repo`.
  - `© {current year} Chris Stylianopoulos`
  - `profile.location`
- **Layout:**
  - An async server component that computes `hasWork = (await getPublishedCaseStudies()).length > 0`.
  - Renders a skip link "Skip to content" → `#main` (visible on focus), then `<Header hasWork={hasWork} />`, `<main id="main">{children}</main>`, `<Footer />`.
- **`icon.svg`:** a 32×32 rounded square (`rx="8"`, fill `#141518`) containing the mark scaled to 26×19 at x=3, y=6.5, stroke `#F5B544`, stroke-width 4 (spec §4.1 favicon row). A separate 16px variant waits for the Figma vector in Phase 2. This is the one place literal colors are allowed: favicons can't read CSS variables.
- **`not-found.tsx`:** `<h1>Page not found</h1>`, one sentence, and a link "Back to home" → `/`.

- [ ] **Step 1: Write the failing tests.**
  - `nav.test.ts`:
    - `getNavItems(false)` labels are `['System', 'About', 'Contact']`.
    - `getNavItems(true)` labels are `['Work', 'System', 'About', 'Contact']`, with hrefs `['/#work', '/system', '/about', '/#contact']`.
  - `MonolineMark.test.tsx`:
    - Renders two `path` elements with the exact `d` values above.
    - With `title="Chris Stylianopoulos"`, `getByRole('img', { name: 'Chris Stylianopoulos' })` is found.
    - Without a title, the svg has `aria-hidden="true"`.
    - `size={16}` gives `height="16"` and `width="22"`.

- [ ] **Step 2: Run them and confirm they fail.** Run `pnpm --filter @cs/site test`. Expected: FAIL.

- [ ] **Step 3: Implement** the components, icon, not-found page and layout changes.

- [ ] **Step 4: Run all checks.** Run `pnpm test && pnpm typecheck && pnpm lint && pnpm build`. Expected:
  - PASS
  - `out/404.html` exists
  - `out/index.html` contains `href="/system/"` and doesn't contain `href="/#work"`

- [ ] **Step 5: Commit**

```bash
git add apps/site/src
git commit -m "feat(site): header, footer, Monoline mark, favicon and 404"
```

---

### Task 6: Pages (home, about, system, case study) + export test

**Files:**
- Create: `apps/site/src/app/page.tsx` (replaces the temporary one), `apps/site/src/app/about/page.tsx`, `apps/site/src/app/system/page.tsx`, `apps/site/src/app/work/[slug]/page.tsx`
- Create: section components in `apps/site/src/components/home/` (`Hero`, `WorkList`, `Story`, `Skills`, `ExperienceList`, `Contact`, each with a `.module.css`) and `apps/site/src/components/Redline.tsx` (+ `.module.css`)
- Create: `apps/site/vitest.export.config.ts`. Modify `apps/site/package.json` to add the `test:export` script.
- Test: `apps/site/src/export.test.ts`

**Interfaces:**
- Consumes: Task 4 content and loaders, `formatPeriod`, Task 1 `themes` and `base`, Task 5 layout.
- Produces:
  - `<Redline label: string />`: a mono label in `var(--color-redline)` with a 1px left rule, used only on `/system`.
  - `EMPTY_SLUG = '_'`, exported from the `work/[slug]` page module.

**Home (`/`), in order:**
1. **Hero:** an availability pill with a `success` dot, then `<h1>` = `profile.headline` (`display` type tokens), then a paragraph `${profile.title}. ${profile.subline}`, then CTAs. "See my work" → `/#work` renders only when `hasWork`. "Explore the system" → `/system` always renders. The hero's live component-and-token panel (spec §4) is **not** part of this phase. It arrives in Phase 3, once `Button` exists in `packages/ui`.
2. **Work** (`id="work"`): only when there are published case studies. One card per study (title, summary, tools) linking to `/work/<slug>/`.
3. **Story:** the four `story` steps.
4. **Skills:** groups in order; the `minor` group renders as one small line.
5. **Experience:** a compact list of company, title and `formatPeriod`.
6. **Contact** (`id="contact"`): `mailto:` email, GitHub, plus LinkedIn only when it's non-null.

**About (`/about`):** `profile.framing`, the story steps, the full experience (bullets and tags), education, and a "Download CV" link only when `cvPath` is set. Page title: `About`.

**System (`/system`):**
- Intro copy: "Every value on this site comes from these tokens. Switch the theme in the header to watch the semantic layer remap."
- **Colors:** one row per key of `themes.dark` showing the token name in mono plus dark and light swatches (inline `backgroundColor` from the `themes` values, which is data rather than styling) with their hex values.
- **Type:** a sample per `font-size-*` token, each with a `<Redline label={`${name} · ${value}`} />`.
- **Spacing:** bars `space-1`…`space-10`.
- **Radius:** a sample per `radius-*` token.
- **Links:** GitHub repo always; Figma and Storybook only when non-null.
- Page title: `System`.

**Case study (`/work/[slug]`):**
- `dynamicParams = false`.
- `generateStaticParams` returns the published slugs. When there are none it returns `[{ slug: EMPTY_SLUG }]`, because Next's static export rejects an empty list. The page calls `notFound()` for `EMPTY_SLUG` or for any slug where `getCaseStudy` returns `null`.
- Renders the Overview (role, timeline, tools from `meta`) and then `<Content />`.
- `generateMetadata` sets the title to `meta.title`.

**Export test.** `vitest.export.config.ts` runs only `src/export.test.ts` in the node environment. Script: `"test:export": "vitest run --config vitest.export.config.ts"`. The test reads `out/` (it requires a prior `pnpm build`) and uses `const prefix = process.env.BASE_PATH ?? ''`.

- [ ] **Step 1: Write the failing test** `src/export.test.ts`:
  - `it('emits every route')`: `out/index.html`, `out/about/index.html`, `out/system/index.html` and `out/404.html` exist.
  - `it('shows the new positioning')`: `index.html` contains `UI / Design Systems Engineer` and `I turn design decisions into systems.`
  - `it('hides Work while nothing is published')`: `index.html` doesn't contain `id="work"`, `See my work`, or `href="${prefix}/#work"`.
  - `it('ships no placeholder copy')`: no HTML file under `out/` contains `Project Title`, `lorem`, `TODO` or `Add your own projects`.
  - `it('renders real token values on /system')`: `system/index.html` contains `color-accent-default`, `#F5B544` and `#9A5B00`.
  - `it('prefixes internal links with the base path')`: `index.html` contains `href="${prefix}/system/"`. When `prefix` is non-empty, no HTML file contains `href="/system/"` or `href="/about/"`.
  - `it('has no LinkedIn link while none is set')`: `index.html` doesn't contain `linkedin.com`.

- [ ] **Step 2: Run it and confirm it fails.** Run `pnpm build && pnpm --filter @cs/site test:export`. Expected: FAIL (`about` and `system` pages missing).

- [ ] **Step 3: Implement** the pages, section components and `Redline`.

- [ ] **Step 4: Run and confirm it passes, with and without the prefix.**
  - Run `pnpm build && pnpm --filter @cs/site test:export`. Expected: PASS.
  - Run it again with `BASE_PATH=/MyPortfolio` set for both commands. Expected: PASS.
  - Run `pnpm test && pnpm typecheck && pnpm lint`. Expected: PASS.

- [ ] **Step 5: Manual check.** Run `pnpm dev`. Visit `/`, `/about`, `/system` and `/nope` in both themes, at 320px and 1280px wide. Expected:
  - no horizontal scroll at 320px
  - the theme toggle remaps `/system` swatch labels and page colors
  - keyboard Tab shows the focus ring and the skip link

- [ ] **Step 6: Commit**

```bash
git add apps/site
git commit -m "feat(site): home, about, system and case-study routes"
```

---

### Task 7: CI, README, first decision-log entry

**Files:**
- Create: `.github/workflows/ci.yml`, `docs/decisions/0001-token-tiers-and-theming.md`
- Modify: `README.md` (full rewrite)

**Interfaces:**
- Consumes: the root scripts (Task 1) and `test:export` (Task 6).

**`ci.yml`:**
- Name: `CI`. Triggers: `push` to `main` and `rebrand`, plus `pull_request`.
- Job on `ubuntu-latest`:
  1. `actions/checkout@v4`
  2. `pnpm/action-setup@v4` (reads `packageManager`)
  3. `actions/setup-node@v4` with `node-version: 24`, `cache: pnpm`
  4. `pnpm install --frozen-lockfile`
  5. `pnpm typecheck`
  6. `pnpm lint`
  7. `pnpm test` (includes the contrast check)
  8. `pnpm build` with `env: BASE_PATH: /MyPortfolio`
  9. `pnpm --filter @cs/site test:export` with the same env
- **No deploy step.** Switching Pages to the Actions deploy happens at launch (spec §7.3).

**`README.md`** replaces the old content, which references a deleted workflow and placeholder usernames. Sections:
- **What this is:** one paragraph, linking the spec.
- **Structure:** a tree of `packages/tokens`, `apps/site`, `docs/`.
- **Commands:** `pnpm install`, `pnpm dev`, `pnpm test`, `pnpm build`, `pnpm lint`.
- **Adding content:** one bullet per file in `apps/site/content/`. For a case study: copy `work/_template.mdx` to `work/<kebab-slug>.mdx`, fill in `meta`, set `published: true`.
- **Changing tokens:** edit `packages/tokens/src/`, then run `pnpm tokens`. The contrast check runs in `pnpm test`. Phase 2 replaces hand edits with a Figma export.
- **Old site:** `index.html`, `css/` and `js/` stay live until launch.

**`0001-token-tiers-and-theming.md`.** Format: Context / Options considered / Decision / Why. It records:
- the palette → semantic tiers, with primitives never emitted (so components can't bypass semantics)
- the `default` leaf naming forced by DTCG
- the per-theme accent (amber fails AA on light at about 1.7:1)
- dark default with `data-theme` plus the no-JS `prefers-color-scheme` fallback

- [ ] **Step 1: Run the full CI sequence locally.** Run each CI command in order, using `BASE_PATH=/MyPortfolio` for the build and the export test. Expected: every command exits 0.

- [ ] **Step 2: Write** `ci.yml`, `README.md` and the decision entry.

- [ ] **Step 3: Format check.** Run `pnpm lint`. Expected: PASS (Prettier covers the new Markdown and YAML).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/ci.yml README.md docs/decisions
git commit -m "chore: CI workflow, README and first decision-log entry"
```

- [ ] **Step 5: Hand off.** Don't push. Report the commit list and ask Chris whether to push `rebrand` so CI runs on GitHub.
