import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const OUT = join(process.cwd(), 'out');
const prefix = process.env.BASE_PATH ?? '';

const read = (path: string) => readFileSync(join(OUT, path), 'utf8');

const htmlFiles = (readdirSync(OUT, { recursive: true }) as string[])
  .filter((file) => file.endsWith('.html'))
  .map((file) => ({ file, html: read(file) }));

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

  it('hides Work while nothing is published', () => {
    const home = read('index.html');
    expect(home).not.toContain('id="work"');
    expect(home).not.toContain('See my work');
    expect(home).not.toContain(`href="${prefix}/#work"`);
  });

  it('ships no placeholder copy', () => {
    for (const { file, html } of htmlFiles) {
      expect(html, file).not.toMatch(/Project Title|lorem|TODO|Add your own projects/i);
    }
  });

  it('renders real token values on /system', () => {
    const system = read('system/index.html');
    expect(system).toContain('color-accent-default');
    expect(system).toContain('#F5B544');
    expect(system).toContain('#9A5B00');
  });

  it('prefixes internal links with the base path', () => {
    expect(read('index.html')).toContain(`href="${prefix}/system/"`);
    if (prefix) {
      for (const { file, html } of htmlFiles) {
        expect(html, file).not.toContain('href="/system/"');
        expect(html, file).not.toContain('href="/about/"');
      }
    }
  });

  it('has no LinkedIn link while none is set', () => {
    expect(read('index.html')).not.toContain('linkedin.com');
  });
});
