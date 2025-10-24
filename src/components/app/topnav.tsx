'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Dashboard" },
  { href: "/onboarding", label: "Onboarding" },
  { href: "/employees", label: "Employees" },
  { href: "/assets", label: "Assets" },
  { href: "/licenses", label: "Licenses" },
  { href: "/requests", label: "Requests" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-2 text-sm">
      {items.map((it) => {
        const active = pathname === it.href;
        return (
          <Link
            key={it.href}
            href={it.href}
            className={`px-3 py-2 rounded-xl hover:bg-gray-100 ${active ? "bg-gray-200 font-medium" : ""}`}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
