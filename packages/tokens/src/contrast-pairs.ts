import type { ColorToken } from './index.ts';

// Foreground/background pairs that must stay readable in both themes.
// The mark and borders are left out on purpose: logos and decorative
// borders are exempt from WCAG contrast requirements.
export const contrastPairs: ReadonlyArray<{
  fg: ColorToken;
  bg: ColorToken;
  min: 4.5 | 3;
  use: string;
}> = [
  { fg: 'color-text-default', bg: 'color-bg', min: 4.5, use: 'body text' },
  { fg: 'color-text-default', bg: 'color-surface-default', min: 4.5, use: 'text on cards' },
  {
    fg: 'color-text-default',
    bg: 'color-surface-raised',
    min: 4.5,
    use: 'text on raised surfaces',
  },
  { fg: 'color-text-muted', bg: 'color-bg', min: 4.5, use: 'secondary text' },
  { fg: 'color-text-muted', bg: 'color-surface-default', min: 4.5, use: 'secondary text on cards' },
  {
    fg: 'color-text-muted',
    bg: 'color-surface-raised',
    min: 4.5,
    use: 'secondary text on raised surfaces',
  },
  { fg: 'color-accent-default', bg: 'color-bg', min: 4.5, use: 'links' },
  { fg: 'color-accent-default', bg: 'color-surface-default', min: 4.5, use: 'links on cards' },
  { fg: 'color-accent-fg', bg: 'color-accent-default', min: 4.5, use: 'primary button label' },
  { fg: 'color-redline', bg: 'color-bg', min: 4.5, use: 'spec annotations' },
  { fg: 'color-success', bg: 'color-bg', min: 3, use: 'availability dot' },
  { fg: 'color-focus', bg: 'color-bg', min: 3, use: 'focus ring' },
];
