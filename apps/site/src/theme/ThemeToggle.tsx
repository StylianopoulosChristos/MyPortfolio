'use client';

import { THEME_STORAGE_KEY, type Theme } from './theme';
import { useTheme } from './useTheme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const theme = useTheme();
  const next: Theme = theme === 'light' ? 'dark' : 'light';

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the theme still applies for this visit.
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={theme ? `Switch to ${next} theme` : 'Toggle theme'}
    >
      {/* key remounts the glyph on change so it can play its swap animation */}
      <span key={theme ?? 'unknown'} className={styles.glyph} aria-hidden="true">
        {theme === 'light' ? '☾' : '☀'}
      </span>
    </button>
  );
}
