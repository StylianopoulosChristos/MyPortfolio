import type { MDXComponents } from 'mdx/types';

// Required by @next/mdx for the App Router. Map MDX elements to design-system
// components here once packages/ui exists (Phase 3).
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return components;
}
