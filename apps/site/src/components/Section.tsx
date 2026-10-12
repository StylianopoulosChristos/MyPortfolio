import type { ReactNode } from 'react';
import { Container } from './Container';
import styles from './Section.module.css';

interface SectionProps {
  id?: string;
  /** Small mono label above the heading. */
  label: string;
  title: string;
  children: ReactNode;
}

export function Section({ id, label, title, children }: SectionProps) {
  const headingId = `${id ?? label.toLowerCase().replace(/\W+/g, '-')}-heading`;
  return (
    <section id={id} className={styles.section} aria-labelledby={headingId}>
      <Container>
        <p className={styles.label}>{label}</p>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {children}
      </Container>
    </section>
  );
}
