import { Section } from '../components/Section';
import { Contact } from '../components/home/Contact';
import { ExperienceList } from '../components/home/ExperienceList';
import { Hero } from '../components/home/Hero';
import { Skills } from '../components/home/Skills';
import { Story } from '../components/home/Story';
import { WorkList } from '../components/home/WorkList';
import { getPublishedCaseStudies } from '../lib/case-studies';

export default async function Home() {
  const studies = await getPublishedCaseStudies();
  const hasWork = studies.length > 0;

  return (
    <>
      <Hero hasWork={hasWork} />
      {hasWork ? <WorkList studies={studies} /> : null}
      <Story />
      <Skills />
      <Section label="Experience" title="Where I've worked">
        <ExperienceList />
      </Section>
      <Contact />
    </>
  );
}
