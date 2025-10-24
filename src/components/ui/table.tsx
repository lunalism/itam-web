import * as React from "react";
export function Table({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto rounded-xl border border-[rgb(var(--border))]"><table className="w-full text-sm">{children}</table></div>;
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-[rgb(var(--muted))] text-gray-600">{children}</thead>;
}
export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-[rgb(var(--border))]">{children}</tbody>;
}
export function TR({ children }: { children: React.ReactNode }) { return <tr>{children}</tr>; }
export function TH({ children }: { children: React.ReactNode }) { return <th className="text-left font-medium px-4 py-3">{children}</th>; }
export function TD({ children }: { children: React.ReactNode }) { return <td className="px-4 py-3">{children}</td>; }
