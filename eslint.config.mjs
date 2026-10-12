import tseslint from 'typescript-eslint';

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
);
