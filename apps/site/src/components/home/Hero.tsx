import Link from 'next/link';
import { profile } from '@content/profile';
import { Container } from '../Container';
import styles from './Hero.module.css';

// The live component + token panel from the mockup arrives in Phase 3, once
// packages/ui has a Button to show.
export function Hero({ hasWork }: { hasWork: boolean }) {
  return (
    <Container className={styles.hero}>
      <p className={styles.pill}>
        <span className={styles.dot} aria-hidden="true" />
        {profile.availability}
      </p>
      <h1 className={styles.headline}>{profile.headline}</h1>
      <p className={styles.sub}>
        {profile.title}. {profile.subline}
      </p>
      <div className={styles.ctas}>
        {hasWork ? (
          <Link href="/#work" className={styles.primary}>
            See my work
          </Link>
        ) : null}
        <Link href="/system" className={hasWork ? styles.secondary : styles.primary}>
          Explore the system
        </Link>
      </div>
    </Container>
  );
}
