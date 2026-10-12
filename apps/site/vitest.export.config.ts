import { defineConfig } from 'vitest/config';

// Checks the static export in out/. Run after `pnpm build`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/export.test.ts'],
  },
});
