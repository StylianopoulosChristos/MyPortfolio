import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import tseslint from 'typescript-eslint';

// Next's rules only apply to the site, not to the token package.
const nextForSite = nextCoreWebVitals.map((config) => ({
  ...config,
  files: ['apps/site/**/*.{js,mjs,ts,tsx}'],
}));

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/out/**',
      '**/next-env.d.ts',
      'index.html',
      'css/**',
      'js/**',
      '.superpowers/**',
    ],
  },
  ...tseslint.configs.recommended,
  ...nextForSite,
  {
    files: ['apps/site/**'],
    settings: { next: { rootDir: 'apps/site/' } },
  },
);
