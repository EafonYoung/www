import type { Metadata } from "next";
import { GlobeIcon } from "lucide-react";
import { ProductTile } from "@/components/ui/product-tile";
import {
  getPublishedBookmarks,
  getUncategorizedBookmarks,
} from "@/lib/bookmarks";

export const metadata: Metadata = {
  title: "书签",
  description: "常用开发资源与工具网站",
};

export const dynamic = "force-dynamic";
export const revalidate = 300;

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default async function BookmarksPage() {
  const [categories, uncategorized] = await Promise.all([
    getPublishedBookmarks(),
    getUncategorizedBookmarks(),
  ]);

  const isEmpty = categories.length === 0 && uncategorized.length === 0;

  return (
    <ProductTile variant="light">
      <div className="mx-auto max-w-[var(--grid-max)]">
        <header className="mb-10">
          <h1 className="text-display-lg">书签</h1>
          <p className="mt-2 text-[17px] text-ink-muted-80">
            常用开发资源与工具网站收录
          </p>
        </header>

        {isEmpty ? (
          <p className="rounded-lg border border-dashed border-hairline py-20 text-center text-ink-muted-48">
            暂无书签
          </p>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => (
              <section key={category.id}>
                <h2 className="text-tagline mb-4">{category.name}</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {category.bookmarks.map((bookmark) => (
                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
              </section>
            ))}

            {uncategorized.length > 0 && (
              <section>
                <h2 className="text-tagline mb-4">未分类</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {uncategorized.map((bookmark) => (
                    <BookmarkCard key={bookmark.id} bookmark={bookmark} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </ProductTile>
  );
}

function BookmarkCard({
  bookmark,
}: {
  bookmark: {
    id: string;
    name: string;
    url: string;
    icon: string | null;
  };
}) {
  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-4 transition-colors hover:border-primary/30"
    >
      {bookmark.icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bookmark.icon}
          alt=""
          className="h-5 w-5 shrink-0 rounded"
        />
      ) : (
        <GlobeIcon className="h-5 w-5 shrink-0 text-ink-muted-48" />
      )}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[14px] font-semibold">{bookmark.name}</h3>
        <p className="truncate text-[12px] text-ink-muted-48">
          {extractDomain(bookmark.url)}
        </p>
      </div>
    </a>
  );
}
