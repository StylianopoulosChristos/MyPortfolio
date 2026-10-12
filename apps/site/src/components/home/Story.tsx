import { story } from '@content/story';
import { Section } from '../Section';
import styles from './Story.module.css';

export function Story() {
  return (
    <Section label="Story" title="How I got to design systems">
      <ol className={styles.steps}>
        {story.map((step) => (
          <li key={step.title} className={styles.step}>
            <p className={styles.period}>{step.period}</p>
            <h3>{step.title}</h3>
            <p className={styles.summary}>{step.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
