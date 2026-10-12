import type { Metadata } from 'next';
import { base, themes, type ColorToken } from '@cs/tokens';
import { profile } from '@content/profile';
import { Container } from '../../components/Container';
import { Redline } from '../../components/Redline';
import { Section } from '../../components/Section';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'System' };

const colorNames = Object.keys(themes.dark) as ColorToken[];
const baseEntries = Object.entries(base);
const fontSizes = baseEntries.filter(([name]) => name.startsWith('font-size-'));
const spaces = baseEntries
  .filter(([name]) => /^space-\d+$/.test(name))
  .sort(([a], [b]) => Number(a.slice(6)) - Number(b.slice(6)));
const radii = baseEntries.filter(([name]) => name.startsWith('radius-'));

export default function System() {
  const links = [
    { label: 'Source on GitHub', href: profile.links.repo },
    ...(profile.links.storybook ? [{ label: 'Storybook', href: profile.links.storybook }] : []),
    ...(profile.links.figma ? [{ label: 'Figma file', href: profile.links.figma }] : []),
  ];

  return (
    <>
      <Container className={styles.intro}>
        <h1>System</h1>
        <p className={styles.lead}>
          Every value on this site comes from these tokens. Switch the theme in the header to watch
          the semantic layer remap.
        </p>
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label} →</a>
            </li>
          ))}
        </ul>
      </Container>

      <Section label="Color" title="Semantic colors">
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Dark</th>
                <th scope="col">Light</th>
              </tr>
            </thead>
            <tbody>
              {colorNames.map((name) => (
                <tr key={name}>
                  <th scope="row" className={styles.tokenName}>
                    {name}
                  </th>
                  {(['dark', 'light'] as const).map((theme) => (
                    <td key={theme}>
                      <span
                        className={styles.swatch}
                        style={{ backgroundColor: themes[theme][name] }}
                        aria-hidden="true"
                      />
                      <code>{themes[theme][name]}</code>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section label="Type" title="Type scale">
        <ul className={styles.stack}>
          {fontSizes.map(([name, value]) => (
            <li key={name}>
              <p
                className={styles.sample}
                style={{
                  fontSize: `var(--${name})`,
                  lineHeight: `var(--${name.replace('size', 'line-height')})`,
                }}
              >
                Design decisions, systematized
              </p>
              <Redline label={`${name} · ${value}`} />
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Space" title="Spacing">
        <ul className={styles.stack}>
          {spaces.map(([name, value]) => (
            <li key={name} className={styles.row}>
              <span
                className={styles.bar}
                style={{ inlineSize: `var(--${name})` }}
                aria-hidden="true"
              />
              <Redline label={`${name} · ${value}`} />
            </li>
          ))}
        </ul>
      </Section>

      <Section label="Shape" title="Radius">
        <ul className={styles.radii}>
          {radii.map(([name, value]) => (
            <li key={name}>
              <span
                className={styles.radius}
                style={{ borderRadius: `var(--${name})` }}
                aria-hidden="true"
              />
              <Redline label={`${name} · ${value}`} />
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
