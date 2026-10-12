import { afterEach, describe, expect, it, vi } from 'vitest';
import { assetPath } from './asset-path';

describe('assetPath', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('leaves paths alone without a base path', () => {
    vi.stubEnv('BASE_PATH', '');
    expect(assetPath('/cv.pdf')).toBe('/cv.pdf');
  });

  it('prefixes public files with the base path', () => {
    vi.stubEnv('BASE_PATH', '/MyPortfolio');
    expect(assetPath('/cv.pdf')).toBe('/MyPortfolio/cv.pdf');
  });
});
