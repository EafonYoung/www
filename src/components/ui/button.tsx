import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "text" | "text-on-dark";

interface ButtonProps extends React.ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "inline-flex items-center justify-center rounded-pill bg-primary px-[22px] py-[11px] text-[17px] text-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-focus",
  secondary:
    "inline-flex items-center justify-center rounded-pill border border-primary px-[22px] py-[11px] text-[17px] text-primary active:scale-95",
  text: "inline-flex items-center text-[17px] text-primary active:scale-95",
  "text-on-dark":
    "inline-flex items-center text-[17px] text-primary-on-dark active:scale-95",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Link className={cn(variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
