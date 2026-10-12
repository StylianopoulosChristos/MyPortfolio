// Shapes for everything in content/. Editing a content file against these
// types means a missing field fails `pnpm typecheck` instead of shipping.

export interface Profile {
  name: string;
  title: string;
  /** First half of the tagline: the hero headline. */
  headline: string;
  /** Second half of the tagline: the line under the headline. */
  subline: string;
  framing: string;
  location: string;
  availability: string;
  email: string;
  links: {
    github: string;
    repo: string;
    linkedin: string | null;
    figma: string | null;
    storybook: string | null;
  };
  /** Path under public/, e.g. '/cv.pdf'. null hides the download link. */
  cvPath: string | null;
}

export interface StoryStep {
  period: string;
  title: string;
  summary: string;
}

/** 'YYYY-MM', e.g. '2024-10'. */
export type YearMonth = `${number}-${number}`;

export interface Role {
  company: string;
  title: string;
  start: YearMonth;
  /** Omit when unknown; 'present' for the current role. */
  end?: YearMonth | 'present';
  bullets: string[];
  tags: string[];
}

export interface Education {
  degree: string;
  school: string;
  year: number;
}

export interface SkillGroup {
  name: string;
  items: string[];
  /** Rendered as one small line instead of a full group. */
  minor?: boolean;
}

export interface CaseStudyMeta {
  title: string;
  summary: string;
  role: string;
  timeline: string;
  tools: string[];
  /** Lower numbers appear first. */
  order: number;
  /** Only published case studies get a page, a card and the Work nav link. */
  published: boolean;
}
