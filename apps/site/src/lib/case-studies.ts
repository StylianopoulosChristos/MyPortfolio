import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ComponentType } from 'react';
import type { CaseStudyMeta } from '@content/types';

// process.cwd() is apps/site for next build, next dev and vitest alike.
export const CASE_STUDY_DIR = join(process.cwd(), 'content', 'work');

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

const isString = (value: unknown) => typeof value === 'string';

const FIELDS: Record<keyof CaseStudyMeta, (value: unknown) => boolean> = {
  title: isString,
  summary: isString,
  role: isString,
  timeline: isString,
  tools: (value) => Array.isArray(value) && value.every(isString),
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

type CaseStudyModule = { meta?: unknown; default: ComponentType };

async function loadCaseStudy(slug: string) {
  const mod = (await import(`../../content/work/${slug}.mdx`)) as CaseStudyModule;
  return { meta: parseCaseStudyMeta(mod.meta, `content/work/${slug}.mdx`), Content: mod.default };
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
