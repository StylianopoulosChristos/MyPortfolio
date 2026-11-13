import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { base, themes } from './index.ts';

const css = readFileSync(new URL('../dist/tokens.css', import.meta.url), 'utf8');

describe('token build', () => {
  it('resolves the accent per theme', () => {
    expect(themes.dark['color-accent-default']).toBe('#F5B544');
    expect(themes.light['color-accent-default']).toBe('#9A5B00');
  });

  it('resolves semantic-to-semantic references', () => {
    expect(themes.dark['color-focus']).toBe(themes.dark['color-accent-default']);
    expect(themes.light['color-focus']).toBe(themes.light['color-accent-default']);
    expect(themes.light['color-mark-primary']).toBe('#0C0D0F');
  });

  it('never exposes primitives', () => {
    const keys = [...Object.keys(themes.dark), ...Object.keys(themes.light), ...Object.keys(base)];
    expect(keys.filter((key) => key.startsWith('palette-'))).toEqual([]);
    expect(css).not.toContain('--palette-');
  });

  it('gives both themes the same token names', () => {
    expect(Object.keys(themes.light).sort()).toEqual(Object.keys(themes.dark).sort());
  });

  it('emits theme selectors and the no-JS fallback', () => {
    expect(css).toContain(':root, :root[data-theme="dark"]');
    expect(css).toContain(':root[data-theme="light"]');
    expect(css).toContain('@media (prefers-color-scheme: light)');
    expect(css).toContain(':root:not([data-theme])');
    expect(css).toContain('color-scheme: dark');
    expect(css).toContain('color-scheme: light');
  });

  it('keeps scales in the order they are authored, largest type first', () => {
    const names = (prefix: string) => Object.keys(base).filter((key) => key.startsWith(prefix));
    expect(names('font-size-')).toEqual([
      'font-size-display',
      'font-size-h1',
      'font-size-h2',
      'font-size-h3',
      'font-size-body-lg',
      'font-size-body',
      'font-size-small',
      'font-size-label',
      'font-size-code',
    ]);
    expect(names('radius-')).toEqual([
      'radius-sm',
      'radius-md',
      'radius-lg',
      'radius-xl',
      'radius-full',
    ]);
    expect(names('space-').slice(0, 3)).toEqual(['space-1', 'space-2', 'space-3']);
    expect(names('space-').at(-1)).toBe('space-10');
  });

  it('provides entrance motion tokens', () => {
    expect(base['duration-slower']).toBe('560ms');
    expect(base['easing-emphasized']).toBe('cubic-bezier(0.05, 0.7, 0.1, 1)');
  });

  it('emits base tokens verbatim', () => {
    expect(base['font-size-display']).toBe('clamp(2.5rem, 2rem + 2vw, 3.5rem)');
    expect(base['space-5']).toBe('24px');
    expect(base['easing-standard']).toBe('cubic-bezier(0.2, 0, 0, 1)');
  });
});
