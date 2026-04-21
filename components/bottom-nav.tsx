"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "ホーム", icon: Home },
  { href: "/search", label: "検索", icon: Search },
  { href: "/internships", label: "体験", icon: Calendar },
  { href: "/matching", label: "診断", icon: Sparkles },
  { href: "/mypage", label: "マイ", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const isMatching = pathname?.startsWith("/matching") && pathname !== "/matching/result";
  if (isMatching) return null;

  return (
    <nav
      aria-label="メインナビゲーション"
      className="pointer-events-none fixed inset-x-0 bottom-3 z-40 px-3 md:hidden"
    >
      <div className="pointer-events-auto mx-auto flex max-w-sm items-center justify-between rounded-full border border-hairline bg-white/90 px-1.5 py-1.5 shadow-[0_12px_40px_-16px_rgba(11,11,15,0.25)] backdrop-blur-xl">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/home" && pathname?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-full py-1.5 text-[10px] font-medium transition-all",
                active
                  ? "bg-ink text-canvas"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              <Icon
                className="h-4 w-4"
                strokeWidth={active ? 2 : 1.5}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
