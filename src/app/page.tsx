import { Button } from "@/components/ui/button";
import { ProductTile } from "@/components/ui/product-tile";
import { NoteCard } from "@/components/notes/note-card";
import { getPublishedNotes } from "@/lib/notes";
import { getSiteConfigs } from "@/lib/site-config";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const [notes, config] = await Promise.all([
    getPublishedNotes({ limit: 5 }),
    getSiteConfigs(["hero.title", "hero.subtitle"]),
  ]);

  return (
    <>
      <ProductTile variant="light">
        <div className="mx-auto max-w-[var(--content-max)] text-center">
          <h1 className="text-hero-display text-ink">{config["hero.title"]}</h1>
          <p className="text-lead mx-auto mt-4 max-w-2xl text-ink-muted-80">
            {config["hero.subtitle"]}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href="/notes">浏览笔记</Button>
            <Button href="/bookmarks" variant="secondary">
              常用链接
            </Button>
          </div>
        </div>
      </ProductTile>

      <ProductTile variant="parchment">
        <div className="mx-auto max-w-[var(--content-max)]">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-display-lg">最新笔记</h2>
              <p className="mt-2 text-[17px] text-ink-muted-80">
                从 DevHub 精选发布的技术文章
              </p>
            </div>
            <Button href="/notes" variant="text" className="shrink-0">
              查看全部 →
            </Button>
          </div>

          {notes.length === 0 ? (
            <p className="rounded-lg border border-dashed border-hairline py-16 text-center text-ink-muted-48">
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
        </div>
      </ProductTile>

      <ProductTile variant="dark">
        <div className="mx-auto max-w-[var(--content-max)] text-center">
          <h2 className="text-display-lg text-body-on-dark">书签导航</h2>
          <p className="text-lead mx-auto mt-4 max-w-xl text-body-muted">
            常用开发资源与工具网站收录
          </p>
          <div className="mt-8">
            <Button href="/bookmarks" variant="text-on-dark">
              浏览书签 →
            </Button>
          </div>
        </div>
      </ProductTile>
    </>
  );
}
