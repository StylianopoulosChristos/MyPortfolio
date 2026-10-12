import { profile } from '@content/profile';
import { Container } from './Container';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <p className={styles.source}>
          This site is built with my own design system.{' '}
          <a href={profile.links.repo}>View the source →</a>
        </p>
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>{profile.location}</p>
      </Container>
    </footer>
  );
}
