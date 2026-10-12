import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { profile } from '../content/profile';

// Expectations come from the content and the build, not from today's state,
// so publishing a case study or adding a link never turns this red.
const OUT = join(process.cwd(), 'out');
const prefix = process.env.BASE_PATH ?? '';

const read = (path: string) => readFileSync(join(OUT, path), 'utf8');

const htmlFiles = (readdirSync(OUT, { recursive: true }) as string[])
  .filter((file) => file.endsWith('.html'))
  .map((file) => ({ file, html: read(file) }));

// Every built /work/<slug>/ except the "_" placeholder is a published case study.
const publishedSlugs = existsSync(join(OUT, 'work'))
  ? readdirSync(join(OUT, 'work')).filter(
      (slug) => slug !== '_' && existsSync(join(OUT, 'work', slug, 'index.html')),
    )
  : [];

describe('static export', () => {
  it('emits every route', () => {
    for (const path of ['index.html', 'about/index.html', 'system/index.html', '404.html']) {
      expect(existsSync(join(OUT, path)), path).toBe(true);
    }
  });

  it('shows the new positioning', () => {
    const home = read('index.html');
    expect(home).toContain('UI / Design Systems Engineer');
    expect(home).toContain('I turn design decisions into systems.');
  });

  it('shows Work exactly when a case study is published', () => {
    const home = read('index.html');
    const hasWork = publishedSlugs.length > 0;
    expect(home.includes('id="work"')).toBe(hasWork);
    expect(home.includes('See my work')).toBe(hasWork);
    expect(home.includes(`href="${prefix}/#work"`)).toBe(hasWork);
    for (const slug of publishedSlugs) {
      expect(home).toContain(`href="${prefix}/work/${slug}/"`);
    }
  });

  it('ships no placeholder copy', () => {
    const placeholders =
      /Project Title|lorem|TODO|Add your own projects|Case study title|Your role on the project|One or two sentences for the card/i;
    for (const { file, html } of htmlFiles) {
      expect(html, file).not.toMatch(placeholders);
    }
  });

  it('renders real token values on /system', () => {
    const system = read('system/index.html');
    expect(system).toContain('color-accent-default');
    expect(system).toContain('#F5B544');
    expect(system).toContain('#9A5B00');
  });

  it('prefixes every root-relative link and asset with the base path', () => {
    expect(read('index.html')).toContain(`href="${prefix}/system/"`);
    if (!prefix) return;
    for (const { file, html } of htmlFiles) {
      const unprefixed = [...html.matchAll(/(?:href|src)="(\/[^"]*)"/g)]
        .map((match) => match[1])
        .filter((url) => !url?.startsWith(`${prefix}/`));
      expect(unprefixed, file).toEqual([]);
    }
  });

  it('shows LinkedIn exactly when a profile link is set', () => {
    expect(read('index.html').includes('linkedin.com')).toBe(Boolean(profile.links.linkedin));
  });
});
