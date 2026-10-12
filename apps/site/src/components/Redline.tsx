import styles from './Redline.module.css';

// A spec-sheet annotation: shows the token behind what's on screen. /system only.
export function Redline({ label }: { label: string }) {
  return <span className={styles.redline}>{label}</span>;
}
