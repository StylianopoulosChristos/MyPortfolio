'use client';

import { useSyncExternalStore } from 'react';
import type { Theme } from './theme';

// The theme lives on <html data-theme>, set before paint by the inline head
// script. Treat that attribute as an external store so React follows it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

// Unknown during prerender: the server cannot see the visitor's theme.
const getServerTheme = (): Theme | null => null;

export function useTheme(): Theme | null {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme);
}
