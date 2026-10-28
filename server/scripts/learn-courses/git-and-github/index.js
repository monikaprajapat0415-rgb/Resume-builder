import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
export const course = {
  title: 'Git and GitHub Essentials: Version Control for Beginners',
  slug: 'git-and-github-course',
  summary: 'Learn Git and GitHub in 10 short lessons: commits, undoing mistakes, branches, merge conflicts, remotes, pull requests, good habits and using GitHub in your job search.',
  description: 'Free Git and GitHub course for beginners. 10 lessons with real terminal sessions: commits, branches, merge conflicts, pull requests, secrets and portfolio tips.',
  level: 'Beginner',
  topic: 'Developer tools',
  badge: 'GIT',
  tags: ['git', 'github', 'version control', 'pull requests', 'developer tools'],
  order: 38,
  published: true,
  minWords: 600,
  metaTitle: 'Git and GitHub: Free Course',
  keywords: 'git and github for beginners, learn git free, git tutorial, github tutorial, merge conflict, pull request, git commands',
};
export const lessons = finish([...p1, ...p2]);
