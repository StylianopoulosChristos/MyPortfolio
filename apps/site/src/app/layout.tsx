import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { ReactNode } from 'react';
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
