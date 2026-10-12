import { render, renderHook, screen } from '@testing-library/react';
import type { ComponentType } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useMDXComponents } from './mdx-components';

const { a: A, img: Img } = renderHook(() => useMDXComponents({})).result.current as {
  a: ComponentType<{ href?: string; children?: string }>;
  img: ComponentType<{ src?: string; alt?: string }>;
};

describe('MDX components', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('prefixes root-relative images with the base path', () => {
    vi.stubEnv('BASE_PATH', '/MyPortfolio');
    render(<Img src="/diagram.png" alt="Token pipeline" />);
    expect(screen.getByAltText('Token pipeline')).toHaveAttribute(
      'src',
      '/MyPortfolio/diagram.png',
    );
  });

  it('leaves external images alone', () => {
    vi.stubEnv('BASE_PATH', '/MyPortfolio');
    render(<Img src="https://example.com/x.png" alt="External" />);
    expect(screen.getByAltText('External')).toHaveAttribute('src', 'https://example.com/x.png');
  });

  it('leaves external and in-page links alone', () => {
    render(
      <>
        <A href="https://example.com">External</A>
        <A href="#result">Jump</A>
      </>,
    );
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute(
      'href',
      'https://example.com',
    );
    expect(screen.getByRole('link', { name: 'Jump' })).toHaveAttribute('href', '#result');
  });
});
