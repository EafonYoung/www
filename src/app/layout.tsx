import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GlobalNav } from "@/components/layout/global-nav";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eafon",
    template: "%s · Eafon",
  },
  description: "个人技术门户 — 精选笔记与常用链接",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001"
  ),
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <GlobalNav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
