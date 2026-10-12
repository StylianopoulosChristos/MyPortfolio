import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef } from 'react';
import { assetPath } from './lib/asset-path';

// Case studies are written with root-relative URLs ([System](/system),
// ![Diagram](/diagram.png)). Those must carry the site's base path, or they
// 404 on the GitHub Pages project URL.
const isRootRelative = (url: unknown): url is string =>
  typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

function MdxLink({ href, ...props }: ComponentPropsWithoutRef<'a'>) {
  if (isRootRelative(href)) return <Link href={href} {...props} />;
  return <a href={href} {...props} />;
}

function MdxImage({ src, alt, ...props }: ComponentPropsWithoutRef<'img'>) {
  return (
    // Static export: next/image optimization is off, so a plain <img> is the right element.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={isRootRelative(src) ? assetPath(src) : src} alt={alt ?? ''} {...props} />
  );
}

// Required by @next/mdx for the App Router. Phase 3 maps more elements to
// packages/ui components here.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { a: MdxLink, img: MdxImage, ...components };
}
