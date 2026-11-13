import { describe, expect, it, vi } from 'vitest';
import { followSystemTheme, resolveTheme, themeScript } from './theme';

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

describe('followSystemTheme', () => {
  function stubSystemQuery() {
    const listeners = new Set<(event: { matches: boolean }) => void>();
    vi.stubGlobal('matchMedia', () => ({
      matches: false,
      addEventListener: (_: string, fn: (event: { matches: boolean }) => void) => listeners.add(fn),
      removeEventListener: (_: string, fn: (event: { matches: boolean }) => void) =>
        listeners.delete(fn),
    }));
    return (matches: boolean) => listeners.forEach((fn) => fn({ matches }));
  }

  it('follows an OS light/dark switch while the visitor has not picked a theme', () => {
    const osSwitchesTo = stubSystemQuery();
    document.documentElement.dataset.theme = 'dark';
    const stop = followSystemTheme();

    osSwitchesTo(true);
    expect(document.documentElement.dataset.theme).toBe('light');

    stop();
    osSwitchesTo(false);
    expect(document.documentElement.dataset.theme).toBe('light');
    vi.unstubAllGlobals();
  });

  it('keeps the visitor’s own choice when the OS switches', () => {
    const osSwitchesTo = stubSystemQuery();
    localStorage.setItem('theme', 'dark');
    document.documentElement.dataset.theme = 'dark';
    const stop = followSystemTheme();

    osSwitchesTo(true);
    expect(document.documentElement.dataset.theme).toBe('dark');
    stop();
    vi.unstubAllGlobals();
  });
});
