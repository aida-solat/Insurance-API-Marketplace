"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileCheck,
  LayoutDashboard,
  MessageSquare,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";

const ITEMS = [
  { href: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/app/underwrite", label: "Underwriting", icon: ShieldCheck },
  { href: "/app/claims", label: "Claims", icon: FileCheck },
  { href: "/app/decisions", label: "Audit Log", icon: ScrollText },
  { href: "/app/chat", label: "Copilot", icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-5 md:flex">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-blue-50 text-[#0B2545] shadow-[inset_0_0_0_1px_rgba(11,37,69,0.15)]"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#0B2545]",
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4 transition",
                  active
                    ? "text-gold-400"
                    : "text-forest-300/70 group-hover:text-gold-300",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-xl border border-gold-500/15 bg-forest-900/60 p-3 text-xs text-forest-300/80">
        <p className="font-semibold text-gold-200">Heuristic mode</p>
        <p className="mt-1 leading-relaxed">
          Set an LLM API key in the backend <code>.env</code> to upgrade.
        </p>
      </div>
      <p className="mt-4 text-center text-[10px] text-forest-300/50">
        Built with{" "}
        <a
          href="https://deciwa.com"
          target="_blank"
          rel="noreferrer"
          className="text-gold-300/70 hover:text-gold-200"
        >
          Deciwa
        </a>
      </p>
    </aside>
  );
}
