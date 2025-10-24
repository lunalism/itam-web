import * as React from "react";
import { cn } from "@/lib/utils";
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2 text-sm",
        "placeholder-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";
