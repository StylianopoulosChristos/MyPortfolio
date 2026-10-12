import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('flips the theme and remembers the choice', async () => {
    document.documentElement.dataset.theme = 'dark';
    render(<ThemeToggle />);

    const button = await screen.findByRole('button', { name: 'Switch to light theme' });
    await userEvent.click(button);

    expect(document.documentElement.dataset.theme).toBe('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(button).toHaveAccessibleName('Switch to dark theme');
  });

  it('still toggles when storage writes throw', async () => {
    document.documentElement.dataset.theme = 'dark';
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<ThemeToggle />);

    await userEvent.click(await screen.findByRole('button', { name: 'Switch to light theme' }));

    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('is hidden without JavaScript', () => {
    // import.meta.dirname, not new URL(…, import.meta.url): Vite rewrites the latter into an asset URL.
    const css = readFileSync(join(import.meta.dirname, 'ThemeToggle.module.css'), 'utf8');
    expect(css).toContain(':global(html:not([data-theme])) .toggle');
    expect(css).toContain('display: none');
  });
});
