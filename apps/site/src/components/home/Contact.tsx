import { profile } from '@content/profile';
import { Section } from '../Section';
import styles from './Contact.module.css';

export function Contact() {
  const links = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'GitHub', value: 'StylianopoulosChristos', href: profile.links.github },
    ...(profile.links.linkedin
      ? [{ label: 'LinkedIn', value: 'LinkedIn profile', href: profile.links.linkedin }]
      : []),
  ];

  return (
    <Section id="contact" label="Contact" title="Let's talk">
      <p className={styles.intro}>{profile.availability}. Based in Athens, Greece.</p>
      <ul className={styles.links}>
        {links.map((link) => (
          <li key={link.label}>
            <span className={styles.label}>{link.label}</span>
            <a href={link.href}>{link.value}</a>
          </li>
        ))}
      </ul>
    </Section>
  );
}
