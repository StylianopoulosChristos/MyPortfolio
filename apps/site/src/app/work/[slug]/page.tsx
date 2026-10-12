import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '../../../components/Container';
import { EMPTY_SLUG, getCaseStudy, getPublishedCaseStudies } from '../../../lib/case-studies';
import styles from './page.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export async function generateStaticParams() {
  const studies = await getPublishedCaseStudies();
  return studies.length > 0 ? studies.map(({ slug }) => ({ slug })) : [{ slug: EMPTY_SLUG }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getCaseStudy((await params).slug);
  return study ? { title: study.meta.title, description: study.meta.summary } : {};
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const study = slug === EMPTY_SLUG ? null : await getCaseStudy(slug);
  if (!study) notFound();

  const { meta, Content } = study;
  return (
    <Container className={styles.page}>
      <h1>{meta.title}</h1>
      <p className={styles.summary}>{meta.summary}</p>
      <dl className={styles.overview}>
        <div>
          <dt>Role</dt>
          <dd>{meta.role}</dd>
        </div>
        <div>
          <dt>Timeline</dt>
          <dd>{meta.timeline}</dd>
        </div>
        <div>
          <dt>Tools</dt>
          <dd>{meta.tools.join(' · ')}</dd>
        </div>
      </dl>
      <article className={styles.body}>
        <Content />
      </article>
    </Container>
  );
}
