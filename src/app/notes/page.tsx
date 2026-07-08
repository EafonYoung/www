import type { Metadata } from "next";
import { NoteCard } from "@/components/notes/note-card";
import { ProductTile } from "@/components/ui/product-tile";
import { countPublishedNotes, getPublishedNotes } from "@/lib/notes";

export const metadata: Metadata = {
  title: "笔记",
  description: "已发布的技术笔记",
};

export const dynamic = "force-dynamic";
export const revalidate = 60;

const PAGE_SIZE = 20;

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1") || 1);
  const tag = params.tag;
  const skip = (page - 1) * PAGE_SIZE;

  const [notes, total] = await Promise.all([
    getPublishedNotes({ tag, limit: PAGE_SIZE, skip }),
    countPublishedNotes(tag),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <ProductTile variant="light">
      <div className="mx-auto max-w-[var(--content-max)]">
        <header className="mb-10">
          <h1 className="text-display-lg">笔记</h1>
          <p className="mt-2 text-[17px] text-ink-muted-80">
            {tag ? `标签：${tag}` : "全部已发布笔记"}
            {total > 0 && ` · 共 ${total} 篇`}
          </p>
        </header>

        {notes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-hairline py-20 text-center text-ink-muted-48">
            暂无已发布笔记
          </p>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                updatedAt={note.updatedAt}
                tags={note.tags}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-center gap-4 text-[14px]"
            aria-label="分页"
          >
            {page > 1 && (
              <a
                href={`/notes?page=${page - 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
                className="text-primary"
              >
                ← 上一页
              </a>
            )}
            <span className="text-ink-muted-48">
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <a
                href={`/notes?page=${page + 1}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`}
                className="text-primary"
              >
                下一页 →
              </a>
            )}
          </nav>
        )}
      </div>
    </ProductTile>
  );
}
