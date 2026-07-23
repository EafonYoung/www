import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ProductTile } from "@/components/ui/product-tile";
import { TimeConverterTool } from "@/components/tools/time-converter-tool";

export const metadata: Metadata = {
  title: "时间转换",
  description: "时间戳与时间相互转换，支持秒 / 毫秒",
};

export default function TimeConverterPage() {
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
          <h1 className="text-display-lg">时间转换</h1>
        </header>

        <TimeConverterTool />
      </div>
    </ProductTile>
  );
}
