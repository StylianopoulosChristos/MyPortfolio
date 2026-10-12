import { describe, expect, it } from 'vitest';
import { getNavItems } from './nav';

describe('getNavItems', () => {
  it('hides Work while nothing is published', () => {
    expect(getNavItems(false).map((item) => item.label)).toEqual(['System', 'About', 'Contact']);
  });

  it('shows Work first once a case study is published', () => {
    const items = getNavItems(true);
    expect(items.map((item) => item.label)).toEqual(['Work', 'System', 'About', 'Contact']);
    expect(items.map((item) => item.href)).toEqual(['/#work', '/system', '/about', '/#contact']);
  });
});
