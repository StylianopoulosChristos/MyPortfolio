import { describe, expect, it } from 'vitest';
import { contrastRatio, relativeLuminance } from './contrast.ts';
import { contrastPairs } from './contrast-pairs.ts';
import { themes, type ThemeName } from './index.ts';

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 2);
  });

  it('is 1 for identical colors', () => {
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
  });

  it('matches the known WCAG value for #777777 on white', () => {
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#F5B544', '#0C0D0F')).toBe(contrastRatio('#0C0D0F', '#F5B544'));
  });

  it('rejects anything that is not #RRGGBB', () => {
    expect(() => relativeLuminance('red')).toThrow(/Unsupported color/);
  });
});

const cases = (Object.keys(themes) as ThemeName[]).flatMap((theme) =>
  contrastPairs.map((pair) => ({ theme, ...pair })),
);

describe('semantic color pairs meet WCAG AA', () => {
  it.each(cases)('$theme: $fg on $bg ≥ $min ($use)', ({ theme, fg, bg, min }) => {
    const ratio = contrastRatio(themes[theme][fg], themes[theme][bg]);
    expect(ratio).toBeGreaterThanOrEqual(min);
  });
});
