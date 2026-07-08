import Link from "next/link";
import { ProductTile } from "@/components/ui/product-tile";

export default function NotFound() {
  return (
    <ProductTile variant="light">
      <div className="mx-auto max-w-[var(--content-max)] py-20 text-center">
        <h1 className="text-display-lg">页面未找到</h1>
        <p className="mt-4 text-[17px] text-ink-muted-80">
          您访问的页面不存在或已被移除。
        </p>
        <Link href="/" className="mt-8 inline-block text-primary">
          返回首页 →
        </Link>
      </div>
    </ProductTile>
  );
}
