import type { SkillGroup } from './types';

export const skills = [
  {
    name: 'Design Systems',
    items: ['Design tokens', 'Component API design', 'Documentation', 'Accessibility'],
  },
  { name: 'UI Engineering', items: ['React', 'TypeScript', 'CSS', 'React Native'] },
  {
    name: 'Design',
    items: ['Responsive UI/UX mockups', 'Figma variables', 'Figma components', 'Auto layout'],
  },
  { name: 'Also', items: ['WordPress', 'Elementor', 'Divi 5', 'PHP', 'SQL'], minor: true },
] satisfies SkillGroup[];
