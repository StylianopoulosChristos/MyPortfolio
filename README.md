# Chris Stylianopoulos — Portfolio

The portfolio of a UI / Design Systems Engineer, built on its own design system: design tokens
(W3C DTCG) → Style Dictionary → CSS variables → a statically exported Next.js site. The full
design is in [the rebrand spec](docs/superpowers/specs/2026-10-12-portfolio-rebrand-design.md).

## Structure

```
packages/tokens/   Design tokens: JSON source in src/, generated CSS + TS in dist/
apps/site/         The portfolio (Next.js App Router, static export)
  content/         Everything you edit to change what the site says
  src/             Layout, pages and components
docs/decisions/    Decision log: why things are the way they are
```

## Commands

Requires Node 24+ and pnpm (`npm i -g pnpm@12`).

| Command          | What it does                                                 |
| ---------------- | ------------------------------------------------------------ |
| `pnpm install`   | Install dependencies                                         |
| `pnpm dev`       | Build tokens, then run the site at http://localhost:3000     |
| `pnpm test`      | Unit tests, including the WCAG contrast check on token pairs |
| `pnpm build`     | Build tokens and export the static site to `apps/site/out/`  |
| `pnpm lint`      | ESLint, Prettier and Stylelint (no hard-coded colors in CSS) |
| `pnpm typecheck` | TypeScript across the workspace                              |

## Adding content

All copy lives in `apps/site/content/`. You never need to touch layout code to change it.

- `profile.ts`: name, title, tagline, location, links (LinkedIn, Figma, Storybook) and CV path.
  A link set to `null` is simply not shown.
- `story.ts`: the four-step story on the home and About pages.
- `experience.ts`: roles (newest first) and education. Leave `end` out if you don't know it yet;
  use `'present'` for your current role.
- `skills.ts`: skill groups, in display order. `minor: true` renders a group as one small line.
- `work/<slug>.mdx`: one case study per file. To add one, copy `work/_template.mdx` to
  `work/my-project.mdx` (lowercase words joined by hyphens), fill in `meta`, write the four
  sections and set `published: true`. The Work section, its nav link and the "See my work"
  button appear automatically once one case study is published.

A missing or mistyped field fails `pnpm typecheck` or `pnpm build` with a message that names the
file, so a broken page never ships.

## Changing tokens

Edit the JSON in `packages/tokens/src/` (`palette.json` holds raw values; `semantic/dark.json`
and `semantic/light.json` map them to roles; `base.json` holds type, spacing, radius and
motion), then run `pnpm tokens`. `pnpm test` fails if a text/background pair drops below WCAG AA
in either theme. In Phase 2 these files are exported from Figma variables instead of edited by
hand.

## Deploying

The site builds for `BASE_PATH=/MyPortfolio` (the GitHub Pages project URL). CI checks every push
to `main` and `rebrand`. The old single-page site (`index.html`, `css/`, `js/`) stays live until
launch, when Pages switches to deploying `apps/site/out/`.
