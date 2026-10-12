// next/link adds basePath to page links, but plain <a href> to files in
// public/ (e.g. the CV) does not. Server components only: reads build-time env.
export function assetPath(path: string): string {
  return `${process.env.BASE_PATH ?? ''}${path}`;
}
