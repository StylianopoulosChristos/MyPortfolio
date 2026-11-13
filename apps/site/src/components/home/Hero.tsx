import Link from 'next/link';
import type { CSSProperties } from 'react';
import { profile } from '@content/profile';
import { Container } from '../Container';
import { HeroPanel } from './HeroPanel';
import styles from './Hero.module.css';

// Entrance order: each step waits one --duration-fast longer than the last.
const enterAt = (step: number) =>
  ({ '--enter-delay': `calc(var(--duration-fast) * ${step})` }) as CSSProperties;

export function Hero({ hasWork }: { hasWork: boolean }) {
  return (
    <Container className={styles.hero}>
      <div>
        <p className={`${styles.pill} enter`} style={enterAt(0)}>
          <span className={styles.dot} aria-hidden="true" />
          {profile.availability}
        </p>
        <h1 className={`${styles.headline} enter`} style={enterAt(1)}>
          {profile.headline}
        </h1>
        <p className={`${styles.sub} enter`} style={enterAt(2)}>
          {profile.title}. {profile.subline}
        </p>
        <div className={`${styles.ctas} enter`} style={enterAt(3)}>
          {hasWork ? (
            <Link href="/#work" className={styles.primary}>
              See my work
            </Link>
          ) : null}
          <Link href="/system" className={hasWork ? styles.secondary : styles.primary}>
            Explore the system <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
      <div className="enter" style={enterAt(4)}>
        <HeroPanel />
      </div>
    </Container>
  );
}
