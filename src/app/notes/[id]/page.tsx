import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MarkdownRenderer } from "@/components/notes/markdown-renderer";
import { ProductTile } from "@/components/ui/product-tile";
import { getPublishedNoteById } from "@/lib/notes";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = await getPublishedNoteById(id);

  if (!note) {
    return { title: "笔记未找到" };
  }

  return {
    title: note.title,
    description: note.content.slice(0, 160),
    openGraph: {
      title: note.title,
      description: note.content.slice(0, 160),
      type: "article",
    },
  };
}

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await getPublishedNoteById(id);

  if (!note) {
    notFound();
  }

  return (
    <>
      <ProductTile variant="parchment" className="!py-12 md:!py-16">
        <article className="mx-auto max-w-[var(--content-max)]">
          <Link
            href="/notes"
            className="text-[14px] text-primary hover:underline"
          >
            ← 返回笔记列表
          </Link>

          <header className="mt-6 border-b border-hairline pb-8">
            <h1 className="text-display-lg">{note.title}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-fine-print text-ink-muted-48">
              <time dateTime={note.updatedAt.toISOString()}>
                更新于 {formatDate(note.updatedAt)}
              </time>
              {note.publishedAt && (
                <time dateTime={note.publishedAt.toISOString()}>
                  · 发布于 {formatDate(note.publishedAt)}
                </time>
              )}
              {note.folder && <span>· {note.folder.name}</span>}
            </div>

            {note.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {note.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${encodeURIComponent(tag.name)}`}
                    className="rounded-pill bg-canvas px-3 py-1 text-[12px] text-ink-muted-80 hover:text-primary"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <div className="mt-8">
            <MarkdownRenderer content={note.content} />
          </div>
        </article>
      </ProductTile>
    </>
  );
}
