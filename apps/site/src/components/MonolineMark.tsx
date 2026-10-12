import styles from './MonolineMark.module.css';

interface MonolineMarkProps {
  /** Rendered height in px; width follows the 44:32 viewBox. */
  size?: number;
  /** In viewBox units. Thicker strokes keep small sizes legible (spec §4.1). */
  strokeWidth?: number;
  /** Accessible name. Omit when the mark sits next to visible text. */
  title?: string;
}

// The C is an open circle of radius r; the S is two stacked half-circles of r/2.
export function MonolineMark({ size = 32, strokeWidth = 2.6, title }: MonolineMarkProps) {
  return (
    <svg
      viewBox="0 0 44 32"
      width={Math.round((size * 44) / 32)}
      height={size}
      fill="none"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      {...(title ? { role: 'img' } : { 'aria-hidden': true })}
    >
      {title ? <title>{title}</title> : null}
      <path className={styles.c} d="M21.07 8.93 A10 10 0 1 0 21.07 23.07" />
      <path className={styles.s} d="M38.33 8.5 A5 5 0 1 0 34 16 A5 5 0 1 1 29.67 23.5" />
    </svg>
  );
}
