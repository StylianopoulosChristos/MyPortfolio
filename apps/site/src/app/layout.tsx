import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { ReactNode } from 'react';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { getPublishedCaseStudies } from '../lib/case-studies';
import { themeScript } from '../theme/theme';
import '@cs/tokens/tokens.css';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Chris Stylianopoulos — UI / Design Systems Engineer',
    template: '%s · Chris Stylianopoulos',
  },
  description:
    'I turn design decisions into systems: from Figma variables to typed React components.',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const hasWork = (await getPublishedCaseStudies()).length > 0;

  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header hasWork={hasWork} />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
