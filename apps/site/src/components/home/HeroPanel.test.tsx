import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HeroPanel } from './HeroPanel';

describe('HeroPanel', () => {
  it('shows a live button and the tokens it is built from', () => {
    document.documentElement.dataset.theme = 'dark';
    render(<HeroPanel />);

    expect(screen.getByRole('link', { name: 'Get in touch' })).toHaveAttribute(
      'href',
      'mailto:xrhstosstyl@gmail.com',
    );
    for (const token of ['--color-accent-default', '--radius-md', '--font-size-small']) {
      expect(screen.getByText(token)).toBeInTheDocument();
    }
    expect(screen.getByText('#F5B544')).toBeInTheDocument();
    expect(screen.getByText('8px')).toBeInTheDocument();
  });

  it('remaps the color value when the theme changes', async () => {
    document.documentElement.dataset.theme = 'dark';
    render(<HeroPanel />);

    await act(async () => {
      document.documentElement.dataset.theme = 'light';
    });

    expect(await screen.findByText('#9A5B00')).toBeInTheDocument();
    expect(screen.queryByText('#F5B544')).not.toBeInTheDocument();
  });
});
