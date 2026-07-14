import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { ProductTile } from "@/components/ui/product-tile";
import { TxMediaPushTool } from "@/components/tools/tx-media-push-tool";

export const metadata: Metadata = {
  title: "腾讯媒资推送",
  description: "查询腾讯媒资数据并推送到同步服务",
};

export default function TxMediaPushPage() {
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
          <h1 className="text-display-lg">腾讯媒资推送</h1>
        </header>

        <TxMediaPushTool />
      </div>
    </ProductTile>
  );
}
