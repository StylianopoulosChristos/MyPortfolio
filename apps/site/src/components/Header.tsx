import Link from 'next/link';
import { profile } from '@content/profile';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Container } from './Container';
import { MonolineMark } from './MonolineMark';
import { getNavItems } from './nav';
import styles from './Header.module.css';

export function Header({ hasWork }: { hasWork: boolean }) {
  return (
    <header className={styles.header}>
      <Container className={styles.inner}>
        <Link href="/" className={styles.home} aria-label={`${profile.name} — home`}>
          <MonolineMark size={28} strokeWidth={3.2} />
          <span className={styles.name}>{profile.name}</span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.links}>
            {getNavItems(hasWork).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ThemeToggle />
      </Container>
    </header>
  );
}
