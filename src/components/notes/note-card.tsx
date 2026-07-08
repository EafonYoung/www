import Link from "next/link";
import { formatDate, excerpt } from "@/lib/utils";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  updatedAt: Date | string;
  tags?: { tag: { name: string } }[];
}

export function NoteCard({ id, title, content, updatedAt, tags }: NoteCardProps) {
  return (
    <article className="group rounded-lg border border-hairline bg-canvas p-6 transition-colors hover:border-primary/30">
      <Link href={`/notes/${id}`} className="block space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-body-strong text-[17px] font-semibold leading-snug group-hover:text-primary">
            {title}
          </h3>
          <time className="shrink-0 text-fine-print text-ink-muted-48">
            {formatDate(updatedAt)}
          </time>
        </div>

        <p className="line-clamp-3 text-[17px] leading-relaxed text-ink-muted-80">
          {excerpt(content)}
        </p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map(({ tag }) => (
              <span
                key={tag.name}
                className="rounded-pill bg-canvas-parchment px-3 py-1 text-[12px] text-ink-muted-80"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
