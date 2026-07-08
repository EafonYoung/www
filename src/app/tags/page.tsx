import type { Metadata } from "next";
import Link from "next/link";
import { ProductTile } from "@/components/ui/product-tile";
import { getPublishedTags } from "@/lib/notes";

export const metadata: Metadata = {
  title: "标签",
  description: "笔记标签索引",
};

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default async function TagsPage() {
  const tags = await getPublishedTags();

  return (
    <ProductTile variant="parchment">
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-10">
          <h1 className="text-display-lg">标签</h1>
          <p className="mt-2 text-[17px] text-ink-muted-80">
            按标签浏览已发布笔记
          </p>
        </header>

        {tags.length === 0 ? (
          <p className="text-center text-ink-muted-48">暂无标签</p>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-canvas px-4 py-2 text-[14px] hover:border-primary/30"
                >
                  <span>{tag.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProductTile>
  );
}
