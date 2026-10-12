# 0001 — Token tiers and theming

## Context

The site has to be themeable (dark by default, plus light), and every visual value should trace
back to a token. Components should not be able to bypass the design decisions behind those values.

## Options considered

1. **One flat token list** with both raw and semantic values exposed as CSS variables.
2. **Two tiers:** primitives (`palette.*`) feed semantic tokens (`color.*`), and only the semantic
   tier is emitted.
3. **Three tiers** with component tokens for every component.

## Decision

Two tiers now, with component tokens only where a component truly needs its own (the logo mark:
`color.mark.primary` / `color.mark.secondary`).

- Primitives live under `palette` and are **never emitted** to CSS or TS. A component can't use
  `--palette-amber-400` because it doesn't exist; it has to ask for `--color-accent-default`.
- DTCG forbids a token that also has child tokens, so a role with variants gets a `default` leaf:
  `color.text.default` and `color.text.muted`, not `color.text` plus `color.text.muted`.
- The accent resolves differently per theme. Amber `#F5B544` is about 10.8:1 on the dark
  background but only about 1.7:1 on the light one, which fails WCAG AA. The light theme maps
  `color.accent.default` to `#9A5B00` (about 5.2:1). A test checks every text/background pair in
  both themes.
- Themes switch with `data-theme` on `<html>`. Dark is `:root`'s default. An inline script applies
  the saved or OS-preferred theme before first paint, so there is no flash. Without JavaScript, a
  `prefers-color-scheme: light` media block on `:root:not([data-theme])` still gives light-mode
  visitors the light theme.

## Why

Hiding primitives makes the semantic layer the only API, which is what makes theming (and later,
re-theming from Figma) safe. The per-theme accent shows the main point of a semantic layer: the
role stays the same while its value changes to stay accessible.
