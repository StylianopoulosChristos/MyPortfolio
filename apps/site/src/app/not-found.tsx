import Link from 'next/link';
import { Container } from '../components/Container';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <Container className={styles.page}>
      <h1 className={styles.title}>Page not found</h1>
      <p className={styles.body}>This page doesn&apos;t exist, or it moved during the rebrand.</p>
      <Link href="/">Back to home</Link>
    </Container>
  );
}
