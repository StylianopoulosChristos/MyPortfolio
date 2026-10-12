import type { Metadata } from 'next';
import { education } from '@content/experience';
import { profile } from '@content/profile';
import { Container } from '../../components/Container';
import { Section } from '../../components/Section';
import { ExperienceList } from '../../components/home/ExperienceList';
import { Story } from '../../components/home/Story';
import { assetPath } from '../../lib/asset-path';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'About' };

export default function About() {
  return (
    <>
      <Container className={styles.intro}>
        <h1>About</h1>
        <p className={styles.framing}>{profile.framing}</p>
        {profile.cvPath ? (
          <a href={assetPath(profile.cvPath)} className={styles.cv}>
            Download CV
          </a>
        ) : null}
      </Container>
      <Story />
      <Section label="Experience" title="Where I've worked">
        <ExperienceList detailed />
      </Section>
      <Section label="Education" title="Education">
        <ul className={styles.education}>
          {education.map((entry) => (
            <li key={entry.degree}>
              <h3>{entry.degree}</h3>
              <p>
                {entry.school} · {entry.year}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
