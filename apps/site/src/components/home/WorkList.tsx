import Link from 'next/link';
import type { CaseStudyMeta } from '@content/types';
import { Section } from '../Section';
import styles from './WorkList.module.css';

export function WorkList({ studies }: { studies: Array<{ slug: string; meta: CaseStudyMeta }> }) {
  return (
    <Section id="work" label="Selected work" title="Case studies">
      <ul className={styles.list}>
        {studies.map(({ slug, meta }) => (
          <li key={slug}>
            <Link href={`/work/${slug}`} className={styles.card}>
              <h3>{meta.title}</h3>
              <p className={styles.summary}>{meta.summary}</p>
              <p className={styles.tools}>{meta.tools.join(' · ')}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
