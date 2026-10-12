import { base } from '../dist/base.ts';
import { dark } from '../dist/dark.ts';
import { light } from '../dist/light.ts';

export { base };

export const themes = { dark, light } as const;

export type ThemeName = keyof typeof themes;

export type ColorToken = keyof typeof dark;
