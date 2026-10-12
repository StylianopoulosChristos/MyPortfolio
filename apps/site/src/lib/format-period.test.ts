import { describe, expect, it } from 'vitest';
import { formatPeriod } from './format-period';

describe('formatPeriod', () => {
  it('formats an ongoing role', () => {
    expect(formatPeriod('2024-10', 'present')).toBe('Oct 2024 – Present');
  });

  it('formats a finished role', () => {
    expect(formatPeriod('2021-09', '2022-03')).toBe('Sep 2021 – Mar 2022');
  });

  it('shows only the start when the end is unknown', () => {
    expect(formatPeriod('2024-10')).toBe('Oct 2024');
  });
});
