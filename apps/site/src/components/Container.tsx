import type { ReactNode } from 'react';
import styles from './Container.module.css';

// Site-level page width. Phase 3 replaces this with packages/ui's Container.
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={className ? `${styles.container} ${className}` : styles.container}>
      {children}
    </div>
  );
}
