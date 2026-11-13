'use client';

import { useEffect } from 'react';
import { followSystemTheme, THEME_STORAGE_KEY, type Theme } from './theme';
import { useTheme } from './useTheme';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const theme = useTheme();
  const next: Theme = theme === 'light' ? 'dark' : 'light';

  useEffect(followSystemTheme, []);

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
      {/* Both glyphs render; CSS picks one from <html data-theme>, so it is right before React loads. */}
      <span className={styles.sun} aria-hidden="true">
        ☀
      </span>
      <span className={styles.moon} aria-hidden="true">
        ☾
      </span>
    </button>
  );
}
