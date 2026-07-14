import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-canvas-parchment px-6 py-16 text-ink-muted-80">
      <div className="mx-auto grid max-w-[var(--grid-max)] gap-10 md:grid-cols-3">
        <div>
          <p className="text-caption-strong mb-3 text-ink">站点</p>
          <ul className="text-dense-link space-y-1">
            <li>
              <Link href="/" className="text-ink-muted-80 hover:text-primary">
                首页
              </Link>
            </li>
            <li>
              <Link href="/notes" className="text-ink-muted-80 hover:text-primary">
                笔记
              </Link>
            </li>
            <li>
              <Link
                href="/bookmarks"
                className="text-ink-muted-80 hover:text-primary"
              >
                书签
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-caption-strong mb-3 text-ink">更多</p>
          <ul className="text-dense-link space-y-1">
            <li>
              <a
                href="https://blog.eafon.net"
                className="text-ink-muted-80 hover:text-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                DevHub 后台
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-caption-strong mb-3 text-ink">关于</p>
          <p className="text-fine-print text-ink-muted-48">
            个人技术门户，展示精选笔记与常用链接。
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[var(--grid-max)] border-t border-hairline pt-6">
        <div className="grid grid-cols-1 gap-2 text-center sm:grid-cols-3 sm:items-center">
          <p className="text-fine-print text-ink-muted-48 sm:text-left">
            Copyright © {year} Eafon. All rights reserved.
          </p>
          <p className="text-fine-print text-left text-ink-muted-48 sm:mx-auto sm:w-fit">
            Memento Mori. Live Fully.
            <br />
            向死而生
          </p>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fine-print text-ink-muted-48 hover:text-primary sm:text-right"
          >
            粤ICP备2026091603号-1
          </a>
        </div>
      </div>
    </footer>
  );
}
