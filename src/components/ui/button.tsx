import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const base = "inline-flex items-center justify-center font-medium rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] disabled:opacity-50 disabled:pointer-events-none";
const variants: Record<Variant, string> = {
  default: "bg-[rgb(var(--primary))] text-[rgb(var(--primary-fg))] hover:opacity-90",
  outline: "border border-[rgb(var(--border))] bg-transparent text-[rgb(var(--fg))] hover:bg-[rgb(var(--muted))]",
  ghost: "bg-transparent hover:bg-[rgb(var(--muted))] text-[rgb(var(--fg))]",
};
const sizes: Record<Size, string> = { sm: "h-8 px-3 text-sm", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-base" };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => (
    <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  )
);
Button.displayName = "Button";
