import { prisma } from "@/lib/db";

const publishedNoteWhere = {
  published: true,
  deletedAt: null,
} as const;

export async function getPublishedNotes(options?: {
  tag?: string;
  limit?: number;
  skip?: number;
}) {
  const { tag, limit, skip } = options ?? {};

  return prisma.note.findMany({
    where: {
      ...publishedNoteWhere,
      ...(tag && {
        tags: {
          some: {
            tag: { name: tag },
          },
        },
      }),
    },
    include: {
      folder: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
    orderBy: { updatedAt: "desc" },
    ...(limit !== undefined && { take: limit }),
    ...(skip !== undefined && { skip }),
  });
}

export async function getPublishedNoteById(id: string) {
  return prisma.note.findFirst({
    where: {
      id,
      ...publishedNoteWhere,
    },
    include: {
      folder: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function getPublishedTags() {
  return prisma.tag.findMany({
    where: {
      notes: {
        some: {
          note: publishedNoteWhere,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function countPublishedNotes(tag?: string) {
  return prisma.note.count({
    where: {
      ...publishedNoteWhere,
      ...(tag && {
        tags: {
          some: {
            tag: { name: tag },
          },
        },
      }),
    },
  });
}
