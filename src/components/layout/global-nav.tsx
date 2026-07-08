"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/notes", label: "笔记" },
  { href: "/bookmarks", label: "书签" },
];

export function GlobalNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface-black text-body-on-dark">
      <nav
        className="mx-auto flex h-[var(--nav-height)] max-w-[var(--grid-max)] items-center justify-between px-6"
        aria-label="主导航"
      >
        <Link
          href="/"
          className="text-nav-link font-medium tracking-tight text-body-on-dark"
        >
          eafon.net
        </Link>

        <ul className="hidden items-center gap-5 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "text-nav-link text-body-on-dark/80 hover:text-body-on-dark",
                  pathname === item.href && "text-body-on-dark"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label={open ? "关闭菜单" : "打开菜单"}
          onClick={() => setOpen(!open)}
        >
          {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 md:hidden">
          <ul className="flex flex-col px-6 py-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block py-3 text-nav-link text-body-on-dark/80",
                    pathname === item.href && "text-body-on-dark"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
