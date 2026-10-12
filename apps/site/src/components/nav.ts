export interface NavItem {
  label: string;
  href: string;
}

// Work only appears once a case study is published, so the nav never
// points at an empty section.
export function getNavItems(hasWork: boolean): NavItem[] {
  return [
    ...(hasWork ? [{ label: 'Work', href: '/#work' }] : []),
    { label: 'System', href: '/system' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/#contact' },
  ];
}
