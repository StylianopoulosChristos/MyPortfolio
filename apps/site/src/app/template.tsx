import type { ReactNode } from 'react';
import { RevealObserver } from '../motion/RevealObserver';

// Unlike layout.tsx, a template remounts on every navigation, so the page
// entrance animation and the scroll-reveal observer run again for each page.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <div className="page-enter">
      {children}
      <RevealObserver />
    </div>
  );
}
