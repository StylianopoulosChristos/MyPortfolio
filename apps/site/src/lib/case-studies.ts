import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ComponentType } from 'react';
import type { CaseStudyMeta } from '@content/types';

// process.cwd() is apps/site for next build, next dev and vitest alike.
export const CASE_STUDY_DIR = join(process.cwd(), 'content', 'work');

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Static export rejects an empty generateStaticParams list, so /work/[slug]
// emits this one param (which renders the 404) while nothing is published.
export const EMPTY_SLUG = '_';

export function listCaseStudySlugs(dir: string = CASE_STUDY_DIR): string[] {
  return readdirSync(dir)
    .filter((file) => file.endsWith('.mdx') && !file.startsWith('_'))
    .map((file) => {
      const slug = file.slice(0, -'.mdx'.length);
      if (!SLUG.test(slug)) {
        throw new Error(`content/work/${file}: file name must be lowercase-kebab-case`);
      }
      return slug;
    });
}

// Blank text would ship an empty heading or card, so it counts as missing.
const isText = (value: unknown) => typeof value === 'string' && value.trim() !== '';

const FIELDS: Record<keyof CaseStudyMeta, (value: unknown) => boolean> = {
  title: isText,
  summary: isText,
  role: isText,
  timeline: isText,
  tools: (value) => Array.isArray(value) && value.length > 0 && value.every(isText),
  order: (value) => typeof value === 'number' && Number.isFinite(value),
  published: (value) => typeof value === 'boolean',
};

export function parseCaseStudyMeta(raw: unknown, file: string): CaseStudyMeta {
  const record = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>;
  for (const [field, isValid] of Object.entries(FIELDS)) {
    if (!isValid(record[field])) throw new Error(`${file}: missing or invalid "${field}"`);
  }
  return record as unknown as CaseStudyMeta;
}

const TEMPLATE_TEXT_FIELDS = ['title', 'summary', 'role', 'timeline'] as const;

// A copied template published without editing would ship its sample copy.
export function assertNotTemplate(
  meta: CaseStudyMeta,
  template: CaseStudyMeta,
  file: string,
): void {
  for (const field of TEMPLATE_TEXT_FIELDS) {
    if (meta[field] === template[field]) {
      throw new Error(`${file}: "${field}" still has the template's sample text`);
    }
  }
}

type CaseStudyModule = { meta?: unknown; default: ComponentType };

async function loadCaseStudy(slug: string) {
  const file = `content/work/${slug}.mdx`;
  const mod = (await import(`../../content/work/${slug}.mdx`)) as CaseStudyModule;
  const meta = parseCaseStudyMeta(mod.meta, file);
  if (meta.published) {
    const template = (await import('../../content/work/_template.mdx')) as CaseStudyModule;
    assertNotTemplate(meta, parseCaseStudyMeta(template.meta, 'content/work/_template.mdx'), file);
  }
  return { meta, Content: mod.default };
}

export async function getPublishedCaseStudies(): Promise<
  Array<{ slug: string; meta: CaseStudyMeta }>
> {
  const studies = await Promise.all(
    listCaseStudySlugs().map(async (slug) => ({ slug, meta: (await loadCaseStudy(slug)).meta })),
  );
  return studies.filter(({ meta }) => meta.published).sort((a, b) => a.meta.order - b.meta.order);
}

export async function getCaseStudy(
  slug: string,
): Promise<{ meta: CaseStudyMeta; Content: ComponentType } | null> {
  if (!listCaseStudySlugs().includes(slug)) return null;
  const study = await loadCaseStudy(slug);
  return study.meta.published ? study : null;
}
