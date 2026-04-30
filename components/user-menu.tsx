"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User as UserIcon, RefreshCw, Settings } from "lucide-react";
import { signOutAction, switchAccountAction } from "@/app/actions";

export function UserMenu({
  displayName,
  email,
}: {
  displayName: string;
  email: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initial = (displayName || email || "?").trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-2 pr-4 text-sm font-medium text-canvas transition hover:bg-ink/90"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canvas text-[12px] font-bold text-ink">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate sm:inline">
          {displayName || "アカウント"}
        </span>
        <ChevronDown className="h-3.5 w-3.5 opacity-70" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border border-hairline bg-white shadow-[0_20px_48px_-16px_rgba(11,11,15,0.25)]"
        >
          <div className="border-b border-hairline px-4 py-3">
            <p className="text-[11px] uppercase tracking-wider text-ink-soft">
              ログイン中
            </p>
            <p className="mt-1 truncate text-[14px] font-bold text-ink">
              {displayName || "ゲスト"}
            </p>
            <p className="truncate text-[11px] text-ink-muted">{email}</p>
          </div>

          <div className="py-1">
            <MenuItem
              href="/mypage"
              icon={<UserIcon className="h-4 w-4" />}
              label="マイページ"
              onClose={() => setOpen(false)}
            />
            <MenuItem
              href="/profile/setup"
              icon={<Settings className="h-4 w-4" />}
              label="プロフィール編集"
              onClose={() => setOpen(false)}
            />
          </div>

          <div className="border-t border-hairline py-1">
            <form action={switchAccountAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-ink transition hover:bg-ink/5"
              >
                <RefreshCw className="h-4 w-4 text-ink-muted" />
                別のアカウントでログイン
              </button>
            </form>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-coral-500 transition hover:bg-coral-50"
              >
                <LogOut className="h-4 w-4" />
                ログアウト
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  icon,
  label,
  onClose,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink transition hover:bg-ink/5"
    >
      <span className="text-ink-muted">{icon}</span>
      {label}
    </Link>
  );
}
