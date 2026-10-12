import { skills } from '@content/skills';
import { Section } from '../Section';
import styles from './Skills.module.css';

export function Skills() {
  const groups = skills.filter((group) => !group.minor);
  const minor = skills.filter((group) => group.minor);

  return (
    <Section label="Skills" title="What I work with">
      <div className={styles.groups}>
        {groups.map((group) => (
          <div key={group.name}>
            <h3>{group.name}</h3>
            <ul className={styles.items}>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {minor.map((group) => (
        <p key={group.name} className={styles.minor}>
          {group.name}: {group.items.join(' · ')}
        </p>
      ))}
    </Section>
  );
}
