import { prisma } from "@/lib/db";

export async function getPublishedBookmarks() {
  const categories = await prisma.bookmarkCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      bookmarks: {
        where: { published: true },
        orderBy: { name: "asc" },
      },
    },
  });

  return categories.filter((c) => c.bookmarks.length > 0);
}

export async function getUncategorizedBookmarks() {
  return prisma.bookmark.findMany({
    where: {
      published: true,
      categoryId: null,
    },
    orderBy: { name: "asc" },
  });
}
