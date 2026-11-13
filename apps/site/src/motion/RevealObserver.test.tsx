import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RevealObserver } from './RevealObserver';

type Callback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

function stubIntersectionObserver() {
  const observers: Array<{ callback: Callback; targets: Element[] }> = [];
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      targets: Element[] = [];
      constructor(callback: Callback) {
        observers.push({ callback, targets: this.targets });
      }
      observe(target: Element) {
        this.targets.push(target);
      }
      unobserve() {}
      disconnect() {}
    },
  );
  return observers;
}

function section(id: string) {
  const el = document.createElement('section');
  el.id = id;
  el.setAttribute('data-reveal', '');
  document.body.appendChild(el);
  return el;
}

describe('RevealObserver', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  it('reveals a section once it scrolls into view', () => {
    const observers = stubIntersectionObserver();
    const below = section('below');
    render(<RevealObserver />);

    expect(below).not.toHaveAttribute('data-revealed');
    observers[0]!.callback([{ isIntersecting: true, target: below }]);
    expect(below).toHaveAttribute('data-revealed');
  });

  it('reveals everything at once when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const a = section('a');
    const b = section('b');
    render(<RevealObserver />);
    expect(a).toHaveAttribute('data-revealed');
    expect(b).toHaveAttribute('data-revealed');
  });

  it('stops loops and delays for visitors who reduce motion', () => {
    const css = readFileSync(join(import.meta.dirname, '../app/globals.css'), 'utf8');
    const block = css.slice(css.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(block).toContain('animation-iteration-count: 1 !important');
    expect(block).toContain('animation-delay: 0s !important');
  });

  it('only hides content when JS ran and the visitor allows motion', () => {
    const css = readFileSync(join(import.meta.dirname, 'motion.css'), 'utf8');
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: no-preference\)[\s\S]*:root\[data-theme\] \[data-reveal\]:not\(\[data-revealed\]\)/,
    );
  });
});
