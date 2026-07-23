import type { Metadata } from "next";
import Link from "next/link";
import {
  BookUpIcon,
  BracesIcon,
  ClockArrowRightIcon,
  type LucideIcon,
} from "lucide-react";
import { ProductTile } from "@/components/ui/product-tile";

export const metadata: Metadata = {
  title: "工具",
  description: "常用开发工具集合",
};

const tools: {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    slug: "tx-media-push",
    name: "腾讯媒资推送",
    description: "查询腾讯媒资数据并推送到同步服务",
    icon: BookUpIcon,
  },
  {
    slug: "json-formatter",
    name: "JSON 格式化",
    description: "在线 JSON 格式化与压缩工具",
    icon: BracesIcon,
  },
  {
    slug: "time-converter",
    name: "时间转换",
    description: "时间戳与时间相互转换，支持秒 / 毫秒",
    icon: ClockArrowRightIcon,
  },
];

export default function ToolsPage() {
  return (
    <ProductTile variant="light">
      <div className="mx-auto max-w-[var(--grid-max)]">
        <header className="mb-10">
          <h1 className="text-display-lg">工具</h1>
          <p className="mt-2 text-[17px] text-ink-muted-80">
            常用开发工具，持续补充中
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ slug, name, description, icon: Icon }) => (
            <Link
              key={slug}
              href={`/tools/${slug}`}
              className="flex items-start gap-3 rounded-lg border border-hairline bg-canvas p-4 transition-colors hover:border-primary/30"
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ink-muted-48" />
              <div className="min-w-0 flex-1">
                <h2 className="text-[15px] font-semibold">{name}</h2>
                <p className="mt-1 text-[13px] text-ink-muted-48">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ProductTile>
  );
}
