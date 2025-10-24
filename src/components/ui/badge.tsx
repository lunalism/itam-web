import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "success" | "warning" | "destructive" | "info";

const map: Record<Variant,string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-800",
  destructive: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
};

export function Badge({children, className, variant = "default"}: {children: React.ReactNode, className?: string, variant?: Variant}){
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", map[variant], className)}>{children}</span>;
}
