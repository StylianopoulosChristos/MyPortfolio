'use client';

import { useEffect } from 'react';

// Marks each [data-reveal] element with data-revealed once it scrolls into
// view; motion.css animates that change. Mounted per page by app/template.tsx.
export function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll('[data-reveal]:not([data-revealed])');
    const reveal = (el: Element) => el.setAttribute('data-revealed', '');

    if (typeof IntersectionObserver !== 'function') {
      targets.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
