export type Theme = 'dark' | 'light';

export const THEME_STORAGE_KEY = 'theme';

export function resolveTheme(stored: string | null, prefersLight: boolean): Theme {
  if (stored === 'dark' || stored === 'light') return stored;
  return prefersLight ? 'light' : 'dark';
}

// Runs inline in <head> before first paint, so it is serialized with
// toString(): it must only use its parameters and browser globals.
export function applyTheme(resolve: typeof resolveTheme, storageKey: string): void {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(storageKey);
  } catch {
    stored = null;
  }
  const prefersLight =
    typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: light)').matches;
  document.documentElement.dataset.theme = resolve(stored, prefersLight);
}

export const themeScript = `(${applyTheme.toString()})(${resolveTheme.toString()}, ${JSON.stringify(THEME_STORAGE_KEY)})`;
