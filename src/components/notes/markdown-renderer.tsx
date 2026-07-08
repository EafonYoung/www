import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
  content: string;
}

function normalizeImageUrls(content: string): string {
  return content
    .replace(/!\[([^\]]*)\]\(\/api\/uploads\/([^)]+)\)/g, "![$1](/uploads/$2)")
    .replace(/!\[([^\]]*)\]\(\/uploads\/([^)]+)\)/g, "![$1](/uploads/$2)");
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose-apple max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline-offset-2 hover:underline"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              className="my-6 w-full rounded-sm"
              loading="lazy"
            />
          ),
          pre: ({ children }) => (
            <pre className="my-6 overflow-x-auto rounded-sm bg-canvas-parchment p-4 text-[14px] leading-relaxed">
              {children}
            </pre>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return <code className={className}>{children}</code>;
            }
            return (
              <code className="rounded-xs bg-canvas-parchment px-1.5 py-0.5 text-[15px]">
                {children}
              </code>
            );
          },
        }}
      >
        {normalizeImageUrls(content)}
      </ReactMarkdown>
    </div>
  );
}
