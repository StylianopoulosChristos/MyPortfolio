import { experience } from '@content/experience';
import { formatPeriod } from '../../lib/format-period';
import styles from './ExperienceList.module.css';

// Compact on the home page; `detailed` adds bullets and tags for /about.
export function ExperienceList({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={styles.roles}>
      {experience.map((role) => (
        <li key={`${role.company}-${role.start}`} className={styles.role}>
          <p className={styles.period}>{formatPeriod(role.start, role.end)}</p>
          <div>
            <h3>{role.title}</h3>
            <p className={styles.company}>{role.company}</p>
            {detailed ? (
              <>
                <ul className={styles.bullets}>
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
                <p className={styles.tags}>{role.tags.join(' · ')}</p>
              </>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
