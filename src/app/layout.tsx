import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";

const TopNav = dynamic(() => import("@/components/app/topnav"), { ssr: false });

export const metadata: Metadata = { title: "ITAM Dashboard", description: "IT Asset Management" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-full bg-[rgb(var(--muted))] text-[rgb(var(--fg))]">
        <div className="container-max py-6">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">HMGR ITAM</h1>
            <TopNav />
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
