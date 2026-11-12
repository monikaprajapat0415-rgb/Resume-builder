import { finish } from '../kit.js';
import { lessons as p1 } from './part1.js';
import { lessons as p2 } from './part2.js';
import { lessons as p3 } from './part3.js';
import { lessons as p4 } from './part4.js';
import { lessons as p5 } from './part5.js';

export const course = {
  title: 'DevOps and Cloud Engineering: Complete Course from Beginner to Advanced',
  slug: 'devops-cloud-engineering-course',
  summary: 'Learn DevOps and cloud engineering step by step: Linux, networking, Git, CI/CD, cloud basics, then AWS, Docker, Kubernetes, Terraform, monitoring and SRE, with scripts that really ran.',
  description: 'Free DevOps and cloud course for beginners: Linux, networking, Git, GitHub Actions and cloud basics with tested scripts. Docker, Kubernetes and AWS follow.',
  level: 'Beginner to Advanced',
  topic: 'DevOps and Cloud',
  badge: 'OPS',
  tags: ['devops', 'cloud', 'linux', 'networking', 'ci/cd', 'github actions', 'aws', 'docker', 'kubernetes', 'terraform'],
  order: 44,
  published: true,
  minWords: 600,
  metaTitle: 'DevOps and Cloud Engineering Course',
  keywords: 'devops course for beginners, cloud engineering course, learn devops free, linux for devops, devops roadmap, ci cd tutorial, github actions tutorial',
};
export const lessons = finish([...p1, ...p2, ...p3, ...p4, ...p5]);
