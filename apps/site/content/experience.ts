import type { Education, Role } from './types';

// Newest first.
export const experience = [
  {
    company: 'Newsphone Hellas',
    title: 'Senior Web Developer',
    start: '2026-05',
    end: 'present',
    bullets: [
      'Design responsive UI/UX mockups for widescreen, tablet and mobile',
      'Manage a small team of WordPress developers',
      'Meet with clients and run a thorough business analysis to define websites that fit their needs',
      'Build websites with Divi 5 and Elementor',
      'Write custom CSS and JavaScript to bridge the gap between the CMS and client requirements',
      'Develop custom API solutions for client-specific needs',
    ],
    tags: ['UI/UX mockups', 'Divi 5', 'Elementor', 'JavaScript', 'Team leadership'],
  },
  {
    company: 'Cosmote E-Value',
    title: 'Application Support Engineer',
    start: '2024-10',
    end: '2026-05',
    bullets: [
      'Supported and improved enterprise web applications, focusing on UI issues, rendering and performance',
      'Debugged layout, responsiveness and cross-browser issues using HTML and CSS',
      'Investigated application behavior with PHP and SQL and worked with external development teams to ship fixes',
    ],
    tags: ['HTML', 'CSS', 'PHP', 'SQL'],
  },
  {
    company: 'Hellenic Army Reserve',
    title: 'Database Developer',
    start: '2021-09',
    end: '2022-03',
    bullets: [
      'Designed and maintained structured databases, ensuring data integrity',
      'Developed and optimized SQL queries and stored procedures, automating data workflows',
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
      'Developed Python and SQL scripts for data transformation and supported database-driven web systems',
      'Progressed from junior role to database analyst within the team',
    ],
    tags: ['Python', 'SQL', 'Data analysis', 'Automation'],
  },
  {
    company: 'Self-Employed (Contract, Remote)',
    title: 'Web Developer',
    start: '2015-09',
    end: '2017-02',
    bullets: [
      'Developed and maintained responsive web applications for clients using PHP, JavaScript, HTML and CSS',
      'Led client calls to gather requirements and turn business needs into application features',
      'Managed PostgreSQL databases, ensuring data integrity and optimized query performance',
    ],
    tags: ['PHP', 'JavaScript', 'PostgreSQL'],
  },
] satisfies Role[];

export const education = [
  { degree: 'BSc Computer Science', school: 'University of West Attica', year: 2020 },
] satisfies Education[];
