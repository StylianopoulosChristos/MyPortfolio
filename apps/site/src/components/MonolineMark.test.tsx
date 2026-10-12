import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MonolineMark } from './MonolineMark';

describe('MonolineMark', () => {
  it('draws the C and S from the spec geometry', () => {
    const { container } = render(<MonolineMark />);
    const paths = [...container.querySelectorAll('path')].map((path) => path.getAttribute('d'));
    expect(paths).toEqual([
      'M21.07 8.93 A10 10 0 1 0 21.07 23.07',
      'M38.33 8.5 A5 5 0 1 0 34 16 A5 5 0 1 1 29.67 23.5',
    ]);
  });

  it('is a named image when given a title', () => {
    render(<MonolineMark title="Chris Stylianopoulos" />);
    expect(screen.getByRole('img', { name: 'Chris Stylianopoulos' })).toBeInTheDocument();
  });

  it('is hidden from assistive tech without a title', () => {
    const { container } = render(<MonolineMark />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the 44:32 aspect ratio', () => {
    const { container } = render(<MonolineMark size={16} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '16');
    expect(svg).toHaveAttribute('width', '22');
  });
});
