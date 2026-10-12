import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { evaluate } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import { describe, expect, it } from 'vitest';
import {
  assertNotTemplate,
  CASE_STUDY_DIR,
  listCaseStudySlugs,
  parseCaseStudyMeta,
} from './case-studies';

const valid = {
  title: 'A study',
  summary: 'What it was.',
  role: 'Design engineer',
  timeline: '2026',
  tools: ['Figma', 'React'],
  order: 1,
  published: true,
};

function dirWith(...files: string[]) {
  const dir = mkdtempSync(join(tmpdir(), 'case-studies-'));
  for (const file of files) writeFileSync(join(dir, file), '');
  return dir;
}

describe('parseCaseStudyMeta', () => {
  it('accepts a complete meta object', () => {
    expect(parseCaseStudyMeta(valid, 'x.mdx')).toEqual(valid);
  });

  it('names the file and field when title is missing', () => {
    const withoutTitle: Record<string, unknown> = { ...valid };
    delete withoutTitle.title;
    expect(() => parseCaseStudyMeta(withoutTitle, 'x.mdx')).toThrow(
      /x\.mdx: missing or invalid "title"/,
    );
  });

  it('rejects a non-boolean published flag', () => {
    expect(() => parseCaseStudyMeta({ ...valid, published: 'yes' }, 'x.mdx')).toThrow(
      /"published"/,
    );
  });

  it('rejects tools that are not a list of strings', () => {
    expect(() => parseCaseStudyMeta({ ...valid, tools: 'React' }, 'x.mdx')).toThrow(/"tools"/);
  });

  it('rejects empty or whitespace-only text', () => {
    expect(() => parseCaseStudyMeta({ ...valid, title: '  ' }, 'x.mdx')).toThrow(/"title"/);
    expect(() => parseCaseStudyMeta({ ...valid, summary: '' }, 'x.mdx')).toThrow(/"summary"/);
  });

  it('rejects an empty tools list or blank tool names', () => {
    expect(() => parseCaseStudyMeta({ ...valid, tools: [] }, 'x.mdx')).toThrow(/"tools"/);
    expect(() => parseCaseStudyMeta({ ...valid, tools: ['React', ' '] }, 'x.mdx')).toThrow(
      /"tools"/,
    );
  });
});

describe('assertNotTemplate', () => {
  const template = {
    ...valid,
    title: 'Case study title',
    summary: 'One or two sentences for the card on the home page.',
    role: 'Your role on the project',
    timeline: 'e.g. Jan – Mar 2026',
  };

  it('rejects a study that still carries the template sample text', () => {
    expect(() => assertNotTemplate({ ...valid, role: template.role }, template, 'x.mdx')).toThrow(
      /x\.mdx: "role" still has the template's sample text/,
    );
  });

  it('accepts a study with its own text', () => {
    expect(() => assertNotTemplate(valid, template, 'x.mdx')).not.toThrow();
  });
});

describe('listCaseStudySlugs', () => {
  it('lists .mdx files and skips templates and other files', () => {
    expect(listCaseStudySlugs(dirWith('a-study.mdx', '_template.mdx', 'notes.txt'))).toEqual([
      'a-study',
    ]);
  });

  it('rejects file names that are not URL-safe', () => {
    expect(() => listCaseStudySlugs(dirWith('My Study.mdx'))).toThrow(/lowercase-kebab-case/);
  });

  it('reads the real content folder without errors', () => {
    expect(() => listCaseStudySlugs()).not.toThrow();
  });
});

describe('case-study template', () => {
  it('compiles as MDX and carries a valid, unpublished meta', async () => {
    const source = readFileSync(join(CASE_STUDY_DIR, '_template.mdx'), 'utf8');
    const { meta } = await evaluate(source, runtime);
    expect(parseCaseStudyMeta(meta, '_template.mdx').published).toBe(false);
  });
});
