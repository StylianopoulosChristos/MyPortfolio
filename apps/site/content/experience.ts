import type { Education, Role } from './types';

// Newest first. Add the agency role at the top once its details are confirmed.
export const experience = [
  {
    company: 'Cosmote E-Value',
    title: 'Application Support Engineer',
    start: '2024-10',
    // end: add the month you left, e.g. '2025-06'
    bullets: [
      'Supported and improved enterprise web applications, focusing on UI issues, rendering, and performance',
      'Worked with HTML and CSS to debug layout, responsiveness, and cross-browser compatibility',
      'Investigated application behavior using PHP and SQL, resolving frontend and data-related issues',
      'Collaborated with external development teams to implement fixes and improve user experience',
    ],
    tags: ['HTML', 'CSS', 'PHP', 'SQL'],
  },
  {
    company: 'Hellenic Army Reserve',
    title: 'Database Developer',
    start: '2021-09',
    end: '2022-03',
    bullets: [
      'Designed and maintained structured databases',
      'Developed and optimized SQL queries and stored procedures',
      'Automated data workflows to improve efficiency and consistency',
      'Ensured data integrity and supported data-driven applications',
    ],
    tags: ['SQL', 'Database design', 'Automation'],
  },
  {
    company: 'Freelance (Remote)',
    title: 'Data Analyst / Database Specialist',
    start: '2018-01',
    end: '2020-01',
    bullets: [
      'Automated data reconciliation processes, improving accuracy and efficiency by ~90%',
      'Developed scripts and workflows for data transformation and analysis (Python, SQL)',
      'Supported database-driven applications and backend logic for web systems',
      'Progressed from junior role to database analyst within the team',
    ],
    tags: ['Python', 'SQL', 'Data analysis', 'Automation'],
  },
] satisfies Role[];

export const education = [
  { degree: 'BSc Computer Science', school: 'University of West Attica', year: 2020 },
] satisfies Education[];
