import { describe, expect, it, vi } from 'vitest';
import { resolveTheme, themeScript } from './theme';

const runScript = () => new Function(themeScript)();

describe('resolveTheme', () => {
  it.each([
    ['light', false, 'light'],
    ['dark', true, 'dark'],
    [null, true, 'light'],
    [null, false, 'dark'],
    ['purple', true, 'light'],
  ] as const)('stored=%s prefersLight=%s → %s', (stored, prefersLight, expected) => {
    expect(resolveTheme(stored, prefersLight)).toBe(expected);
  });
});

describe('themeScript', () => {
  it('serialized script applies the stored theme', () => {
    localStorage.setItem('theme', 'light');
    runScript();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('falls back to dark when storage throws and matchMedia is missing', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.stubGlobal('matchMedia', undefined);
    runScript();
    expect(document.documentElement.dataset.theme).toBe('dark');
    vi.unstubAllGlobals();
  });

  it('uses the OS preference when storage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    runScript();
    expect(document.documentElement.dataset.theme).toBe('light');
    vi.unstubAllGlobals();
  });
});
