'use client';

import { base, themes } from '@cs/tokens';
import { profile } from '@content/profile';
import { useTheme } from '../../theme/useTheme';
import styles from './HeroPanel.module.css';

// A live component next to the tokens it is built from. The color value
// follows the theme toggle, showing the semantic layer remap in real time.
export function HeroPanel() {
  // Before hydration the theme is unknown; dark is the default theme.
  const theme = useTheme() ?? 'dark';
  const rows = [
    {
      property: 'background',
      token: 'color-accent-default',
      value: themes[theme]['color-accent-default'],
    },
    { property: 'radius', token: 'radius-md', value: base['radius-md'] },
    { property: 'label', token: 'font-size-small', value: base['font-size-small'] },
  ];

  return (
    <figure className={styles.panel}>
      <figcaption className={styles.caption}>
        &lt;Button variant=&quot;primary&quot; /&gt;
      </figcaption>
      <div className={styles.stage}>
        <a href={`mailto:${profile.email}`} className={styles.button}>
          Get in touch
        </a>
      </div>
      <dl className={styles.tokens}>
        {rows.map((row) => (
          <div key={row.token} className={styles.row}>
            <dt>{row.property}</dt>
            <dd>
              <code>{`--${row.token}`}</code>
              <span className={styles.value}>{row.value}</span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
