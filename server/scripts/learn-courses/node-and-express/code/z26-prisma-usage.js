// Needs: npm install prisma @prisma/client, then npx prisma migrate dev and a running PostgreSQL.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createUserWithPost() {
  return prisma.user.create({
    data: {
      email: 'asha@example.com',
      name: 'Asha',
      posts: { create: [{ title: 'Hello Prisma' }] },     // creates the user and the post in one call
    },
    include: { posts: true },
  });
}

export const publishedPosts = (page = 1) =>
  prisma.post.findMany({ where: { published: true }, orderBy: { id: 'desc' }, skip: (page - 1) * 10, take: 10 });

// Several changes that must all succeed or all fail:
export const rename = (id, name) =>
  prisma.$transaction([prisma.user.update({ where: { id }, data: { name } }), prisma.post.updateMany({ where: { authorId: id }, data: { title: 'Updated' } })]);
