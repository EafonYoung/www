import { cn } from "@/lib/utils";

type TileVariant = "light" | "parchment" | "dark" | "dark-2" | "dark-3";

interface ProductTileProps {
  variant?: TileVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<TileVariant, string> = {
  light: "bg-canvas text-ink",
  parchment: "bg-canvas-parchment text-ink",
  dark: "bg-surface-tile-1 text-body-on-dark",
  "dark-2": "bg-surface-tile-2 text-body-on-dark",
  "dark-3": "bg-surface-tile-3 text-body-on-dark",
};

export function ProductTile({
  variant = "light",
  className,
  children,
}: ProductTileProps) {
  return (
    <section
      className={cn(
        "w-full px-6 py-12 md:px-12 md:py-[var(--spacing-section)]",
        variants[variant],
        className
      )}
    >
      <div className="mx-auto w-full max-w-[var(--grid-max)]">{children}</div>
    </section>
  );
}
