import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ProductTile } from "@/components/ui/product-tile";
import { JsonFormatterTool } from "@/components/tools/json-formatter-tool";

export const metadata: Metadata = {
  title: "JSON 格式化",
  description: "在线 JSON 格式化与压缩工具",
};

export default function JsonFormatterPage() {
  return (
    <ProductTile variant="light">
      <div className="mx-auto max-w-[var(--grid-max)]">
        <Link
          href="/tools"
          className="mb-6 inline-flex items-center gap-1 text-[14px] text-ink-muted-80 hover:text-primary"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          返回工具列表
        </Link>

        <header className="mb-10">
          <h1 className="text-display-lg">JSON 格式化</h1>
        </header>

        <JsonFormatterTool />
      </div>
    </ProductTile>
  );
}
